import User from "../models/user.js"; // tu modelo mongoose
import { createPost, getPostsByUser } from "../controllers/post.controller.js";

import { getPostsByPartner } from "./partner.controller.js.js";

/** GET /users/nickname o email */
export const getUser = async (req, res) => {
  try {
    const { nickname, email } = req.query;

    if (!nickname && !email) {
      return res.status(400).json({
        mensaje: "Debes enviar un nickname o email para encontrar a tu foodie.",
      });
    }

    let user;

    if (nickname) {
      user = await User.findOne({
        nickname: nickname,
      });
    } else if (email) {
      user = await User.findOne({ email: email });
    }

    if (!user)
      return res
        .status(404)
        .json({ error: "No encontramos a este foodie en la mesa." });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, nickname, email, password, rol } = req.body;

    if (!name || !nickname || !email || !password) {
      return res.status(400).json({
        mensaje:
          "Receta incompleta: name, nickname, email y password son obligatorios.",
      });
    }

    const validateEmail = await User.findOne({ email });
    const validateNickname = await User.findOne({ nickname });
    if (validateEmail || validateNickname) {
      if (validateEmail) {
        return res
          .status(409)
          .json({ mensaje: "Ese email ya está reservado en SoyFoodie." });
      } else if (validateNickname) {
        return res.status(409).json({
          mensaje:
            "Ese nickname ya fue elegido por otro foodie. ¡Escoge uno único!",
        });
      }
    }

    const newUser = await User.create({
      name,
      nickname,
      email,
      password,
      rol,
    });
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { nickname, email } = req.query;
    const { name, newNickname, newEmail, password, rol } = req.body;

    if (!nickname && !email) {
      return res.status(400).json({
        mensaje:
          "Debes enviar un nickname o email para actualizar este perfil.",
      });
    }

    const update = {};
    if (name !== undefined) update.name = name;
    if (newEmail !== undefined) update.email = newEmail;
    if (password !== undefined) update.password = password;
    if (newNickname !== undefined) update.nickname = newNickname;
    if (rol !== undefined) update.rol = rol;

    let filter = {};
    if (email) filter.email = email.toLowerCase();
    if (nickname) filter.nickname = nickname.toLowerCase();

    const user = await User.findOneAndUpdate(filter, update, { new: true });

    if (!user) {
      return res
        .status(404)
        .json({ mensaje: "No encontramos este perfil foodie en la carta." });
    }

    return res.json({
      mensaje: "Perfil actualizado. Tu experiencia foodie está al día.",
      user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/** DELETE /users/:name */
export const deleteUser = async (req, res) => {
  try {
    const { nickname, email } = req.query;

    if (!nickname && !email) {
      return res.status(400).json({
        mensaje: "Debes enviar un nickname o email para eliminar un perfil.",
      });
    }

    let filter = {};
    if (email) filter.email = email.toLowerCase();
    if (nickname) filter.nickname = nickname.toLowerCase();

    const deleted = await User.findOneAndDelete(filter);

    if (!deleted)
      return res.status(404).json({
        mensaje: "No encontramos a este foodie en la mesa. Nada que eliminar.",
      });
    return res.json({
      mensaje: "Foodie deleted con éxito de la comunidad.",
      user: deleted,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controles postear publicaciones //

export const newUserPost = async (req, res) => {
  try {
    return createPost(req, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    return getPostsByUser(req, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controles Restaurantes

export const getPartnerPosts = async (req, res) => {
  try {
    return getPostsByPartner(req, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
