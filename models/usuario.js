import mongoose from "mongoose";
const { Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    nickname: { type: String, required: true, lowercase: true, unique: true },
    correo: { type: String, required: true, unique: true, lowercase: true },
    contraseña: { type: String, required: true },
    rol: {
      type: String,
      enum: ["foodie", "restautante", "admin"],
      default: "foodie",
    },
    // fotoPerfil????
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    favoritos: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    restaurantesGuardados: [
      { type: Schema.Types.ObjectId, ref: "Restaurante" },
    ],
  },
  { timestamps: true }
);

const Usuario = mongoose.model("Usuario", usuarioSchema, "usuarios");

export default Usuario;
