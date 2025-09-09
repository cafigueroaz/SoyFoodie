import Post from "../models/post.js";
import User from "../models/usuario.js";

export const crearPost = async (req, res) => {
  try {
    const { nickname, lugar, tipo, comentario, calificacion } = req.body;

    if (!nickname || !lugar || !calificacion) {
      return res.status(400).json({
        mensaje:
          "Faltan datos para servir este post: asegúrate de incluir nickname, lugar y calificación.",
      });
    }

    let usuario;
    usuario = await User.findOne({
      nickname: nickname,
    });

    if (usuario) {
      const nuevoPost = await Post.create({
        nickname,
        lugar,
        calificacion,
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
