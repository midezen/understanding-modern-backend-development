import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, process.env.JWTSEC, (err, data) => {
    if (err) return res.status(401).json({ message: "Token is invalid" });

    req.userId = data._id;

    next();
  });
};

export default verifyToken;
