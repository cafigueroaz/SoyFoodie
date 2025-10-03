import express from "express";
import {
  getUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  usuarioNuevoPost,
  usuarioPosts,
  restaurantePosts,
} from "../controllers/usuarios.controllers.js";

const router = express.Router();

router.get("/", getUsuario); // GET /usuarios/ por nickname o correo
router.post("/", crearUsuario); // POST /usuarios
router.put("/", actualizarUsuario); // PUT /usuarios/nickname o correo
router.delete("/", eliminarUsuario); // DELETE /usuarios/nickname o correo

//  POST
router.post("/post/add", usuarioNuevoPost);
router.get("/post/:nickname", usuarioPosts); //Se obtienen los post de un usuario

// Restaurante

router.get("/restaurante/:restaurante", restaurantePosts); //Se obtienen los post de un restaurante

export default router;
