import UserBase, { partnerUser } from "../models/user.js";
import Post from "../models/post.js";

export const createPost = async (req, res) => {
  try {
    const { partner, type, comment, rating, userId } = req.body;

    if (!userId || !partner || !rating) {
      return res.status(400).json({
        error: "Faltan datos: asegúrate de incluir partner y calificación.",
      });
    }

    // Buscar el usuario que hace el post
    const user = await UserBase.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Buscar o crear el partner si no existe
    let partnerDoc = await UserBase.findOne({ name: partner, role: "partner" });
    if (!partnerDoc) {
      partnerDoc = await partnerUser.create({
        name: partner,
        role: "partner",
        nickname: partner.toLowerCase().replace(/\s+/g, ""),
        email: partner.toLowerCase().replace(/\s+/g, "") + "@example.com",
        password: "temporal123",
        address: "Desconocida",
      });
    }

    // Crear el post
    const newPost = await Post.create({
      userId: user._id,
      nickname: user.nickname, // <- importante
      partner: partnerDoc._id,
      type: type || "reseña",
      comment: comment || "Sin comentarios",
      rating,
    });

    // Agregar el post al usuario
    if (user.posts) {
      user.posts.push(newPost._id);
      await user.save();
    }

    return res.status(201).json({
      message: "Experiencia creada con éxito",
      newPost,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const { nickname } = req.params;

    let user = await User.findOne({
      nickname: nickname,
    });

    if (!user)
      return res
        .status(404)
        .json({ error: "No encontramos a este foodie en la mesa." });

    let posts;

    if (nickname) {
      posts = await Post.find({
        nickname: nickname,
      });
    }

    if (!posts)
      return res.status(404).json({
        error: "Por ahora, no hay contenido disponible en este perfil foodie.",
      });
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
