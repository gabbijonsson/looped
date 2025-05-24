import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import supabase from "@/util/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface LinenChoice {
  id: string;
  choice: "bringing" | "rent";
  quantity: number;
}

interface ExistingOrder {
  id: number;
  amount: number;
  ordered_by: string;
}

const BedLinens = () => {
  const { currentUser } = useAuth();
  const [newChoice, setNewChoice] = useState({
    choice: "bringing" as "bringing" | "rent",
    quantity: 0,
  });
  const [existingOrder, setExistingOrder] = useState<ExistingOrder | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Fetch existing bedlinen order for current user
  useEffect(() => {
    const fetchExistingOrder = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("bedlinen")
          .select("id, amount, ordered_by")
          .eq("ordered_by", currentUser.id)
          .limit(1);

        if (error) {
          console.error("Error fetching bedlinen order:", error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const order = data[0];
          setExistingOrder(order);

          // Pre-populate form based on existing order
          if (order.amount === 0) {
            setNewChoice({
              choice: "bringing",
              quantity: 0,
            });
          } else {
            setNewChoice({
              choice: "rent",
              quantity: order.amount,
            });
          }
        } else {
          // No existing order, set default values
          setNewChoice({
            choice: "bringing",
            quantity: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching bedlinen order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingOrder();
  }, [currentUser?.id]);

  const addLinenChoice = async () => {
    if (!currentUser?.id) {
      toast.error("You must be logged in to make a selection");
      return;
    }

    const quantity = newChoice.choice === "bringing" ? 0 : newChoice.quantity;

    try {
      if (existingOrder) {
        // Update existing order
        const { error } = await supabase
          .from("bedlinen")
          .update({ amount: quantity })
          .eq("id", existingOrder.id);

        if (error) {
          console.error("Error updating bedlinen order:", error);
          toast.error("Failed to update order");
          return;
        }

        setExistingOrder({ ...existingOrder, amount: quantity });
        toast.success("Bedlinen choice updated!");
      } else {
        // Create new order
        const { data, error } = await supabase
          .from("bedlinen")
          .insert({ amount: quantity, ordered_by: currentUser.id })
          .select("id, amount, ordered_by");

        if (error) {
          console.error("Error creating bedlinen order:", error);
          toast.error("Failed to save order");
          return;
        }

        if (data && data.length > 0) {
          setExistingOrder(data[0]);
        }
        toast.success("Bedlinen choice added!");
      }
    } catch (error) {
      console.error("Error saving bedlinen order:", error);
      toast.error("Failed to save order");
    }
  };

  // Calculate estimated price for current input
  const estimatedPrice =
    newChoice.choice === "rent" ? newChoice.quantity * 200 : 0;

  if (loading) {
    return (
      <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
        <p className="text-[#867e74]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
      <p className="text-[#867e74] mb-4">
        Du kan antingen ta med egna sängkläder och handdukar, eller hyra detta
        för 200 SEK per person för hela vistelsen.
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <Label className="text-[#4a3c31]">Jag vill</Label>
          <RadioGroup
            value={newChoice.choice}
            onValueChange={(value) =>
              setNewChoice({
                ...newChoice,
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
                Ta med egna sängkläder och handdukar
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="rent"
                id="rent"
                className="border-[#d1cdc3] text-[#947b5f]"
              />
              <Label htmlFor="rent" className="text-[#4a3c31]">
                Hyra (200 SEK per person)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="quantity" className="text-[#4a3c31]">
            Antal set
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="quantity"
              type="number"
              min={0}
              value={newChoice.quantity}
              onChange={(e) =>
                setNewChoice({
                  ...newChoice,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              disabled={newChoice.choice === "bringing"}
              className="border-[#d1cdc3] w-24"
            />
            {newChoice.choice === "rent" && estimatedPrice > 0 && (
              <span className="text-[#867e74] text-sm">
                = {estimatedPrice} SEK
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={addLinenChoice}
          className="bg-[#947b5f] hover:bg-[#7f6a52] text-white"
        >
          {existingOrder ? "Uppdatera beställning" : "Beställ"}
        </Button>
      </div>

      {existingOrder && (
        <div>
          <div className="bg-white rounded-md border border-[#e8e8d5]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8e8d5]">
                  <th className="text-left p-2 text-[#4a3c31]">Val</th>
                  <th className="text-right p-2 text-[#4a3c31]">Antal</th>
                  <th className="text-right p-2 text-[#4a3c31]">Kostnad</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e8e8d5]">
                  <td className="p-2 text-[#4a3c31]">
                    {existingOrder.amount === 0 ? "Ta med egna" : "Hyra"}
                  </td>
                  <td className="p-2 text-right text-[#4a3c31]">
                    {existingOrder.amount === 0 ? "-" : existingOrder.amount}
                  </td>
                  <td className="p-2 text-right text-[#4a3c31]">
                    {existingOrder.amount === 0
                      ? "-"
                      : `${existingOrder.amount * 200} SEK`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedLinens;
