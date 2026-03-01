export interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  quantity: string;
}