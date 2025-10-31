import GetCollege from "../models/colleges.js";
import User from "../models/user.js";

// regester as college
export const registerCollegeController = async (req, res) => {
  try {
    const { username } = req.params;
    const { collegeName, location, fields } = req.body;
    console.log(
      req?.body?.collegeName,
      req?.body?.location,
      req?.body?.fields,
      "🎏 req b"
    );
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

    const locationObj = Array.isArray(location) ? location?.[0] : location;

    const newCollege = new GetCollege({
      collegeName: collegeName,
      location: locationObj,

      fields: fields,
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

// college name availability.
export const collegeNameAvailability = async (req, res) => {
  try {
    const { collegename } = req.params;
    if (!collegename) {
      return res
        .status(400)
        .json({ success: false, message: "No college name provided." });
    }
    const exists = await GetCollege.exists({ collegeName: collegename });
    if (exists) {
      return res.status(200).json({
        success: true,
        exists: true,
      });
    } else {
      return res.status(200).json({
        success: true,
        exists: false,
      });
    }
  } catch (e) {
    console.log("Error in seeing college name", e);
    res.status(500).json({
      success: false,
      message: "Error seeing if college name can be registered.",
    });
  }
};

// check field name under college.
export const checkFieldName = async (req, res) => {
  try {
    const { fieldname } = req.params;
    const { collegeName } = req.body;
    console.log(fieldname, collegeName, "👽");
    if (!fieldname || !collegeName) {
      return res.status(400).json({
        success: false,
        message: "No College name or Field name provided.",
      });
    }
    const thisCollege = await GetCollege.findOne({ collegeName: collegeName });
    if (!thisCollege) {
      return res.status(200).json({
        success: true,
        exists: false,
        message: "This field is ready to belong to this college.",
      });
    }

    const fieldsExists = thisCollege?.fields?.some(
      (f) => f.fieldName.toLowerCase() === fieldname.toLowerCase()
    );

    return res.status(200).json({
      success: true,
      exists: fieldsExists,
      message: fieldsExists
        ? "Field name already exists in this college."
        : "Field name is available.",
    });
  } catch (e) {
    console.log("Error Checking field name user college.", e);
    res.status(500).json({
      success: false,
      message:
        "Server side error while checking this field name already exists or not.",
    });
  }
};
