import express from "express";
import {
  getUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  usuarioPostea,
} from "../controllers/usuarios.controllers.js";

const router = express.Router();

router.get("/", getUsuario); // GET /usuarios/ por nickname o correo
router.post("/", crearUsuario); // POST /usuarios
router.put("/", actualizarUsuario); // PUT /usuarios/nickname o correo
router.delete("/", eliminarUsuario); // DELETE /usuarios/nickname o correo

// Crear POST
router.post("/post/", usuarioPostea);

export default router;
