from collections import defaultdict
from typing import List

import ldclient
from asyncpg import Connection
from database.connection import DbConnection
from fastapi import APIRouter, HTTPException
from ldclient import Context
from utils.models import Ingredient

router = APIRouter(prefix = "/grocerylist")

@router.post("/")
async def grocery_list(recipe_ids: List[int]):
    context = Context.create(key = "feature-flavor", kind = "application")
    if not ldclient.get().variation("grocery-list", context, False):
        raise HTTPException(status_code = 403, detail = "Grocery list is not enabled")

    async with DbConnection.pool.acquire() as conn:
        conn: Connection
        async with conn.transaction():
            ingredients = await conn.fetch("SELECT * FROM ingredients WHERE recipe_id = ANY($1)", recipe_ids)
        
        ingredients = [Ingredient(**ingredient) for ingredient in ingredients]
        
        # Group ingredients by name
        grouped_ingredients = defaultdict(list)
        for ingredient in ingredients:
            grouped_ingredients[ingredient.name].append(ingredient.quantity)

        return grouped_ingredients