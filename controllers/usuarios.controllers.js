import User from "../models/usuario.js"; // tu modelo mongoose
import {
  crearPost,
  getPostsporUsuario,
} from "../controllers/posts.controllers.js";

import { getPostsporRestaurante } from "../controllers/restaurantes.controllers.js";

/** GET /usuarios/nickname o email */
export const getUsuario = async (req, res) => {
  try {
    const { nickname, email } = req.query;

    if (!nickname && !email) {
      return res.status(400).json({
        mensaje: "Debes enviar un nickname o email para encontrar a tu foodie.",
      });
    }

    let usuario;

    if (nickname) {
      usuario = await User.findOne({
        nickname: nickname,
      });
    } else if (email) {
      usuario = await User.findOne({ email: email });
    }

    if (!usuario)
      return res
        .status(404)
        .json({ error: "No encontramos a este foodie en la mesa." });

    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, nickname, email, password, rol } = req.body;

    if (!nombre || !nickname || !email || !password) {
      return res.status(400).json({
        mensaje:
          "Receta incompleta: nombre, nickname, email y password son obligatorios.",
      });
    }

    const validarEmail = await User.findOne({ email });
    const validarNickname = await User.findOne({ nickname });
    if (validarEmail || validarNickname) {
      if (validarEmail) {
        return res
          .status(409)
          .json({ mensaje: "Ese email ya está reservado en SoyFoodie." });
      } else if (validarNickname) {
        return res.status(409).json({
          mensaje:
            "Ese nickname ya fue elegido por otro foodie. ¡Escoge uno único!",
        });
      }
    }

    const nuevoUsuario = await User.create({
      nombre,
      nickname,
      email,
      password,
      rol,
    });
    return res.status(201).json(nuevoUsuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { nickname, email } = req.query;
    const { nombre, nicknameNuevo, emailNuevo, password, rol } = req.body;

    if (!nickname && !email) {
      return res.status(400).json({
        mensaje:
          "Debes enviar un nickname o email para actualizar este perfil.",
      });
    }

    const update = {};
    if (nombre !== undefined) update.nombre = nombre;
    if (emailNuevo !== undefined) update.email = emailNuevo;
    if (password !== undefined) update.password = password;
    if (nicknameNuevo !== undefined) update.nickname = nicknameNuevo;
    if (rol !== undefined) update.rol = rol;

    let filtro = {};
    if (email) filtro.email = email.toLowerCase();
    if (nickname) filtro.nickname = nickname.toLowerCase();

    const usuario = await User.findOneAndUpdate(filtro, update, { new: true });

    if (!usuario) {
      return res
        .status(404)
        .json({ mensaje: "No encontramos este perfil foodie en la carta." });
    }

    return res.json({
      mensaje: "Perfil actualizado. Tu experiencia foodie está al día.",
      usuario,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/** DELETE /usuarios/:nombre */
export const eliminarUsuario = async (req, res) => {
  try {
    const { nickname, email } = req.query;

    if (!nickname && !email) {
      return res.status(400).json({
        mensaje: "Debes enviar un nickname o email para eliminar un perfil.",
      });
    }

    let filtro = {};
    if (email) filtro.email = email.toLowerCase();
    if (nickname) filtro.nickname = nickname.toLowerCase();

    const eliminado = await User.findOneAndDelete(filtro);

    if (!eliminado)
      return res.status(404).json({
        mensaje: "No encontramos a este foodie en la mesa. Nada que eliminar.",
      });
    return res.json({
      mensaje: "Foodie eliminado con éxito de la comunidad.",
      usuario: eliminado,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controles postear publicaciones //

export const usuarioNuevoPost = async (req, res) => {
  try {
    return crearPost(req, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const usuarioPosts = async (req, res) => {
  try {
    return getPostsporUsuario(req, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controles Restaurantes

export const restaurantePosts = async (req, res) => {
  try {
    return getPostsporRestaurante(req, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
