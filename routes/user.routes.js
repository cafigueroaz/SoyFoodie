import express from "express";
import {
  getUser,
  newUserPost,
  getUserPosts,
  getPartnerPosts,
  adminUpdate,
  adminDelete,
  patchMe,
} from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getUser);
router.get("/nickname/:nickname", getUser);
router.get("/email/:email", getUser);
router.patch("/me", requireAuth, patchMe);

// Admin/staff

router.put("/:id", requireAuth, requireRole("admin"), adminUpdate);
router.delete("/:id", requireAuth, requireRole("admin"), adminDelete);

//  POST
router.post("/post/add", newUserPost);
router.get("/post/:nickname", getUserPosts); //Se obtienen los post de un user

// Partner

router.get("/partner/:partner", getPartnerPosts); //Se obtienen los post de un partner

export default router;
