import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/util/supabaseClient";
import { Course, FoodCategory } from "@/types/food";
import CategoryCard from "./food-coordination/CategoryCard";
import MasterList from "./food-coordination/MasterList";
import CategoryTab from "./food-coordination/CategoryTab";

const fetchCourses = async () => {
  const { data: courses, error } = await supabase.from("course").select();
  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
  return courses || [];
};

const fetchIngredientCounts = async (courseIds: number[]) => {
  const counts: Record<number, number> = {};

  for (const courseId of courseIds) {
    const { count, error } = await supabase
      .from("ingredient")
      .select("*", { count: "exact", head: true })
      .eq("course_id", courseId);

    if (error) {
      console.error(
        `Error fetching ingredient count for course ${courseId}:`,
        error
      );
      counts[courseId] = 0;
    } else {
      counts[courseId] = count || 0;
    }
  }

  return counts;
};

const transformCourses = (
  courses: Course[],
  ingredientCounts: Record<number, number>
): FoodCategory[] => {
  return courses.map((course) => {
    let formattedDateTime: string;

    if (!course.date) {
      formattedDateTime = "Övrigt";
    } else {
      const date = new Date(course.date);
      const hours = date.getHours();
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      if (hours === 18) {
        formattedDateTime = `Middag - ${formattedDate}`;
      } else if (hours === 12) {
        formattedDateTime = `Lunch - ${formattedDate}`;
      } else {
        // Fallback for other times
        formattedDateTime = `Måltid - ${formattedDate}`;
      }
    }

    return {
      id: course.id.toString(),
      name: course.name || "Övrigt",
      mainItem: formattedDateTime,
      items: course.external_link ? undefined : [],
      external_link: course.external_link,
      ingredientCount: ingredientCounts[course.id] || 0,
    };
  });
};

const FoodCoordination = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [showMasterList, setShowMasterList] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const refreshIngredientCounts = async () => {
    try {
      const courseIds = courses.map((course) => course.id);
      const ingredientCounts = await fetchIngredientCounts(courseIds);

      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          ingredientCount: ingredientCounts[parseInt(category.id)] || 0,
        }))
      );
    } catch (error) {
      console.error("Error refreshing ingredient counts:", error);
    }
  };

  const handleAddItem = (categoryId: string) => {
    if (!newItems[categoryId]?.trim()) {
      toast.error("Please enter an item");
      return;
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        if (!category.items) {
          toast.error(
            `Cannot add items to "${category.name}" as it does not support item listing.`
          );
          return category;
        }
        return {
          ...category,
          items: [
            ...(category.items || []),
            {
              id: Date.now().toString(),
              name: newItems[categoryId].trim(),
              addedBy: currentUser?.username || "Anonymous",
              checked: false,
            },
          ],
        };
      }
      return category;
    });

    const targetCategory = categories.find((c) => c.id === categoryId);
    if (targetCategory && targetCategory.items) {
      setCategories(updatedCategories);
      setNewItems({
        ...newItems,
        [categoryId]: "",
      });
      toast.success(`Added ${newItems[categoryId]} to ${targetCategory.name}`);
    } else if (targetCategory && !targetCategory.items) {
      setNewItems({
        ...newItems,
        [categoryId]: "",
      });
    }
  };

  const toggleItemChecked = (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId && category.items) {
        return {
          ...category,
          items: category.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, checked: !item.checked };
            }
            return item;
          }),
        };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const coursesData = await fetchCourses();
        const ingredientCounts = await fetchIngredientCounts(
          coursesData.map((course) => course.id)
        );
        setCourses(coursesData);
        const transformedCategories = transformCourses(
          coursesData,
          ingredientCounts
        );
        setCategories(transformedCategories);
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md border border-[#e8e8d5]">
        <h2 className="text-2xl font-bold text-[#4a3c31] mb-2">Matplanering</h2>
        <p className="text-[#867e74] mb-4">
          Samarbeta kring inköpslistor för planerade måltider och allmäna varor.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-[#867e74]">Laddar kurser...</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-[#867e74]">Inga kurser hittades</div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setShowMasterList(!showMasterList)}
                variant="outline"
                className="border-[#e8e8d5] text-[#4a3c31] hover:bg-[#f0e6e4] hover:text-[#4a3c31]"
              >
                {showMasterList ? "Visa måltider" : "Visa sammanställning"}
              </Button>
            </div>

            {showMasterList ? (
              <MasterList
                categories={categories}
                onToggleItem={toggleItemChecked}
              />
            ) : (
              <Tabs
                defaultValue="overview"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-[#f0e6e4] mb-4 overflow-x-auto flex w-full justify-start">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-white data-[state=active]:text-[#4a3c31] text-[#867e74]"
                  >
                    Översikt
                  </TabsTrigger>
                  {[...categories]
                    .sort((a, b) => {
                      if (a.items && !b.items) return -1;
                      if (!a.items && b.items) return 1;
                      return 0;
                    })
                    .map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="data-[state=active]:bg-white data-[state=active]:text-[#4a3c31] text-[#867e74]"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        onSelectCategory={setActiveTab}
                      />
                    ))}
                  </div>
                </TabsContent>

                {categories.map((category) => (
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    className="mt-0"
                  >
                    <CategoryTab
                      category={category}
                      newItemValue={newItems[category.id] || ""}
                      onNewItemChange={(value) =>
                        setNewItems({
                          ...newItems,
                          [category.id]: value,
                        })
                      }
                      onAddItem={() => handleAddItem(category.id)}
                      onToggleItem={toggleItemChecked}
                      onIngredientAdded={refreshIngredientCounts}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FoodCoordination;
