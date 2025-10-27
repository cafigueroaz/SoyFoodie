import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { me } from "../controllers/user.controller.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);

export default router;
