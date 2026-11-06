import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/register", (req, res) => {});

router.post("/login", (req, res) => {
  res.status(200).json({ message: "hi there!" });
});

export default router;
