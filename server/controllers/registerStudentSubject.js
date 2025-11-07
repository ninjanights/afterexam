import User from "../models/user.js";

// set subject stack of student.
export const setSubjectsOfStudent = async (req, res) => {
  try {
    const { username, newSubject, newGrade } = req.body;
    if (!username || !newSubject || !newGrade) {
      return res.status(400).json({
        success: false,
        message: "Username and new subject data is required.",
      });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found." });
    }
    const isStudent = user?.role === "student";
    if (!isStudent) {
      return res.status(400).json({
        success: false,
        message: "You need to a student in order to set subjects of yours.",
      });
    }

    const alreadySubject = user.subjectStack.some(
      (sub) => sub.subject === newSubject
    );
    if (alreadySubject) {
      return res.status(409).json({
        success: false,
        message: "Subject already exists in your stack.",
      });
    }

    // add a new subject.
    user.subjectStack.push({ subject: newSubject, grade: newGrade });

    const gradeValue = {
      "A+": 90,
      A: 85,
      "B+": 80,
      B: 75,
      "C+": 70,
      C: 65,
      D: 60,
    };

    // recalculate stack grand.
    const total = user.subjectStack?.reduce((acc, val) => {
      const value = gradeValue[val.grade] || 0;
      return acc + value;
    }, 0);

    user.stackGrand = total;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "You've added subjects successfully.",
      data: { subjectStack: user?.subjectStack, stackGrand: user?.stackGrand },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error setting up subject stack.",
    });
  }
};

// get students subject list.
export const getStudentsSubjectStack = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "No user is logged in",
      });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No Student found." });
    }

    return res.status(200).json({
      success: true,
      message: "Yeah Subject stack found.",
      data: { subjectStack: user?.subjectStack, stackGrand: user?.stackGrand },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Server error in getting students subject stack.",
    });
  }
};
