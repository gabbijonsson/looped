export interface Course {
  id: number;
  created_at: string;
  name: string;
  date: string;
  external_link: string;
}

export interface Ingredient {
  id: number;
  created_at: string;
  created_by: string;
  name: string;
  course_id: number;
}

export interface FoodItem {
  id: string;
  name: string;
  addedBy: string;
  checked: boolean;
}

export interface FoodCategory {
  id: string;
  name: string;
  mainItem: string;
  items?: FoodItem[];
  external_link?: string;
  ingredientCount?: number;
}
