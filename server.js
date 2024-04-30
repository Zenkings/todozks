const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

// Configuration de la connexion à la base de données PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tasks",
  password: "postgres",
  port: 5432, // Le port par défaut de PostgreSQL est 5432
});

// Middleware pour le parsing des données JSON
app.use(express.json());

// Routes CRUD pour les tâches
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des tâches:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des tâches" });
  }
});

// Autres routes CRUD à implémenter (create, update, delete)

// Créer une nouvelle tâche
app.post("/api/tasks", async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la création de la tâche:", err);
    res.status(500).json({ error: "Erreur lors de la création de la tâche" });
  }
});

// Mettre à jour l'état d'une tâche existante
app.put("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { title, description, completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *",
      [title, description, completed, taskId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la tâche:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la tâche" });
  }
});

// Mettre à jour le nom et la description d'une tâche existante

app.put("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { title, description, completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *",
      [title, description, completed, taskId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la tâche:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la tâche" });
  }
});

// Supprimer une tâche
app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression de la tâche:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la tâche" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
