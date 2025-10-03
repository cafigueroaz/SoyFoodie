import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    nickname: { type: String, required: true, lowercase: true },
    restaurante: { type: String, required: true, lowercase: true },
    tipo: {
      type: String,
      enum: ["video", "foto", "reseña"],
      default: "reseña",
      required: true,
    },

    comentario: { type: String, default: "Sin comentarios" },
    calificacion: { type: Number, min: 1, max: 5, required: true },
    // likes: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
    // guardados: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
    // compartido: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema, "posts");

export default Post;
