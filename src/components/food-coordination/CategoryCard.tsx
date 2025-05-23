import { Button } from "@/components/ui/button";
import { FoodCategory } from "@/types/food";

interface CategoryCardProps {
  category: FoodCategory;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryCard = ({ category, onSelectCategory }: CategoryCardProps) => {
  return (
    <div
      className="bg-white p-4 rounded-lg border border-[#e8e8d5] hover:shadow-md transition-shadow"
      onClick={() => !category.external_link && onSelectCategory(category.id)}
    >
      <h3 className="text-lg font-bold text-[#4a3c31]">{category.name}</h3>
      <p className="text-[#867e74] italic mb-2">{category.mainItem}</p>

      <div className="flex justify-between items-center text-sm mt-2">
        <span className="text-[#867e74]">
          {category.external_link
            ? null
            : typeof category.ingredientCount === "number"
            ? category.ingredientCount === 1
              ? "1 vara"
              : `${category.ingredientCount} varor`
            : null}
        </span>
        {category.external_link ? (
          <Button
            variant="link"
            className="text-[#947b5f] p-0 h-auto hover:text-[#7f6a52]"
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                category.external_link,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Visa meny
          </Button>
        ) : (
          <Button
            variant="link"
            className="text-[#947b5f] p-0 h-auto hover:text-[#7f6a52]"
          >
            Visa detaljer
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
