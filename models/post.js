import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    nickname: { type: String, required: true, lowercase: true },
    partner: { type: String, required: true, lowercase: true },
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
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema, "posts");

export default Post;
