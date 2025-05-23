import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import supabase from "@/util/supabaseClient";

interface FoodItemListProps {
  courseId: string;
}

interface IngredientWithUser {
  id: number;
  name: string;
  created_by: string;
  username: string;
}

const getUserColor = (username: string): string => {
  const firstLetter = username.charAt(0).toLowerCase();
  const lowerUsername = username.toLowerCase();

  // Handle specific name conflicts
  if (firstLetter === "a") {
    if (lowerUsername.startsWith("anna")) {
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"; // Anna
    } else if (lowerUsername.startsWith("axel")) {
      return "bg-sky-100 text-sky-800 hover:bg-sky-100 hover:text-sky-800"; // Axel
    }
  }

  if (firstLetter === "m") {
    if (lowerUsername.startsWith("mikael")) {
      return "bg-pink-100 text-pink-800 hover:bg-pink-100 hover:text-pink-800"; // Mikael
    } else if (lowerUsername.startsWith("mia")) {
      return "bg-rose-100 text-rose-800 hover:bg-rose-100 hover:text-rose-800"; // Mia
    }
  }

  const colors = {
    d: "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800", // Daniel
    g: "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800", // Gabrielle
    h: "bg-orange-100 text-orange-800 hover:bg-orange-100 hover:text-orange-800", // Håkan
    i: "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800", // Inger
    t: "bg-teal-100 text-teal-800 hover:bg-teal-100 hover:text-teal-800", // Thor
  };

  return (
    colors[firstLetter as keyof typeof colors] ||
    "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
  );
};

const FoodItemList = ({ courseId }: FoodItemListProps) => {
  const [ingredients, setIngredients] = useState<IngredientWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      // First, fetch ingredients
      const { data: ingredients, error: ingredientsError } = await supabase
        .from("ingredient")
        .select("id, name, created_by")
        .eq("course_id", parseInt(courseId));

      if (ingredientsError) {
        console.error("Error fetching ingredients:", ingredientsError);
        return;
      }

      if (!ingredients || ingredients.length === 0) {
        setIngredients([]);
        return;
      }

      // Extract unique user IDs
      const userIds = [...new Set(ingredients.map((ing) => ing.created_by))];

      // Fetch usernames from simpleuser table
      const { data: users, error: usersError } = await supabase
        .from("simpleuser")
        .select("userid, username")
        .in("userid", userIds);

      if (usersError) {
        console.error("Error fetching users:", usersError);
        return;
      }

      // Create a map of user ID to username
      const userMap = new Map(
        users?.map((user) => [user.userid.toString(), user.username]) || []
      );

      // Combine ingredient data with usernames
      const ingredientsWithUsers: IngredientWithUser[] = ingredients.map(
        (ingredient) => ({
          id: ingredient.id,
          name: ingredient.name,
          created_by: ingredient.created_by,
          username: userMap.get(ingredient.created_by) || "Unknown",
        })
      );

      setIngredients(ingredientsWithUsers);
    } catch (error) {
      console.error("Error in fetchIngredients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [courseId]);

  if (loading) {
    return (
      <p className="text-[#867e74] italic text-sm">Laddar ingredienser...</p>
    );
  }

  if (ingredients.length === 0) {
    return (
      <p className="text-[#b9b3aa] italic text-sm">
        Inga ingredienser tillagda ännu.
      </p>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto pr-1">
      <div className="space-y-2">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex items-center gap-3 border-b border-[#f0e6e4] pb-2"
          >
            <span className="text-[#4a3c31] flex-none max-w-xs truncate">
              {ingredient.name}
            </span>
            <Badge
              className={`text-xs shrink-0 border-0 ${getUserColor(
                ingredient.username
              )}`}
              style={{
                transition: "none",
              }}
            >
              {ingredient.username}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodItemList;
