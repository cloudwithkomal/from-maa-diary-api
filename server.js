require("dotenv").config();
const express = require("express");
const cors = require("cors");

const recipesRoutes = require("./routes/recipesRoutes");
const commentsRoutes = require("./routes/commentsRoutes");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recipes", recipesRoutes);
app.use("/api/recipes", commentsRoutes); 

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
