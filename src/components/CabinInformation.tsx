import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";import { toast } from "sonner";
import tripData from "@/static/tripInformation.json"; // Import the JSON data
import { ExternalLinkIcon } from "lucide-react";

interface LinenChoice {
  name: string;
  choice: "bringing" | "rent";
  quantity: number;
}

interface CabinInformationProps {
  parkingInfo: string;
  amenitiesInfo: string;
  activitiesInfo: { name: string; url: string }[];
}

const CabinInformation = ({
  parkingInfo,
  amenitiesInfo,
  activitiesInfo,
}: CabinInformationProps) => {


    const [activities, setActivities] = useState(tripData.information.activities);

  const [linenChoices, setLinenChoices] = useState<LinenChoice[]>([]);
  const [newFamily, setNewFamily] = useState({
    name: "",
    choice: "bringing" as "bringing" | "rent",
    quantity: 1,
  });

  

  const addLinenChoice = () => {
    if (!newFamily.name.trim()) {
      toast.error("Please enter a family name");
      return;
    }

    setLinenChoices([...linenChoices, { ...newFamily }]);
    setNewFamily({
      name: "",
      choice: "bringing",
      quantity: 1,
    });

    toast.success("Linen choice added!");
  };

  const totalRentals = linenChoices.reduce((total, family) => {
    if (family.choice === "rent") {
      return total + family.quantity;
    }
    return total;
  }, 0);

  const totalCost = totalRentals * 200;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md border border-[#e8e8d5]">
        <h2 className="text-2xl font-bold text-[#4a3c31] mb-4">Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
                            <div className="flex justify-between items-center mb-2">                <h3 className="text-lg font-bold text-[#4a3c31]">Parkering</h3>              </div>              <p className="text-[#4a3c31]">{tripData.information.parking}</p>
            </div>

            <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-[#4a3c31]">
                  Lokala aktiviteter/länkar
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                {activities.map((activity, index) => (
                  <div key={index} className="border-b border-[#e8e8d5] pb-2">
                    <a
                      href={activity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#947b5f] hover:text-[#7f6a52] underline"
                    >
                      <div className="flex items-center gap-2">
                        {activity.name}
                        <ExternalLinkIcon className="w-4 h-4 inline-block" />
                      </div>
                    </a>
                  </div>
                ))}
              </div>

              
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Tabs defaultValue="amenities" className="w-full">
              <TabsList className="bg-[#f0e6e4] w-full">
                <TabsTrigger
                  value="amenities"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#4a3c31] text-[#867e74]"
                >
                  Amenities
                </TabsTrigger>
                <TabsTrigger
                  value="linens"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#4a3c31] text-[#867e74]"
                >
                  Bed Linens
                </TabsTrigger>
              </TabsList>

              <TabsContent value="amenities" className="mt-4">
                <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
                                    <div className="flex justify-between items-center mb-2">                    <h3 className="text-lg font-bold text-[#4a3c31]">                      Cabin Utilities & Amenities                    </h3>                  </div>                  <div className="max-h-96 overflow-y-auto">                    <p className="text-[#4a3c31] whitespace-pre-line">                      {amenitiesInfo}                    </p>                  </div>
                </div>
              </TabsContent>

              <TabsContent value="linens" className="mt-4">
                <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
                  <h3 className="text-lg font-bold text-[#4a3c31] mb-1">
                    Bed Linen & Towels
                  </h3>
                  <p className="text-[#867e74] mb-4">
                    You can bring your own bed linen and towels, or rent a set
                    for 200 SEK per person for the entire stay.
                  </p>

                  <div className="bg-[#f0e6e4] p-4 rounded-md mb-4">
                    <h4 className="font-medium text-[#4a3c31] mb-3">Sign Up</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="family-name" className="text-[#4a3c31]">
                          Family/Person Name
                        </Label>
                        <Input
                          id="family-name"
                          placeholder="Enter your name or family name"
                          value={newFamily.name}
                          onChange={(e) =>
                            setNewFamily({ ...newFamily, name: e.target.value })
                          }
                          className="border-[#d1cdc3]"
                        />
                      </div>

                      <div>
                        <Label className="text-[#4a3c31]">Linen Choice</Label>
                        <RadioGroup
                          value={newFamily.choice}
                          onValueChange={(value) =>
                            setNewFamily({
                              ...newFamily,
                              choice: value as "bringing" | "rent",
                            })
                          }
                          className="flex flex-col space-y-1 mt-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="bringing"
                              id="bringing"
                              className="border-[#d1cdc3] text-[#947b5f]"
                            />
                            <Label
                              htmlFor="bringing"
                              className="text-[#4a3c31]"
                            >
                              Bringing my own
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="rent"
                              id="rent"
                              className="border-[#d1cdc3] text-[#947b5f]"
                            />
                            <Label htmlFor="rent" className="text-[#4a3c31]">
                              Rent (200 SEK per person)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {newFamily.choice === "rent" && (
                        <div>
                          <Label htmlFor="quantity" className="text-[#4a3c31]">
                            Number of people
                          </Label>
                          <Input
                            id="quantity"
                            type="number"
                            min={1}
                            value={newFamily.quantity}
                            onChange={(e) =>
                              setNewFamily({
                                ...newFamily,
                                quantity: parseInt(e.target.value) || 1,
                              })
                            }
                            className="border-[#d1cdc3] w-24"
                          />
                        </div>
                      )}

                      <Button
                        onClick={addLinenChoice}
                        className="bg-[#947b5f] hover:bg-[#7f6a52] text-white"
                      >
                        Add to List
                      </Button>
                    </div>
                  </div>

                  {linenChoices.length > 0 && (
                    <div>
                      <h4 className="font-medium text-[#4a3c31] mb-2">
                        Current Sign-ups
                      </h4>
                      <div className="bg-white rounded-md border border-[#e8e8d5]">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#e8e8d5]">
                              <th className="text-left p-2 text-[#4a3c31]">
                                Name
                              </th>
                              <th className="text-left p-2 text-[#4a3c31]">
                                Choice
                              </th>
                              <th className="text-right p-2 text-[#4a3c31]">
                                Quantity
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {linenChoices.map((family, index) => (
                              <tr
                                key={index}
                                className="border-b border-[#e8e8d5]"
                              >
                                <td className="p-2 text-[#4a3c31]">
                                  {family.name}
                                </td>
                                <td className="p-2 text-[#4a3c31]">
                                  {family.choice === "bringing"
                                    ? "Bringing own"
                                    : `Renting (${family.quantity} ${
                                        family.quantity === 1
                                          ? "person"
                                          : "people"
                                      })`}
                                </td>
                                <td className="p-2 text-right text-[#4a3c31]">
                                  {family.choice === "rent"
                                    ? `${family.quantity * 200} SEK`
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 p-3 bg-[#f0e6e4] rounded-md">
                        <div className="flex justify-between font-medium">
                          <span className="text-[#4a3c31]">
                            Total rentals needed:
                          </span>
                          <span className="text-[#4a3c31]">
                            {totalRentals} sets
                          </span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span className="text-[#4a3c31]">Total cost:</span>
                          <span className="text-[#4a3c31]">
                            {totalCost} SEK
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinInformation;
