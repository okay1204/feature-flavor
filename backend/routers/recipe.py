from asyncpg import Connection
from database.connection import DbConnection
from fastapi import APIRouter, HTTPException
from utils.models import Ingredient, Recipe, RecipeCreate

router = APIRouter(prefix = "/recipe")

@router.post("/")
async def create_recipe(recipe: RecipeCreate):
    async with DbConnection.pool.acquire() as conn:
        conn: Connection
        async with conn.transaction():
            recipe_id = await conn.fetchval("INSERT INTO recipes (name, description, instructions) VALUES ($1, $2, $3) RETURNING id", recipe.name, recipe.description, recipe.instructions)

            if recipe.ingredients:
                await conn.executemany("INSERT INTO ingredients (recipe_id, name, quantity) VALUES ($1, $2, $3)", [(recipe_id, ingredient.name, ingredient.quantity) for ingredient in recipe.ingredients])

    return {"message": "Recipe created", "recipe_id": recipe_id}

@router.get("/{recipe_id}")
async def get_recipe(recipe_id: int):
    async with DbConnection.pool.acquire() as conn:
        conn: Connection
        async with conn.transaction():
            recipe = await conn.fetchrow("SELECT * FROM recipes WHERE id = $1", recipe_id)
            ingredients = await conn.fetch("SELECT * FROM ingredients WHERE recipe_id = $1", recipe_id)

    ingredients = [Ingredient(**ingredient) for ingredient in ingredients]
    recipe = Recipe(**recipe, ingredients = ingredients)
    return recipe

@router.put("/{recipe_id}")
async def update_recipe(recipe_id: int, recipe: RecipeCreate):
    async with DbConnection.pool.acquire() as conn:
        conn: Connection
        async with conn.transaction():
            exists = await conn.execute("UPDATE recipes SET name = $1, description = $2, instructions = $3 WHERE id = $4 RETURNING *", recipe.name, recipe.description, recipe.instructions, recipe_id)
            if not exists:
                raise HTTPException(status_code = 404, detail = "Recipe not found")

            await conn.execute("DELETE FROM ingredients WHERE recipe_id = $1", recipe_id)
            if recipe.ingredients:
                await conn.executemany("INSERT INTO ingredients (recipe_id, name, quantity) VALUES ($1, $2, $3)", [(recipe_id, ingredient.name, ingredient.quantity) for ingredient in recipe.ingredients])

    return {"message": "Recipe updated", "recipe_id": recipe_id}

@router.delete("/{recipe_id}")
async def delete_recipe(recipe_id: int):
    async with DbConnection.pool.acquire() as conn:
        conn: Connection
        exists = await conn.execute("DELETE FROM recipes WHERE id = $1 RETURNING *", recipe_id)
        if not exists:
            raise HTTPException(status_code = 404, detail = "Recipe not found")
        # Cascade will automatically delete all ingredients associated with the recipe

    return {"message": "Recipe deleted", "recipe_id": recipe_id}

@router.get("/")
async def get_recipes(cursor: int = 0, limit: int = 10, search: str = ""):
    fetch_limit = limit + 1
    search_pattern = f"%{search}%"
    async with DbConnection.pool.acquire() as conn:
        conn: Connection
        if not cursor:
            recipes = await conn.fetch(
                "SELECT * FROM recipes WHERE name ILIKE $1 ORDER BY id DESC LIMIT $2",
                search_pattern, fetch_limit
            )
        else:
            recipes = await conn.fetch(
                "SELECT * FROM recipes WHERE id < $1 AND name ILIKE $2 ORDER BY id DESC LIMIT $3",
                cursor, search_pattern, fetch_limit
            )
    has_more = len(recipes) > limit
    page = recipes[:limit]
    data = [Recipe(**r) for r in page]
    next_cursor = page[-1]["id"] if page else cursor

    return {
        "data": data,
        "next_cursor": next_cursor,
        "has_more": has_more,
    }