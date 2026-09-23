export type RecipeCard = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  time?: number;
  servings?: number;
  calories?: number | null;
};

export type RecipeIngredient = {
  id: string;
  name: string;
  amount: string | null;
};

export type RecipeStep = {
  id: string;
  text: string;
};

export type RecipeDetails = RecipeCard & {
  time: number;
  servings: number;
  calories: number | null;
  protein: number | null;
  authorId: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};