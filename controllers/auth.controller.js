import UserModel from "../models/user.js";
import { signToken } from "../lib/jwt.js";

// POST /auth/register
export const register = async (req, res, next) => {
  try {
    const { name, nickname, email, password, role, address, age, extras } =
      req.body;

    const emailExists = await UserModel.findOne({ email });
    if (emailExists)
      return res.status(409).json({ error: "Email ya registrado" });

    const nicknameExists = await UserModel.findOne({ nickname });
    if (nicknameExists)
      return res.status(409).json({ error: "Nickname ya registrado" });

    const Discriminators = UserModel.discriminators || {};
    let ModelToUse;

    if (role === "partner" && Discriminators.partner) {
      ModelToUse = Discriminators.partner;
    } else if (role === "foodie" && Discriminators.foodie) {
      ModelToUse = Discriminators.foodie;
    } else if (role === "admin" && Discriminators.admin) {
      ModelToUse = Discriminators.admin;
    } else {
      ModelToUse = Discriminators.user || UserModel;
    }

    const user = await ModelToUse.create({
      name,
      nickname,
      email,
      password,
      role,
      address,
      age,
      ...extras,
    });

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

    const user = await UserModel.findOne({
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
