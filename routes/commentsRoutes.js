const express = require("express");
const router = express.Router();
const getConnection = require("../db/connection");

// GET comments for a specific recipe
router.get("/:recipeId/comments", async (req, res) => {
  const connection = await getConnection();
  const { recipeId } = req.params;

  try {
    const [comments] = await connection.execute("SELECT * FROM comments WHERE recipe_id = ?", [recipeId]);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  } finally {
    await connection.end();
  }
});

// POST a new comment
router.post("/:recipeId/comments", async (req, res) => {
  const connection = await getConnection();
  const { recipeId } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ error: "Comment is required" });
  }

  try {
    const [result] = await connection.execute(
      "INSERT INTO comments (recipe_id, comment) VALUES (?, ?)",
      [ recipeId, comment] 
    );

    const [newComment] = await connection.execute("SELECT * FROM comments WHERE id = ?", [result.insertId]);
    res.status(201).json(newComment[0]);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  } finally {
    await connection.end();
  }
});

module.exports = router;
