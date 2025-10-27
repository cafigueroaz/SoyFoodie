import express from "express";
import {
  getUser,
  newUserPost,
  adminUpdate,
  adminDelete,
  patchMe,
  me,
} from "../controllers/user.controller.js";
import {
  getMyPosts,
  getPostsByUserId,
  interactPost,
} from "../controllers/post.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getUser);
router.get("/nickname/:nickname", getUser);
router.get("/email/:email", getUser);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, patchMe);

// Admin

router.put("/:id", requireAuth, requireRole("admin"), adminUpdate);
router.delete("/:id", requireAuth, requireRole("admin"), adminDelete);

//  POST
router.post("/post/add", requireAuth, newUserPost);
router.get("/post/me", requireAuth, getMyPosts); //mis posts
router.get("/:id/posts", requireAuth, getPostsByUserId); //post de otro usuario por id

router.post("/post/interact", requireAuth, interactPost);

export default router;
