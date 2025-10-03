import mongoose from "mongoose";
import baseSchema from "./User.base.js";

const UserBase = mongoose.model("Usuario", baseSchema, "usuarios");

const restauranteSchema = new mongoose.Schema({
  direccion: { type: String, required: true },
  horario: { type: String },
  etiquetas: [{ type: String }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});
export const restauranteUsuario = UserBase.discriminator(
  "restaurante",
  restauranteSchema
);

const adminSchema = new mongoose.Schema({
  permisos: [{ type: String }], // ej. ['manage_users', 'manage_products']
  adminNotes: { type: String },
});
export const adminUsuario = UserBase.discriminator("admin", adminSchema);

const foodieSchema = new mongoose.Schema({
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  restaurantesGuardados: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Restaurante" },
  ],
});
export const foodieUsuario = UserBase.discriminator("foodie", foodieSchema);

export default UserBase;
