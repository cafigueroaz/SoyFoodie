import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/** Normaliza para búsquedas: sin tildes, minúsculas y sin espacios extras */
export function normalizeKey(str = "") {
  return str
    .normalize("NFD") // separa tildes
    .replace(/\p{Diacritic}/gu, "") // quita diacríticos
    .trim()
    .toLowerCase();
}

const base = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameKey: { type: String, index: true }, // clave normalizada para búsqueda
    nickname: { type: String, trim: true, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false }, // select:false = no sale por defecto
    role: {
      type: String,
      enum: ["partner", "foodie", "admin"],
      default: "foodie",
      index: true,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

base.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("name")) {
    this.nameKey = normalizeKey(this.name);
  }
  next();
});

base.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default base;
