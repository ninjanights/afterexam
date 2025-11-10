import StudentInterests from "../models/interests.js";
import User from "../models/user.js";

const defaultTopics = {
  music: [
    "Indie music",
    "Classical music",
    "Hip-hop / Rap",
    "Pop music",
    "Instrumental / Lo-fi",
    "Folk / Regional music",
    "Rock / Metal",
    "Film soundtracks / scores",
  ],
  dance: [
    "Hip-hop dance",
    "Classical dance",
    "Freestyle",
    "Stage choreography",
    "Dance battles",
  ],
};

// get topics in each field.
export const getTopicsUnderInterests = async (req, res) => {
  try {
    const { username, topicname } = req.params;

    if (!username || !topicname) {
      return res.status(400).json({
        success: false,
        message: "No username or topicname found.",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found.",
      });
    }
    const user_id = user._id;

    const userTopicDocs = await StudentInterests.findOne({
      studentId: user_id,
    });

    if (userTopicDocs && userTopicDocs[topicname]) {
      return res.status(200).json({
        success: true,
        message: "Here are the existing values in this category.",
      });
    }
    const topics = defaultTopics[topicname];
    if (!topics) return res.status(404).json({ error: "Category not found." });

    const topicsWithRatings = topics.map((t) => ({
      topic: t,
      rating: 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Here's a fresh topic list.",
      data: topicsWithRatings,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error in sending categories." });
  }
};
