import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nickname: { type: String, required: true, lowercase: true },
    partner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["video", "foto", "reseña"],
      default: "reseña",
      required: true,
    },
    comment: { type: String, default: "Sin comentarios" },
    rating: { type: Number, min: 1, max: 5, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    saved: [{ type: Schema.Types.ObjectId, ref: "User" }],
    shared: [{ type: Schema.Types.ObjectId, ref: "User" }],
    origin: {
      type: String,
      enum: ["self", "tagged"],
      default: "self",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema, "posts");

export default Post;
