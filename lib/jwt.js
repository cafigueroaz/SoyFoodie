import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const { JWT_SECRET, JWT_EXPIRES = "1h" } = process.env;

export function signToken(payload) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET no definido");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET no definido");
  return jwt.verify(token, JWT_SECRET);
}
