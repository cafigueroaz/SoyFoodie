import UserBase, {
  foodieUser,
  partnerUser,
  adminUser,
} from "../models/user.js";
import { signToken } from "../lib/jwt.js";

export const register = async (req, res, next) => {
  try {
    const {
      name,
      nickname,
      email,
      password,
      role = "foodie",
      address,
      age,
      extras,
    } = req.body;

    // Validar email y nickname
    const emailExists = await UserBase.findOne({ email });
    if (emailExists)
      return res.status(409).json({ error: "Email ya registrado" });

    const nicknameExists = await UserBase.findOne({ nickname });
    if (nicknameExists)
      return res.status(409).json({ error: "Nickname ya registrado" });

    // Seleccionar modelo según rol
    let ModelToUse;
    switch (role) {
      case "partner":
        ModelToUse = partnerUser;
        break;
      case "foodie":
        ModelToUse = foodieUser;
        break;
      case "admin":
        ModelToUse = adminUser;
        break;
      default:
        ModelToUse = UserBase;
    }

    // Validar campos obligatorios según rol
    if (role === "foodie" && (age === undefined || age === null)) {
      return res.status(400).json({ error: "Los foodies deben incluir edad" });
    }
    if (role === "partner" && (!address || address.trim() === "")) {
      return res
        .status(400)
        .json({ error: "Los partners deben incluir dirección" });
    }

    // Preparar datos del usuario
    const userData = {
      name,
      nickname,
      email,
      password,
      role,
      ...extras,
    };

    // Agregar campos específicos por rol
    if (role === "foodie") {
      userData.age = age;
      userData.posts = [];
      userData.likedPosts = [];
      userData.savedPosts = [];
      userData.sharedPosts = [];
      userData.savedPartners = [];
      userData.following = [];
      userData.followers = [];
    }
    if (role === "partner") {
      userData.address = address;
      userData.schedule = extras?.schedule || "";
      userData.tags = extras?.tags || [];
      userData.posts = [];
      userData.rating = 0;
      userData.followers = [];
    }

    // Crear usuario usando el modelo correcto
    const user = await ModelToUse.create(userData);

    // Convertir a objeto plano para respuesta
    const userObj = user.toObject({ getters: true });

    // Generar token JWT
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Responder con token
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
};

//___________________________________________________________________________________________________s
// POST /auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserBase.findOne({
      $or: [{ email: email?.toLowerCase() }, { nickname: email }],
    }).select("+password");
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ error: "Credenciales inválidas" });

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    res.json({ token });
  } catch (e) {
    next(e);
  }
};
