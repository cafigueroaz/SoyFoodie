import mongoose from "mongoose";
import baseSchema from "./user.base.js";

const UserBase = mongoose.model("User", baseSchema, "users");

const partnerSchema = new mongoose.Schema({
  address: { type: String, required: true },
  schedule: { type: String },
  tags: [{ type: String }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});
export const partnerUser = UserBase.discriminator("partner", partnerSchema);

const foodieSchema = new mongoose.Schema({
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  savedPartners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Partner" }],
  age: { type: Number, required: true },
});
export const foodieUser = UserBase.discriminator("foodie", foodieSchema);

export default UserBase;
