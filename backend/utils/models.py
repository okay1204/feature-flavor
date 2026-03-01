from typing import List

from pydantic import BaseModel

class Ingredient(BaseModel):
    name: str
    quantity: str

class Recipe(BaseModel):
    name: str
    description: str
    instructions: str
    ingredients: List[Ingredient] | None = None