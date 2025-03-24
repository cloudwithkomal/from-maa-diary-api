const express = require("express");
const router = express.Router();
const getConnection = require("../db/connection");

// GET all recipes
router.get("/", async (req, res) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM recipes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error });
  } finally {
    await connection.end();
  }
});

// GET single recipe with ingredients
router.get("/:id", async (req, res) => {
  const connection = await getConnection();
  const { id } = req.params;

  try {
    const [recipeRows] = await connection.execute("SELECT * FROM recipes WHERE id = ?", [id]);
    if (recipeRows.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const [ingredientsRows] = await connection.execute(
      `SELECT i.name, ri.quantity 
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE ri.recipe_id = ?`,
      [id]
    );

    const recipe = recipeRows[0];
    recipe.ingredients = ingredientsRows;

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe", error });
  } finally {
    await connection.end();
  }
});

module.exports = router;
