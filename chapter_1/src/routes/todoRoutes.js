import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const getTodos = db.prepare("SELECT * FROM todos WHERE user_id = ?");
    const todos = getTodos.all(req.userId);
    res.json(todos);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/", (req, res) => {
  const { task } = req.body;
  try {
    const insertTodo = db.prepare(
      "INSERT INTO todos (user_id, task) VALUES (?, ?)",
    );
    const result = insertTodo.run(req.userId, task);
    res.status(201).json({
      message: "Task created successfully",
      id: result.lastInsertRowid,
      task,
      completed: 0,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const updateTodo = db.prepare(
      "UPDATE todos SET completed = ? WHERE id = ?",
    );
    updateTodo.run(completed, id);
    res.json({ message: "Todo updated successfully" });
  } catch (error) {
    res.sendStatus(500);
  }
});

// REMEMBER THERE IS SOMETHING LIKE "SOFT DELETE TOO, JUST INCASE YOU'RE WORKING FOR A BIG ORGANIZATION. YOU ADD THE SOFT DELETE BOOLEAN FIELD TO THE SCHEMA"
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = db.prepare(
      "DELETE FROM todos WHERE id = ? AND user_id = ?",
    );
    deleteTodo.run(id, req.userId);
    res.json({ message: "Task successfully deleted" });
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
