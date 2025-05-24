import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileText, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/util/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface ArrivalInfo {
  id: number;
  estimated_arrival: string;
  transportation: string;
  notes: string;
  user_id: string;
  username?: string;
}

const NotesCell = ({ notes }: { notes: string }) => {
  const MAX_LENGTH = 30;
  const [isOpen, setIsOpen] = useState(false);

  if (!notes || notes === "-") {
    return <span className="text-[#867e74]">-</span>;
  }

  // On mobile or if notes are long, show icon with popover
  if (notes.length > MAX_LENGTH) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-1 text-[#947b5f] hover:text-[#7f6a52] transition-colors"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Anteckningar</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" side="top" align="center">
          <div className="space-y-2">
            <h4 className="font-medium text-[#4a3c31]">Anteckningar</h4>
            <p className="text-sm text-[#867e74] break-words overflow-wrap-anywhere">
              {notes}
            </p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Show short notes directly on desktop
  return <span className="text-[#867e74] hidden sm:inline">{notes}</span>;
};

// On mobile, always show icon for any notes
const MobileNotesCell = ({ notes }: { notes: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!notes || notes === "-") {
    return <span className="text-[#867e74]">-</span>;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center text-[#947b5f] hover:text-[#7f6a52] transition-colors sm:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FileText className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" side="top" align="center">
        <div className="space-y-2">
          <h4 className="font-medium text-[#4a3c31]">Notes</h4>
          <p className="text-sm text-[#867e74] break-words overflow-wrap-anywhere">
            {notes}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ArrivalCoordination = () => {
  const { currentUser } = useAuth();
  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo[]>([]);
  const [newArrival, setNewArrival] = useState({
    date: "2025-05-29",
    time: "15:00",
    transportation: "",
    notes: "",
  });
  const [existingArrival, setExistingArrival] = useState<ArrivalInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchArrivalsWithUsernames = async () => {
    try {
      // Fetch all arrivals
      const { data: allArrivals, error: allError } = await supabase
        .from("arrival")
        .select("id, estimated_arrival, transportation, notes, user_id");

      if (allError) {
        console.error("Error fetching arrivals:", allError);
        return [];
      }

      if (!allArrivals || allArrivals.length === 0) {
        return [];
      }

      // Extract unique user IDs
      const userIds = [
        ...new Set(allArrivals.map((arrival) => arrival.user_id)),
      ];

      // Fetch usernames from simpleuser table
      const { data: users, error: usersError } = await supabase
        .from("simpleuser")
        .select("userid, username")
        .in("userid", userIds);

      if (usersError) {
        console.error("Error fetching users:", usersError);
        return allArrivals;
      }

      // Create a map of user ID to username
      const userMap = new Map(
        users?.map((user) => [user.userid.toString(), user.username]) || []
      );

      // Combine arrival data with usernames
      const arrivalsWithUsernames: ArrivalInfo[] = allArrivals.map(
        (arrival) => ({
          ...arrival,
          username: userMap.get(arrival.user_id) || "Unknown",
        })
      );

      return arrivalsWithUsernames;
    } catch (error) {
      console.error("Error in fetchArrivalsWithUsernames:", error);
      return [];
    }
  };

  // Fetch existing arrival info for current user
  useEffect(() => {
    const fetchExistingArrival = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("arrival")
          .select("id, estimated_arrival, transportation, notes, user_id")
          .eq("user_id", currentUser.id)
          .limit(1);

        if (error) {
          console.error("Error fetching arrival info:", error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const arrival = data[0];
          setExistingArrival(arrival);

          // Pre-populate form based on existing data
          const arrivalDate = new Date(arrival.estimated_arrival);
          const localDate = arrivalDate.toISOString().split("T")[0];
          const localTime = arrivalDate.toTimeString().slice(0, 5);

          setNewArrival({
            date: localDate,
            time: localTime,
            transportation: arrival.transportation,
            notes: arrival.notes,
          });
        } else {
          // No existing arrival, set default values
          setNewArrival({
            date: "2025-05-29",
            time: "15:00",
            transportation: "",
            notes: "",
          });
        }

        // Fetch all arrivals with usernames for display
        const arrivalsWithUsernames = await fetchArrivalsWithUsernames();
        setArrivalInfo(arrivalsWithUsernames);
      } catch (error) {
        console.error("Error fetching arrival info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingArrival();
  }, [currentUser?.id]);

  const handleAddArrival = async () => {
    if (!currentUser?.id) {
      toast.error("You must be logged in to save arrival information");
      return;
    }

    if (!newArrival.date || !newArrival.time || !newArrival.transportation) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Combine date and time for database storage
    const combinedDateTime = `${newArrival.date}T${newArrival.time}:00`;

    try {
      if (existingArrival) {
        // Update existing arrival
        const { error } = await supabase
          .from("arrival")
          .update({
            estimated_arrival: combinedDateTime,
            transportation: newArrival.transportation,
            notes: newArrival.notes,
          })
          .eq("id", existingArrival.id);

        if (error) {
          console.error("Error updating arrival info:", error);
          toast.error("Failed to update arrival information");
          return;
        }

        setExistingArrival({
          ...existingArrival,
          estimated_arrival: combinedDateTime,
          transportation: newArrival.transportation,
          notes: newArrival.notes,
        });
        toast.success("Arrival information updated!");
      } else {
        // Create new arrival
        const { data, error } = await supabase
          .from("arrival")
          .insert({
            estimated_arrival: combinedDateTime,
            transportation: newArrival.transportation,
            notes: newArrival.notes,
            user_id: currentUser.id,
          })
          .select("id, estimated_arrival, transportation, notes, user_id");

        if (error) {
          console.error("Error creating arrival info:", error);
          toast.error("Failed to save arrival information");
          return;
        }

        if (data && data.length > 0) {
          setExistingArrival(data[0]);
        }
        toast.success("Arrival information saved!");
      }

      // Refresh all arrivals with usernames for display
      const arrivalsWithUsernames = await fetchArrivalsWithUsernames();
      setArrivalInfo(arrivalsWithUsernames);

      // Switch back to view mode after saving
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving arrival info:", error);
      toast.error("Failed to save arrival information");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (existingArrival) {
      // Reset form to existing data
      const arrivalDate = new Date(existingArrival.estimated_arrival);
      const localDate = arrivalDate.toISOString().split("T")[0];
      const localTime = arrivalDate.toTimeString().slice(0, 5);

      setNewArrival({
        date: localDate,
        time: localTime,
        transportation: existingArrival.transportation,
        notes: existingArrival.notes,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!existingArrival) return;

    try {
      const { error } = await supabase
        .from("arrival")
        .delete()
        .eq("id", existingArrival.id);

      if (error) {
        console.error("Error deleting arrival info:", error);
        toast.error("Failed to delete arrival information");
        return;
      }

      // Clear existing arrival and reset form
      setExistingArrival(null);
      setNewArrival({
        date: "2025-05-29",
        time: "15:00",
        transportation: "",
        notes: "",
      });
      setIsEditing(false);

      // Refresh all arrivals with usernames for display
      const arrivalsWithUsernames = await fetchArrivalsWithUsernames();
      setArrivalInfo(arrivalsWithUsernames);

      toast.success("Arrival information deleted");
    } catch (error) {
      console.error("Error deleting arrival info:", error);
      toast.error("Failed to delete arrival information");
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
          <p className="text-[#867e74]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-[#4a3c31]">
          Estimerade ankomster
        </h3>
      </div>

      {/* Your Arrival Card */}
      <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5] mb-4">
        {existingArrival && !isEditing ? (
          // Show existing arrival details
          <div>
            <h4 className="font-medium text-[#4a3c31] mb-3">
              Din planerade ankomst
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-[#4a3c31] font-medium">Ankomsttid</Label>
                <p className="text-[#867e74]">
                  {new Date(existingArrival.estimated_arrival).toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-[#4a3c31] font-medium">Transport</Label>
                <p className="text-[#867e74]">
                  {existingArrival.transportation}
                </p>
              </div>
              {existingArrival.notes && (
                <div className="sm:col-span-2">
                  <Label className="text-[#4a3c31] font-medium">
                    Anteckningar
                  </Label>
                  <p className="text-[#867e74] break-words overflow-wrap-anywhere">
                    {existingArrival.notes}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="border-[#947b5f] text-[#947b5f] hover:bg-[#947b5f] hover:text-white"
              >
                <Edit className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">
                  Redigera ankomstdetaljer
                </span>
              </Button>

              <Button
                onClick={handleDelete}
                variant="outline"
                className="border-red-400 text-red-600 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">Ta bort</span>
              </Button>
            </div>
          </div>
        ) : (
          // Show form for adding/editing
          <div>
            <div className="space-y-4">
              {/* First row: Date, Time, Transportation */}
              <div className="flex flex-wrap gap-4">
                <div>
                  <Label htmlFor="arrival-date" className="text-[#4a3c31]">
                    Ankomstdatum *
                  </Label>
                  <Input
                    id="arrival-date"
                    type="date"
                    value={newArrival.date}
                    onChange={(e) =>
                      setNewArrival({ ...newArrival, date: e.target.value })
                    }
                    min="2025-05-29"
                    className="border-[#d1cdc3] [&::-webkit-calendar-picker-indicator]:bg-white [&::-webkit-calendar-picker-indicator]:cursor-pointer w-fit"
                  />
                </div>

                <div>
                  <Label htmlFor="arrival-time" className="text-[#4a3c31]">
                    Ankomsttid *
                  </Label>
                  <Input
                    id="arrival-time"
                    type="time"
                    value={newArrival.time}
                    onChange={(e) =>
                      setNewArrival({ ...newArrival, time: e.target.value })
                    }
                    className="border-[#d1cdc3] [&::-webkit-calendar-picker-indicator]:bg-white [&::-webkit-calendar-picker-indicator]:cursor-pointer w-fit"
                  />
                </div>

                <div>
                  <Label htmlFor="transportation" className="text-[#4a3c31]">
                    Transport *
                  </Label>
                  <Select
                    value={newArrival.transportation}
                    onValueChange={(value) =>
                      setNewArrival({ ...newArrival, transportation: value })
                    }
                  >
                    <SelectTrigger className="border-[#d1cdc3] w-fit min-w-40">
                      <SelectValue placeholder="Välj transportmedel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bil">Bil</SelectItem>
                      <SelectItem value="Tåg">Tåg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second row: Notes */}
              <div>
                <Label htmlFor="notes" className="text-[#4a3c31]">
                  Ytterligare anteckningar (valfritt)
                </Label>
                <Input
                  id="notes"
                  value={newArrival.notes}
                  onChange={(e) =>
                    setNewArrival({ ...newArrival, notes: e.target.value })
                  }
                  placeholder="ex. hämtar xyz i Borås"
                  className="border-[#d1cdc3]"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddArrival}
                className="bg-[#947b5f] hover:bg-[#7f6a52] text-white"
              >
                {existingArrival
                  ? "Uppdatera ankomstinfo"
                  : "Lägg till ankomstinfo"}
              </Button>

              {existingArrival && (
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="border-[#d1cdc3] text-[#867e74] hover:bg-[#f9f5f0]"
                >
                  Avbryt
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Everyone's Arrivals */}
      {arrivalInfo.length > 0 ? (
        <div>
          <h4 className="font-medium text-[#4a3c31] mb-3">
            Planerade ankomster
          </h4>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg border border-[#e8e8d5] overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-[#f0e6e4]">
                <tr>
                  <th className="px-4 py-2 text-left text-[#4a3c31]">Person</th>
                  <th className="px-4 py-2 text-left text-[#4a3c31]">
                    Ankomsttid
                  </th>
                  <th className="px-4 py-2 text-left text-[#4a3c31]">
                    Transport
                  </th>
                  <th className="px-4 py-2 text-left text-[#4a3c31]">
                    Anteckningar
                  </th>
                </tr>
              </thead>
              <tbody>
                {arrivalInfo.map((info, index) => (
                  <tr
                    key={info.id}
                    className={index % 2 === 0 ? "bg-[#f9f5f0]" : "bg-white"}
                  >
                    <td className="px-4 py-3 text-[#4a3c31]">
                      {capitalizeFirstLetter(info.username || "Unknown")}
                    </td>
                    <td className="px-4 py-3 text-[#867e74]">
                      {
                        new Date(info.estimated_arrival)
                          .toISOString()
                          .split("T")[0]
                      }{" "}
                      {new Date(info.estimated_arrival).toLocaleTimeString(
                        undefined,
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#867e74]">
                      {info.transportation}
                    </td>
                    <td className="px-4 py-3 text-[#867e74]">
                      <NotesCell notes={info.notes || "-"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden space-y-3">
            {arrivalInfo.map((info) => (
              <div
                key={info.id}
                className="bg-white rounded-lg border border-[#e8e8d5] p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-[#4a3c31]">
                    {capitalizeFirstLetter(info.username || "Unknown")}
                  </h5>
                  {info.notes && info.notes !== "-" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-[#947b5f] hover:text-[#7f6a52] transition-colors">
                          <FileText className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-3"
                        side="top"
                        align="end"
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-[#4a3c31]">
                            Anteckningar
                          </h4>
                          <p className="text-sm text-[#867e74] break-words overflow-wrap-anywhere">
                            {info.notes}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#867e74]">Ankomst:</span>
                    <span className="text-sm text-[#4a3c31]">
                      {
                        new Date(info.estimated_arrival)
                          .toISOString()
                          .split("T")[0]
                      }{" "}
                      {new Date(info.estimated_arrival).toLocaleTimeString(
                        undefined,
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#867e74]">Transport:</span>
                    <span className="text-sm text-[#4a3c31]">
                      {info.transportation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[#867e74] italic">Inga ankomster planerade än</p>
      )}
    </div>
  );
};

export default ArrivalCoordination;
