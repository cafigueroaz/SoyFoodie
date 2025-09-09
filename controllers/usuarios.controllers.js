import User from "../models/usuario.js"; // tu modelo mongoose
import { crearPost } from "../controllers/posts.controllers.js";

/** GET /usuarios/nickname o correo */
export const getUsuario = async (req, res) => {
  try {
    const { nickname, correo } = req.query;

    if (!nickname && !correo) {
      return res.status(400).json({
        mensaje:
          "Debes enviar un nickname o correo para encontrar a tu foodie.",
      });
    }

    let usuario;

    if (nickname) {
      usuario = await User.findOne({
        nickname: nickname,
      });
    } else if (correo) {
      usuario = await User.findOne({ correo: correo });
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
    const { nombre, nickname, correo, contraseña, rol } = req.body;

    if (!nombre || !nickname || !correo || !contraseña) {
      return res.status(400).json({
        mensaje:
          "Receta incompleta: nombre, nickname, correo y contraseña son obligatorios.",
      });
    }

    const validarCorreo = await User.findOne({ correo });
    const validarNickname = await User.findOne({ nickname });
    if (validarCorreo || validarNickname) {
      if (validarCorreo) {
        return res
          .status(409)
          .json({ mensaje: "Ese correo ya está reservado en SoyFoodie." });
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
      correo,
      contraseña,
      rol,
    });
    return res.status(201).json(nuevoUsuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { nickname, correo } = req.query;
    const { nombre, nicknameNuevo, correoNuevo, contraseña, rol } = req.body;

    if (!nickname && !correo) {
      return res.status(400).json({
        mensaje:
          "Debes enviar un nickname o correo para actualizar este perfil.",
      });
    }

    const update = {};
    if (nombre !== undefined) update.nombre = nombre;
    if (correoNuevo !== undefined) update.correo = correoNuevo;
    if (contraseña !== undefined) update.contraseña = contraseña;
    if (nicknameNuevo !== undefined) update.nickname = nicknameNuevo;
    if (rol !== undefined) update.rol = rol;

    let filtro = {};
    if (correo) filtro.correo = correo.toLowerCase();
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
    const { nickname, correo } = req.query;

    if (!nickname && !correo) {
      return res.status(400).json({
        mensaje: "Debes enviar un nickname o correo para eliminar un perfil.",
      });
    }

    let filtro = {};
    if (correo) filtro.correo = correo.toLowerCase();
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

export const usuarioPostea = async (req, res) => {
  try {
    return crearPost(req, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
