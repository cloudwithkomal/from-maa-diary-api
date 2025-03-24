require("dotenv").config();
const mysql = require('mysql2/promise');
const fs = require('fs');

// MySQL Connection Setup
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4'
};

// Read JSON files
const recipes = JSON.parse(fs.readFileSync('data/recipes.json'));
const ingredients = JSON.parse(fs.readFileSync('data/ingredients.json'));
const recipeIngredients = JSON.parse(fs.readFileSync('data/recipe_ingredients.json'));
const comments = JSON.parse(fs.readFileSync('data/comments.json')); // Add the comments JSON file

async function seedDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  console.log("Connected to MySQL database...");

  try {
    // Insert Recipes
    for (let recipe of recipes) {
      await connection.execute(
        'INSERT INTO recipes (id, title, instructions) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), instructions = VALUES(instructions)',
        [recipe.id, recipe.title, recipe.instructions]
      );
    }
    console.log("Recipes inserted.");

    // Insert Ingredients
    for (let ingredient of ingredients) {
      await connection.execute(
        'INSERT INTO ingredients (id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
        [ingredient.id, ingredient.name]
      );
    }
    console.log("Ingredients inserted.");

    // Insert Recipe-Ingredients
    for (let ri of recipeIngredients) {
      await connection.execute(
        'INSERT INTO recipe_ingredients (id, recipe_id, ingredient_id, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)',
        [ri.id, ri.recipe_id, ri.ingredient_id, ri.quantity]
      );
    }
    console.log("Recipe-Ingredients inserted.");

    // Insert Comments
    for (let comment of comments) {
      await connection.execute(
        'INSERT INTO comments (id, recipe_id, comment) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE comment = VALUES(comment), created_at = VALUES(created_at)',
        [comment.id, comment.recipe_id, comment.comment] 
      );
    }
    console.log("Comments inserted.");

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
}

// Run the function
seedDatabase();
