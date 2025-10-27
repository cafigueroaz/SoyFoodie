import express from "express";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  newUserPost,
  getUserPosts,
  getPartnerPosts,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUser);
router.get("/nickname/:nickname", getUser);
router.get("/email/:email", getUser);
router.post("/", createUser); // POST /usuarios
router.put("/", updateUser); // PUT /usuarios/nickname o email
router.delete("/", deleteUser); // DELETE /usuarios/nickname o email

//  POST
router.post("/post/add", newUserPost);
router.get("/post/:nickname", getUserPosts); //Se obtienen los post de un user

// Partner

router.get("/partner/:partner", getPartnerPosts); //Se obtienen los post de un partner

export default router;
