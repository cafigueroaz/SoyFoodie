import UserBase, {
  partnerUser,
  foodieUser,
  adminUser,
} from "../models/user.js";
import { createPost } from "../controllers/post.controller.js";

function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (k in obj) out[k] = obj[k];
  return out;
}
const SELF_FIELDS = [
  "name",
  "age",
  "password",
  "posts",
  "favorites",
  "savedPartners",
  "tags",
  "schedule",
  "address",
];
const ADMIN_EDIT_FIELDS = [
  "role",
  "permisos",
  "adminNotes",
  "name",
  "age",
  "password",
  "posts",
  "favorites",
  "savedPartners",
  "tags",
  "schedule",
  "address",
];

export const me = async (req, res, next) => {
  try {
    const user = await UserBase.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "No encontrado" });
    res.json(user);
  } catch (e) {
    next(e);
  }
};

export const patchMe = async (req, res, next) => {
  try {
    const fields = pick(req.body, SELF_FIELDS);
    const user = await UserBase.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ error: "No encontrado" });

    Object.assign(user, fields);
    await user.save();
    res.json(user);
  } catch (e) {
    next(e);
  }
};

//___________________________________________________________________________________________________

export const getUser = async (req, res, next) => {
  try {
    const nickname = req.params.nickname || req.query.nickname;
    const email = req.params.email || req.query.email;

    if (!nickname && !email) {
      return res.status(400).json({
        error: "Debes enviar un nickname o email para encontrar al foodie.",
      });
    }

    let user;

    if (nickname) {
      user = await UserBase.findOne({ nickname });
    } else if (email) {
      user = await UserBase.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (err) {
    next(err);
  }
};
export const adminUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = pick(req.body, ADMIN_EDIT_FIELDS);

    let user = await UserBase.findById(id);
    if (!user) return res.status(404).json({ error: "No encontrado" });

    // si cambia el role, migrar al discriminator correcto
    if (fields.role && fields.role !== user.role) {
      const data = { ...user.toObject(), ...fields, role: fields.role };
      await user.deleteOne();

      user =
        fields.role === "admin"
          ? await adminUser.create(data)
          : fields.role === "staff"
          ? await partnerUser.create(data)
          : await foodieUser.create(data);

      return res.json(user);
    }

    Object.assign(user, fields);
    await user.save();
    res.json(user);
  } catch (e) {
    next(e);
  }
};

export const adminDelete = async (req, res, next) => {
  try {
    const eliminado = await UserBase.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Usuario no existe" });
    res.json({ mensaje: "Usuario eliminado", usuario: eliminado });
  } catch (e) {
    next(e);
  }
};

// Controles postear publicaciones //

export const newUserPost = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "No autorizado" });
    }

    req.body.userId = req.user.id;

    // Si se crea un post para otro usuario, marcar origin=tagged
    if (req.body.userId.toString() !== req.body.partnerId) {
      req.body.origin = "tagged";
    } else {
      req.body.origin = "self";
    }

    return createPost(req, res);
  } catch (err) {
    next(err);
  }
};
