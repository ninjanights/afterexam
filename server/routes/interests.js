import express from "express";
import { getTopicsUnderInterests } from "../controllers/interests.js";
const router = express.Router();

router.get("/topics/:username/:topicname", getTopicsUnderInterests);

export default router;
