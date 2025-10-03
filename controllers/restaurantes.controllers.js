import Post from "../models/post.js";
import Usuario from "../models/usuario.js";
import Restaurante from "../models/restaurante.js";

export const getPostsporRestaurante = async (req, res) => {
  try {
    const { restaurante } = req.params;

    let restauranteBuscado = await Restaurante.findOne({
      restaurante: new RegExp(restaurante, "i"),
    });

    if (!restauranteBuscado)
      return res.status(404).json({
        error: "Este restaurante no está en nuestro mapa gastronómico",
      });

    let posts;

    if (restaurante) {
      posts = await Post.find({
        restaurante: restaurante,
      });
    }

    if (!posts)
      return res.status(404).json({
        error: "Por ahora, no hay contenido disponible para este restaurante.",
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
