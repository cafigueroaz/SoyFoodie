import mongoose from "mongoose";
const { Schema } = mongoose;

const restauranteSchema = new Schema(
  {
    restaurante: { type: String, required: true, lowercase: true },
    direccion: { type: String, required: true },
    horario: { type: String },
    etiquetas: [{ type: String }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const Restaurante = mongoose.model(
  "Restaurante",
  restauranteSchema,
  "restaurantes"
);

export default Restaurante;
