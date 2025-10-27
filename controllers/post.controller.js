import Post from "../models/post.js";
import UserBase, { partnerUser } from "../models/user.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    const {
      partner,
      type,
      comment,
      rating,
      userId,
      origin = "self",
    } = req.body;

    if (!userId || !partner || !rating) {
      return res.status(400).json({
        error: "Faltan datos: asegúrate de incluir partner y calificación.",
      });
    }

    const user = await UserBase.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

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

    const newPost = await Post.create({
      userId: partnerDoc._id,
      nickname: partnerDoc.nickname,
      partner: partnerDoc._id,
      type: type || "reseña",
      comment: comment || "Sin comentarios",
      rating,
      origin,
      createdBy: user._id,
    });

    if (user.role === "foodie" || origin === "self") {
      if (user.posts) {
        user.posts.push(newPost._id);
        await user.save();
      }
    }

    if (partnerDoc.posts) {
      partnerDoc.posts.push(newPost._id);
      await partnerDoc.save();
    }

    // Devolver post con populate listo para frontend
    const populatedPost = await Post.findById(newPost._id)
      .populate("partner", "name nickname role")
      .populate("createdBy", "name nickname role");

    return res.status(201).json({
      message: "Experiencia creada con éxito",
      post: populatedPost,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ userId }).populate(
      "partner",
      "name nickname"
    );
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getPostsByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    const posts = await Post.find({ userId: id }).populate(
      "partner",
      "name nickname"
    );
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
