import express from "express";
import { createUserController } from "../controllers/user.js";

const router = express.Router();

// login college / student
router.post("/login", createUserController);

export default router;
