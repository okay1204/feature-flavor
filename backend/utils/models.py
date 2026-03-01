from typing import List

from pydantic import BaseModel


class IngredientBase(BaseModel):
    name: str
    quantity: str


class Ingredient(IngredientBase):
    id: int


class RecipeBase(BaseModel):
    name: str
    description: str
    instructions: str


class RecipeCreate(RecipeBase):
    """For POST/PUT - no id, ingredients have no id."""
    ingredients: List[IngredientBase] | None = None


class Recipe(RecipeBase):
    """For GET responses - includes id."""
    id: int
    ingredients: List[Ingredient] | None = None