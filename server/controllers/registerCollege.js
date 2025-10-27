import GetCollege from "../models/colleges.js";
import User from "../models/user.js";

// regester as college
export const registerCollegeController = async (req, res) => {
  try {
    const { username } = req.params;
    const { collegeName, location, fields } = req.body;
    console.log(req.body, "🎏");
    if (!collegeName || !location || !fields)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });

    const user = await User.findOne({ username });

    if (!user || user.role !== "college") {
      return res.status(403).json({
        success: false,
        message: "Only college users can create colleges.",
      });
    }

    const newCollege = new GetCollege({
      collegeName,
      location,
      fields,
      ctratedBy: user?._id,
    });

    await newCollege.save();
    res.status(201).json({
      success: true,
      message: "College is successfully Registered.",
      data: newCollege,
    });
  } catch (e) {
    console.log("Registering college error.", e);
    res.status(500).json({
      success: false,
      message: "Internal server error in regestering college.",
    });
  }
};

// get all created colleges. (as College)
export const getCollegesByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "No user as College is logged in." });
    }

    const user = await User.find({ username });

    if (!user) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    if (!user.role === "college") {
      return res.status(400).json({
        success: false,
        message: "Registering a college is only for college users.",
      });
    }

    const belongColleges = await GetCollege.find({ ctratedBy: user._id });
    res.status(200).json({
      success: true,
      message: "Found all the colleges by logged in college.",
      data: belongColleges,
      user_id: user._id,
    });
  } catch (e) {
    console.log("Fetching all college error.", e);
    res
      .status(500)
      .json({ success: false, message: "Error fetching colleges." });
  }
};
