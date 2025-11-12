import StudentInterests from "../models/interests.js";
import User from "../models/user.js";

const defaultTopics = {
  music: ["Pop", "Classical", "Rap", "Rock", "Indie"],
  dance: [
    "Classical dance",
    "Freestyles",
    "Hip-Hop",
    "Choreography",
    "Khorovod",
  ],
};

// set values in Topics.
export const setValuesForEachTopic = async (req, res) => {
  try {
    const { username } = req.params;
    const { topicName, topicArray } = req.body;

    console.log(topicName, topicArray, "💮💮");

    if (!username || !topicArray || !topicName) {
      return res.status(400).json({
        success: false,
        message: "Missing username, topicArray, or topicName.",
      });
    }
    const firstTopicName =
      Array.isArray(topicArray) && topicArray?.length > 0
        ? topicArray[0]?.topic
        : null;

    const alignsWithTopic =
      Array.isArray(defaultTopics[topicName]) &&
      firstTopicName &&
      defaultTopics[topicName].some(
        (i) => i.toLowerCase() === firstTopicName.toLowerCase()
      );

    if (!alignsWithTopic) {
      return res.status(400).json({
        success: false,
        message:
          "Values doesn't align with topic name, seek help from developer.",
      });
    }

    const user = await User.findOne({ username });
    const user_id = user?._id;
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "No user found with that username.",
      });
    }

    let studentInterests = await StudentInterests.findOne({
      studentId: user_id,
    });

    if (!studentInterests) {
      studentInterests = new StudentInterests({
        studentId: user_id,
        [topicName]: topicArray,
      });
    } else {
      studentInterests[topicName] = topicArray;
    }

    await studentInterests.save();

    return res.status(201).json({
      success: true,
      message: "Interests updated successfully.",
      data: studentInterests,
    });
  } catch (e) {
    console.error("Error updating interests:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
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

    const topicHasData = userTopicDocs[topicname].length > 0 ? true : false;

    if (userTopicDocs && topicHasData) {
      console.log("yes", "💮");
      return res.status(200).json({
        success: true,
        message: "Here are the existing values in this category.",
        data: userTopicDocs[topicname],
        topicName: topicname,
      });
    }
    const topics = defaultTopics[topicname];

    if (!topics) return res.status(404).json({ error: "Category not found." });

    const topicsWithRatings = topics.map((t) => ({
      topic: t,
      rating: 3,
    }));

    return res.status(200).json({
      success: true,
      message: "Here's a fresh topic list.",
      data: topicsWithRatings,
      topicName: topicname,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error in sending categories." });
  }
};
