// controllers/auth.controller.js (ESM)
import UserModel from "../models/usuario.js"; // Modelo base
import { signToken } from "../lib/jwt.js";

// POST /auth/register
export const register = async (req, res, next) => {
  try {
    const { nombre, nickname, email, password, role, direccion, edad } =
      req.body;

    // Verificar si el correo ya existe
    const emailExists = await UserModel.findOne({ email });
    if (emailExists)
      return res.status(409).json({ error: "Email ya registrado" });

    // Verificar si el nickname ya existe
    const nicknameExists = await UserModel.findOne({ nickname });
    if (nicknameExists)
      return res.status(409).json({ error: "Nickname ya registrado" });

    // Manejar discriminadores
    const Discriminators = UserModel.discriminators || {};
    const ModelToUse =
      role === "admin" && Discriminators.admin
        ? Discriminators.admin
        : role === "restaurante" && Discriminators.restaurante
        ? Discriminators.restaurante
        : role === "foodie" && Discriminators.foodie
        ? Discriminators.foodie
        : Discriminators.user || UserModel;

    // Crear el usuario correspondiente según el rol
    const user = await ModelToUse.create({
      nombre,
      nickname,
      email,
      password,
      role,
      direccion,
      edad,
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

    // Buscar el usuario e incluir el campo de password (oculto por defecto)
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
