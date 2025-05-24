import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import tripData from "@/static/tripInformation.json"; // Import the JSON data
import BedLinens from "./food-coordination/BedLinens";
import GeneralItinerary from "./trip-schedule/GeneralItinerary";

interface ArrivalInfo {
  id: string;
  familyName: string;
  eta: string;
  transport: string;
  notes: string;
}

const TripSchedule = () => {
  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo[]>([]);
  const [newArrival, setNewArrival] = useState<ArrivalInfo>({
    id: Date.now().toString(),
    familyName: "",
    eta: "",
    transport: "",
    notes: "",
  });

  const handleAddArrival = () => {
    if (!newArrival.familyName || !newArrival.eta || !newArrival.transport) {
      toast.error("Please fill in all required fields");
      return;
    }

    setArrivalInfo([...arrivalInfo, { ...newArrival }]);
    setNewArrival({
      id: Date.now().toString(),
      familyName: "",
      eta: "",
      transport: "",
      notes: "",
    });

    toast.success("Arrival information added!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md border border-[#e8e8d5]">
        <h2 className="text-2xl font-bold text-[#4a3c31] mb-4">
          Reseplanering & Logistik
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
            <h3 className="font-bold text-lg text-[#4a3c31] mb-2">Ankomst</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#f0e6e4] flex items-center justify-center">
                <LogIn className="text-[#947b5f] h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-[#867e74]">Incheckning</p>
                <p className="font-medium text-[#4a3c31]">
                  {new Date(tripData.checkInDateFull).toLocaleString(
                    undefined,
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
            <h3 className="font-bold text-lg text-[#4a3c31] mb-2">Avresa</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#f0e6e4] flex items-center justify-center">
                <LogOut className="text-[#947b5f] h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-[#867e74]">Utcheckning</p>
                <p className="font-medium text-[#4a3c31]">
                  {new Date(tripData.checkOutDateFull).toLocaleString(
                    undefined,
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New wrapper for Reservations and Itinerary */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* General Itinerary Section (now on the left) */}
          <GeneralItinerary />

          {/* Right column with Bed Linens and Reservations */}
          <div className="md:w-1/2 flex flex-col gap-6">
            {/* Bed Linens Section */}
            <div className="flex flex-col overflow-hidden">
              <h3 className="font-bold text-lg text-[#4a3c31] mb-3">
                Sängkläder
              </h3>
              <BedLinens />
            </div>

            {/* Reservations Section */}
            <div className="flex flex-col overflow-hidden">
              <h3 className="font-bold text-lg text-[#4a3c31] mb-3">
                Reservationer
              </h3>
              <div className="flex flex-row gap-4 flex-wrap flex-1">
                {tripData.reservations && tripData.reservations.length > 0 ? (
                  tripData.reservations.map((reservation) => (
                    <div
                      key={reservation.location}
                      className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5] w-fit flex-grow"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <p className="font-medium text-[#4a3c31]">
                            {reservation.location}
                          </p>
                          <p className="text-sm text-[#867e74]">
                            {new Date(reservation.date).toLocaleDateString(
                              undefined,
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                            , {reservation.time}
                          </p>
                        </div>
                        {reservation.link && (
                          <a
                            href={reservation.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#947b5f] underline hover:text-[#7f6a52] mt-2 self-start"
                          >
                            View Details / Menu
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#867e74] italic">
                    Inga reservationer finns.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Arrival Coordination Section (moved to the bottom) */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-[#4a3c31]">
              Arrival Coordination
            </h3>
          </div>

          <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5] mb-4">
            <h4 className="font-medium text-[#4a3c31] mb-3">
              Add Your Arrival Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="family-name" className="text-[#4a3c31]">
                  Family Name *
                </Label>
                <Input
                  id="family-name"
                  value={newArrival.familyName}
                  onChange={(e) =>
                    setNewArrival({ ...newArrival, familyName: e.target.value })
                  }
                  placeholder="e.g., Smith Family"
                  className="border-[#d1cdc3]"
                />
              </div>

              <div>
                <Label htmlFor="eta" className="text-[#4a3c31]">
                  Estimated Arrival Time *
                </Label>
                <Input
                  id="eta"
                  value={newArrival.eta}
                  onChange={(e) =>
                    setNewArrival({ ...newArrival, eta: e.target.value })
                  }
                  placeholder="e.g., May 28th, 16:00"
                  className="border-[#d1cdc3]"
                />
              </div>

              <div>
                <Label htmlFor="transport" className="text-[#4a3c31]">
                  Mode of Transportation *
                </Label>
                <Input
                  id="transport"
                  value={newArrival.transport}
                  onChange={(e) =>
                    setNewArrival({ ...newArrival, transport: e.target.value })
                  }
                  placeholder="e.g., Car, Train, etc."
                  className="border-[#d1cdc3]"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-[#4a3c31]">
                  Additional Notes (optional)
                </Label>
                <Input
                  id="notes"
                  value={newArrival.notes}
                  onChange={(e) =>
                    setNewArrival({ ...newArrival, notes: e.target.value })
                  }
                  placeholder="e.g., Stopping for lunch on the way"
                  className="border-[#d1cdc3]"
                />
              </div>
            </div>

            <Button
              onClick={handleAddArrival}
              className="mt-4 bg-[#947b5f] hover:bg-[#7f6a52] text-white"
            >
              Add Arrival Info
            </Button>
          </div>

          {arrivalInfo.length > 0 ? (
            <div className="bg-white rounded-lg border border-[#e8e8d5] overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-[#f0e6e4]">
                  <tr>
                    <th className="px-4 py-2 text-left text-[#4a3c31]">
                      Family
                    </th>
                    <th className="px-4 py-2 text-left text-[#4a3c31]">ETA</th>
                    <th className="px-4 py-2 text-left text-[#4a3c31]">
                      Transportation
                    </th>
                    <th className="px-4 py-2 text-left text-[#4a3c31]">
                      Notes
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
                        {info.familyName}
                      </td>
                      <td className="px-4 py-3 text-[#867e74]">{info.eta}</td>
                      <td className="px-4 py-3 text-[#867e74]">
                        {info.transport}
                      </td>
                      <td className="px-4 py-3 text-[#867e74]">
                        {info.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[#867e74] italic">No arrivals scheduled yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripSchedule;
