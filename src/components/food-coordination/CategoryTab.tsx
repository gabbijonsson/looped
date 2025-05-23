import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodCategory } from "@/types/food";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/util/supabaseClient";
import FoodItemList from "./FoodItemList";

interface CategoryTabProps {
  category: FoodCategory;
  newItemValue: string;
  onNewItemChange: (value: string) => void;
  onAddItem: () => void;
  onToggleItem: (categoryId: string, itemId: string) => void;
  onIngredientAdded: () => void; // Callback to refresh ingredient count
}

const CategoryTab = ({
  category,
  newItemValue,
  onNewItemChange,
  onAddItem,
  onToggleItem,
  onIngredientAdded,
}: CategoryTabProps) => {
  const { currentUser } = useAuth();

  const handleAddIngredient = async () => {
    if (!newItemValue.trim()) {
      toast.error("Please enter an ingredient name");
      return;
    }

    if (!currentUser?.username) {
      toast.error("You must be logged in to add ingredients");
      return;
    }

    try {
      const { error } = await supabase.from("ingredient").insert({
        name: newItemValue.trim(),
        created_by: currentUser.username,
        course_id: parseInt(category.id),
      });

      if (error) {
        console.error("Error adding ingredient:", error);
        toast.error("Failed to add ingredient");
        return;
      }

      toast.success(`Added ${newItemValue} to ${category.name}`);
      onNewItemChange(""); // Clear the input
      onIngredientAdded(); // Refresh the ingredient count
    } catch (error) {
      console.error("Error in handleAddIngredient:", error);
      toast.error("Failed to add ingredient");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-[#e8e8d5]">
      <h3 className="text-lg font-bold text-[#4a3c31] mb-1">{category.name}</h3>
      <p className="text-[#867e74] italic mb-3">{category.mainItem}</p>

      {!category.external_link && (
        <div className="flex mb-3">
          <Input
            placeholder="Lägg till ingrediens"
            value={newItemValue}
            onChange={(e) => onNewItemChange(e.target.value)}
            className="border-[#d1cdc3] mr-2"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddIngredient();
              }
            }}
          />
          <Button
            onClick={handleAddIngredient}
            className="bg-[#947b5f] hover:bg-[#7f6a52] text-white"
          >
            Lägg till
          </Button>
        </div>
      )}

      {category.external_link ? (
        <p className="text-[#b9b3aa] italic text-sm">
          Denna måltid har en extern meny.
        </p>
      ) : (
        <FoodItemList courseId={category.id} />
      )}
    </div>
  );
};

export default CategoryTab;
