import Post from "../models/post.js";
import User from "../models/user.js";

export const createPost = async (req, res) => {
  try {
    const { nickname, partner, tipo, comentario, calificacion } = req.body;

    if (!nickname || !partner || !calificacion) {
      return res.status(400).json({
        mensaje:
          "Faltan datos para servir este post: asegúrate de incluir nickname, partner y calificación.",
      });
    }

    let user;
    user = await User.findOne({
      nickname: nickname,
    });

    if (user) {
      const nuevoPost = await Post.create({
        nickname,
        partner,
        calificacion,
        tipo,
        comentario,
      });

      user.posts.push(nuevoPost._id);
      await user.save();

      return res.status(201).json({
        mensaje:
          "¡Tu experiencia fue servida con éxito! 🎉🍽️ Gracias por compartir en SoyFoodie.",
        nuevoPost,
      });
    } else {
      return res
        .status(404)
        .json({ error: "No encontramos a este foodie en la mesa." });
    }
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
