import { FoodCategory } from "@/types/food";

interface MasterListProps {
  categories: FoodCategory[];
  onToggleItem: (categoryId: string, itemId: string) => void;
}

const MasterList = ({ categories }: MasterListProps) => {
  return (
    <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
      <h3 className="text-xl font-bold text-[#4a3c31] mb-3">Sammanställning</h3>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-3">
            <h4 className="font-medium text-[#4a3c31]">{category.name}</h4>
            <p className="text-[#867e74] text-sm pl-5">
              {category.external_link
                ? "Extern meny - inga ingredienser att visa"
                : typeof category.ingredientCount === "number"
                ? `${category.ingredientCount} ingrediens${
                    category.ingredientCount !== 1 ? "er" : ""
                  } tillagda`
                : "Laddar ingredienser..."}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-[#e8e8d5] rounded-lg">
        <p className="text-[#867e74] text-sm italic">
          Detaljerad sammanställning med checkboxar kommer snart...
        </p>
      </div>
    </div>
  );
};

export default MasterList;
