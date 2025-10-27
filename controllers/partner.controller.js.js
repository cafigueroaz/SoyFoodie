import Post from "../models/post.js";
import User from "../models/user.js";
import partnerUser from "../models/user.js";

export const getPostsByPartner = async (req, res) => {
  try {
    const { partner } = req.params;

    let foundPartner = await partnerUser.findOne({
      partner: new RegExp(partner, "i"),
    });

    if (!foundPartner)
      return res.status(404).json({
        error: "Este partner no está en nuestro mapa gastronómico",
      });

    let posts;

    if (partner) {
      posts = await Post.find({
        partner: partner,
      });
    }

    if (!posts)
      return res.status(404).json({
        error: "Por ahora, no hay contenido disponible para este partner.",
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
