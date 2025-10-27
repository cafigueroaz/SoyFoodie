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

router.get("/", getUser); // GET /users/ por nickname o email
router.post("/", createUser); // POST /users
router.put("/", updateUser); // PUT /users/nickname o email
router.delete("/", deleteUser); // DELETE /users/nickname o email

//  POST
router.post("/post/add", newUserPost);
router.get("/post/:nickname", getUserPosts); //Se obtienen los post de un user

// Partner

router.get("/partner/:partner", getPartnerPosts); //Se obtienen los post de un partner

export default router;
