import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync(8);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    // ADD USER
    const insertUser = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)",
    );
    const result = insertUser.run(username, hashedPassword);

    //ASSIGN DEFAULT TODO TO CREATED USER
    const defaultTodo = "Hello :) Add your first todo!";
    const insertTodo = db.prepare(
      "INSERT INTO todos (user_id, task) VALUES (?, ?)",
    );
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    //CREATE TOKEN
    const token = jwt.sign(
      { _id: result.lastInsertRowid },
      process.env.JWTSEC,
      { expiresIn: "24h" },
    );
    res.json({ token });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  try {
    const getUser = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = getUser.get(username);
    if (!user) return res.status(404).json({ message: "User not found" });

    //COMPARE PASSWORDS

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Incorrect Password" });

    //CREATE TOKEN
    const token = jwt.sign({ _id: user.id }, process.env.JWTSEC, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login Successful", user, token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
});

export default router;
