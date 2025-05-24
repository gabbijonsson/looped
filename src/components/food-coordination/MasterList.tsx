import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FoodCategory } from "@/types/food";
import supabase from "@/util/supabaseClient";
import React from "react";

interface MasterListProps {
  categories: FoodCategory[];
  onToggleItem: (categoryId: string, itemId: string) => void;
}

interface IngredientWithCourses {
  name: string;
  courses: { id: string; name: string }[];
}

const getCourseColor = (courseId: string): string => {
  // Create consistent colors based on course ID
  const colors = [
    "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800",
    "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800",
    "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800",
    "bg-orange-100 text-orange-800 hover:bg-orange-100 hover:text-orange-800",
    "bg-pink-100 text-pink-800 hover:bg-pink-100 hover:text-pink-800",
    "bg-teal-100 text-teal-800 hover:bg-teal-100 hover:text-teal-800",
    "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800",
    "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 hover:text-indigo-800",
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800",
    "bg-rose-100 text-rose-800 hover:bg-rose-100 hover:text-rose-800",
  ];

  // Use course ID to consistently assign colors
  const colorIndex = parseInt(courseId) % colors.length;
  return colors[colorIndex];
};

const MasterList = ({ categories }: MasterListProps) => {
  const [ingredients, setIngredients] = useState<IngredientWithCourses[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllIngredients = async () => {
    setLoading(true);
    try {
      // Get only categories without external links
      const validCategories = categories.filter((cat) => !cat.external_link);
      const courseIds = validCategories.map((cat) => parseInt(cat.id));

      if (courseIds.length === 0) {
        setIngredients([]);
        setLoading(false);
        return;
      }

      // Fetch all ingredients from valid courses
      const { data: allIngredients, error } = await supabase
        .from("ingredient")
        .select("name, course_id")
        .in("course_id", courseIds);

      if (error) {
        console.error("Error fetching ingredients:", error);
        setIngredients([]);
        setLoading(false);
        return;
      }

      if (!allIngredients || allIngredients.length === 0) {
        setIngredients([]);
        setLoading(false);
        return;
      }

      // Create a map to group ingredients by name (case-insensitive)
      const ingredientMap = new Map<string, IngredientWithCourses>();

      allIngredients.forEach((ingredient) => {
        const normalizedName = ingredient.name.toLowerCase().trim();
        const course = validCategories.find(
          (cat) => cat.id === ingredient.course_id.toString()
        );

        if (course) {
          if (ingredientMap.has(normalizedName)) {
            const existing = ingredientMap.get(normalizedName)!;
            // Check if this course is already added
            if (!existing.courses.some((c) => c.id === course.id)) {
              existing.courses.push({ id: course.id, name: course.name });
            }
          } else {
            ingredientMap.set(normalizedName, {
              name: ingredient.name, // Use original casing for display
              courses: [{ id: course.id, name: course.name }],
            });
          }
        }
      });

      // Convert to array and sort alphabetically
      const sortedIngredients = Array.from(ingredientMap.values()).sort(
        (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      setIngredients(sortedIngredients);
    } catch (error) {
      console.error("Error in fetchAllIngredients:", error);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllIngredients();
  }, [categories]);

  if (loading) {
    return (
      <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
        <h3 className="text-xl font-bold text-[#4a3c31] mb-3">
          Sammanställning
        </h3>
        <p className="text-[#867e74] italic text-sm">Laddar ingredienser...</p>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
        <h3 className="text-xl font-bold text-[#4a3c31] mb-3">
          Sammanställning
        </h3>
        <p className="text-[#b9b3aa] italic text-sm">
          Inga ingredienser tillagda ännu.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
      <h3 className="text-xl font-bold text-[#4a3c31] mb-3">Sammanställning</h3>
      <p className="text-[#867e74] text-sm mb-4">
        Alla ingredienser från samtliga måltider i alfabetisk ordning
      </p>

      <div className="max-h-96 overflow-y-auto pr-1">
        <div className="grid grid-cols-[auto_auto] gap-x-3 gap-y-2 w-fit">
          {ingredients.map((ingredient, index) => (
            <div key={`${ingredient.name}-${index}`} className="contents">
              {/* Ingredient name - auto-sized based on longest name */}
              <span className="text-[#4a3c31] truncate border-b border-[#e8e8d5] pb-2">
                {ingredient.name}
              </span>

              {/* Course badges - auto-sized based on longest course names */}
              <div className="flex flex-wrap gap-1 border-b border-transparent pb-2">
                {ingredient.courses.map((course) => (
                  <Badge
                    key={course.id}
                    className={`text-xs shrink-0 border-0 ${getCourseColor(
                      course.id
                    )}`}
                    style={{
                      transition: "none",
                    }}
                  >
                    {course.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasterList;
