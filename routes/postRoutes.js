import express from "express";
import { crearPost } from "../controllers/post.controllers.js";

const router = express.Router();

router.post("/", crearPost);

export default router;
