import express from "express";
import {
  getTopicsUnderInterests,
  setValuesForEachTopic,
} from "../controllers/interests.js";
const router = express.Router();

// get topic values.
router.get("/topics/:username/:topicname", getTopicsUnderInterests);

// post new values for a topic.
router.post("/posttopics/:username", setValuesForEachTopic);

export default router;
