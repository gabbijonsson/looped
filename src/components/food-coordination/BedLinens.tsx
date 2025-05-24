import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface LinenChoice {
  name: string;
  choice: "bringing" | "rent";
  quantity: number;
}

const BedLinens = () => {
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
    <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
      <h3 className="text-lg font-bold text-[#4a3c31] mb-1">
        Bed Linen & Towels
      </h3>
      <p className="text-[#867e74] mb-4">
        You can bring your own bed linen and towels, or rent a set for 200 SEK
        per person for the entire stay.
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
                <Label htmlFor="bringing" className="text-[#4a3c31]">
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
          <h4 className="font-medium text-[#4a3c31] mb-2">Current Sign-ups</h4>
          <div className="bg-white rounded-md border border-[#e8e8d5]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8e8d5]">
                  <th className="text-left p-2 text-[#4a3c31]">Name</th>
                  <th className="text-left p-2 text-[#4a3c31]">Choice</th>
                  <th className="text-right p-2 text-[#4a3c31]">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {linenChoices.map((family, index) => (
                  <tr key={index} className="border-b border-[#e8e8d5]">
                    <td className="p-2 text-[#4a3c31]">{family.name}</td>
                    <td className="p-2 text-[#4a3c31]">
                      {family.choice === "bringing"
                        ? "Bringing own"
                        : `Renting (${family.quantity} ${
                            family.quantity === 1 ? "person" : "people"
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
              <span className="text-[#4a3c31]">Total rentals needed:</span>
              <span className="text-[#4a3c31]">{totalRentals} sets</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-[#4a3c31]">Total cost:</span>
              <span className="text-[#4a3c31]">{totalCost} SEK</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedLinens;
