import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodCategory } from "@/types/food";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/util/supabaseClient";
import FoodItemList from "./FoodItemList";
import { useState, useRef } from "react";

interface CategoryTabProps {
  category: FoodCategory;
  newItemValue: string;
  onNewItemChange: (value: string) => void;
  onAddItem: () => void;
  onToggleItem: (categoryId: string, itemId: string) => void;
  onIngredientAdded: () => void; // Callback to refresh ingredient count
}

interface IngredientWithUser {
  id: number;
  name: string;
  created_by: string;
  username: string;
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
  const addIngredientToListRef = useRef<
    ((ingredient: IngredientWithUser) => void) | null
  >(null);
  const deleteIngredientFromListRef = useRef<
    ((ingredientId: number) => void) | null
  >(null);

  const handleRegisterAddFunction = (
    addFunction: (ingredient: IngredientWithUser) => void
  ) => {
    addIngredientToListRef.current = addFunction;
  };

  const handleRegisterDeleteFunction = (
    deleteFunction: (ingredientId: number) => void
  ) => {
    deleteIngredientFromListRef.current = deleteFunction;
  };

  const handleAddIngredient = async () => {
    if (!newItemValue.trim()) {
      toast.error("Vänligen ange namn på en vara");
      return;
    }

    if (!currentUser?.id) {
      toast.error("Du måste vara inloggad för att lägga till varor");
      return;
    }

    try {
      // Check for duplicate ingredients in the same course (case-insensitive)
      const { data: existingIngredients, error: checkError } = await supabase
        .from("ingredient")
        .select("name")
        .eq("course_id", parseInt(category.id))
        .ilike("name", newItemValue.trim());

      if (checkError) {
        console.error("Error checking for duplicates:", checkError);
        toast.error("Misslyckades att kontrollera dubletter");
        return;
      }

      if (existingIngredients && existingIngredients.length > 0) {
        toast.error(`"${newItemValue.trim()}" finns redan i ${category.name}`);
        return;
      }

      const { data, error } = await supabase
        .from("ingredient")
        .insert({
          name: newItemValue.trim(),
          created_by: currentUser.id.toString(),
          course_id: parseInt(category.id),
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding ingredient:", error);
        toast.error("Misslyckades att lägga till vara");
        return;
      }

      toast.success(`Lade till ${newItemValue} i ${category.name}`);
      onNewItemChange(""); // Clear the input
      onIngredientAdded(); // Refresh the ingredient count

      // Add the ingredient directly to the list without refetching
      if (addIngredientToListRef.current && data) {
        addIngredientToListRef.current({
          id: data.id,
          name: data.name,
          created_by: data.created_by,
          username: currentUser.username, // We have the username from current user
        });
      }
    } catch (error) {
      console.error("Error in handleAddIngredient:", error);
      toast.error("Misslyckades att lägga till vara");
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
        <FoodItemList
          courseId={category.id}
          onRegisterAddFunction={handleRegisterAddFunction}
          onRegisterDeleteFunction={handleRegisterDeleteFunction}
          onIngredientDeleted={onIngredientAdded}
        />
      )}
    </div>
  );
};

export default CategoryTab;
