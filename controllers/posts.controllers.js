import Post from "../models/post.js";
import Usuario from "../models/usuario.js";

export const crearPost = async (req, res) => {
  try {
    const { nickname, restaurante, tipo, comentario, calificacion } = req.body;

    if (!nickname || !restaurante || !calificacion) {
      return res.status(400).json({
        mensaje:
          "Faltan datos para servir este post: asegúrate de incluir nickname, restaurante y calificación.",
      });
    }

    let usuario;
    usuario = await Usuario.findOne({
      nickname: nickname,
    });

    if (usuario) {
      const nuevoPost = await Post.create({
        nickname,
        restaurante,
        calificacion,
        tipo,
        comentario,
      });

      usuario.posts.push(nuevoPost._id);
      await usuario.save();

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

export const getPostsporUsuario = async (req, res) => {
  try {
    const { nickname } = req.params;

    let usuario = await Usuario.findOne({
      nickname: nickname,
    });

    if (!usuario)
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
