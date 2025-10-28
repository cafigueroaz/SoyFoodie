import mongoose from "mongoose";
import baseSchema from "./user.base.js";

const UserBase = mongoose.model("User", baseSchema, "users");

const partnerSchema = new mongoose.Schema({
  address: { type: String, required: true },
  schedule: { type: String },
  tags: [{ type: String }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  rating: { type: Number, default: 0 },
});

export const partnerUser = UserBase.discriminator("partner", partnerSchema);

const adminSchema = new mongoose.Schema({
  permisos: [{ type: String }], // ej. ['manage_users',   'manage_products']
  adminNotes: { type: String },
});
export const adminUser = UserBase.discriminator("admin", adminSchema);

const foodieSchema = new mongoose.Schema({
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  sharedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  savedPartners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Partner" }],
  age: { type: Number, required: true },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
export const foodieUser = UserBase.discriminator("foodie", foodieSchema);

export default UserBase;
