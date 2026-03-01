from typing import List

from pydantic import BaseModel

class Ingredient(BaseModel):
    id: int
    name: str
    quantity: str

class Recipe(BaseModel):
    id: int
    name: str
    description: str
    instructions: str
    ingredients: List[Ingredient] | None = None