// controllers/auth.controller.js (ESM)
import UserModel from "../models/user.js"; // Modelo base
import { signToken } from "../lib/jwt.js";

// POST /auth/register
export const register = async (req, res, next) => {
  try {
    const { name, nickname, email, password, role, address, age } = req.body;

    // Verificar si el email ya existe
    const emailExists = await UserModel.findOne({ email });
    if (emailExists)
      return res.status(409).json({ error: "Email ya registrado" });

    // Verificar si el nickname ya existe
    const nicknameExists = await UserModel.findOne({ nickname });
    if (nicknameExists)
      return res.status(409).json({ error: "Nickname ya registrado" });

    // Manejar discriminadores
    const Discriminators = UserModel.discriminators || {};
   

    // Crear el user corre let ModelToUse;

    if (role === "partner" && Discriminators.partner) {
      ModelToUse = Discriminators.partner;
    } else if (role === "foodie" && Discriminators.foodie) {
      ModelToUse = Discriminators.foodie;
    } else {
      ModelToUse = Discriminators.user || UserModel;
    }spondiente según el rol
    const user = await ModelToUse.create({
      name,
      nickname,
      email,
      password,
      role,
      address,
      age,
    });

    // Generar token JWT
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
};

// POST /auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar el user e incluir el campo de password (oculto por defecto)
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    // Comparar contraseñas
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ error: "Credenciales inválidas" });

    // Firmar nuevo token
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
