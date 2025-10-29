import mongoose from "mongoose";
import Post from "../models/Post.js";
import UserBase, { partnerUser } from "../models/user.js";
//___________________________________________________________________________________________________
export const createPost = async (req, res) => {
  try {
    const {
      partner,
      mediaUrls = [],
      comment,
      rating,
      userId,
      origin = "self",
    } = req.body;

    if (!userId || !rating) {
      return res.status(400).json({
        error:
          "Faltan datos: asegúrate de incluir el usuario y la calificación.",
      });
    }

    const user = await UserBase.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Buscar o crear el partner (restaurante)
    let partnerDoc = null;
    if (partner) {
      partnerDoc = await UserBase.findOne({ name: partner, role: "partner" });
      if (!partnerDoc) {
        partnerDoc = await partnerUser.create({
          name: partner,
          role: "partner",
          nickname: partner.toLowerCase().replace(/\s+/g, ""),
          email: partner.toLowerCase().replace(/\s+/g, "") + "@sincorreo.com",
          password: "12345678",
          address: "Desconocida",
        });
      }
    }

    // Crear la publicación
    const newPost = await Post.create({
      createdBy: user._id,
      nickname: user.nickname,
      partner: partnerDoc?._id || null,

      comment: comment || "Sin comentarios",
      rating,
      origin,
      mediaUrls,
    });

    // Asociar el post al usuario foodie
    if ((user.role === "foodie" && origin === "self") || origin === "tagged") {
      if (!user.posts) user.posts = [];
      user.posts.push(newPost._id);
      await user.save();
    }

    // Si el post menciona un partner, actualizar su promedio de rating
    if (partnerDoc) {
      if (!partnerDoc.posts) partnerDoc.posts = [];
      partnerDoc.posts.push(newPost._id);

      const posts = await Post.find({ partner: partnerDoc._id });
      const total = posts.reduce((acc, p) => acc + (p.rating || 0), 0);
      partnerDoc.rating = posts.length ? total / posts.length : 0;

      await partnerDoc.save();
    }

    // Retornar con relaciones completas
    const populatedPost = await Post.findById(newPost._id)
      .populate("partner", "name nickname role rating")
      .populate("createdBy", "name nickname role");

    return res.status(201).json({
      message: "Experiencia creada con éxito 🎉",
      post: populatedPost,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//___________________________________________________________________________________________________
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find({
      $or: [{ createdBy: userId }, { origin: "tagged", userId }],
    })
      .populate("partner", "name nickname role rating")
      .populate("createdBy", "name nickname role");

    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//___________________________________________________________________________________________________
export const getPostsByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    const posts = await Post.find({ createdBy: id })
      .populate("partner", "name nickname role rating")
      .populate("createdBy", "name nickname role");

    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
//___________________________________________________________________________________________________
export const interactPost = async (req, res) => {
  try {
    const { postId, action } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "No autorizado" });
    if (!postId || !["like", "save", "share"].includes(action)) {
      return res.status(400).json({ error: "Faltan datos o acción inválida" });
    }

    // Buscar post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    // Buscar usuario
    const user = await UserBase.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Asegurar que los arrays existan
    if (!user.likedPosts) user.likedPosts = [];
    if (!user.savedPosts) user.savedPosts = [];
    if (!user.sharedPosts) user.sharedPosts = [];

    if (!post.likes) post.likes = [];
    if (!post.saved) post.saved = [];
    if (!post.shared) post.shared = [];

    // Procesar acción
    switch (action) {
      case "like":
        if (user.likedPosts.includes(postId)) {
          user.likedPosts.pull(postId);
          post.likes.pull(userId);
        } else {
          user.likedPosts.push(postId);
          post.likes.push(userId);
        }
        break;

      case "save":
        if (user.savedPosts.includes(postId)) {
          user.savedPosts.pull(postId);
          post.saved.pull(userId);
        } else {
          user.savedPosts.push(postId);
          post.saved.push(userId);
        }
        break;

      case "share":
        if (user.sharedPosts.includes(postId)) {
          user.sharedPosts.pull(postId);
          post.shared.pull(userId);
        } else {
          user.sharedPosts.push(postId);
          post.shared.push(userId);
        }
        break;
    }

    // Guardar cambios
    await post.save();
    await user.save();

    // Retornar post actualizado
    const populatedPost = await Post.findById(postId)
      .populate("likes", "name nickname role")
      .populate("saved", "name nickname role")
      .populate("shared", "name nickname role")
      .populate("partner", "name nickname role rating")
      .populate("createdBy", "name nickname role");

    return res.json({
      message: `Post ${action} actualizado correctamente`,
      post: populatedPost,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
