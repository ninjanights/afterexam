import { regesterStudentSideApi } from "./axios";

// (post req.) get student subject stack.
export const getStudentSubjectStackH = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return {
        success: false,
        message: "No Logged in user",
      };
    }

    const username = user?.username;
    const role = user?.role;

    if (!username || role !== "student") {
      return {
        success: false,
        message: `A ${role} can't have a subject stack for now.`,
      };
    }

    const res = await regesterStudentSideApi.post("/getstudentsubjectstack", {
      username: username,
    });

    if (res?.data?.success) {
      return {
        success: true,
        data: res.data.data,
      };
    }
  } catch (e) {
    console.log("Error getStudent Sub H.");
    return {
      data: null,
      success: false,
      message: `Something went wrong during getting student subject stack.`,
    };
  }
};

// register student's subjects.
export const setStudentSubjectStackH = async (newSubject, newGrade) => {
  try {
    if (!newSubject || !newGrade) {
      return {
        success: false,
        message: "You need to send us atleast one subject.",
      };
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user)
      return {
        success: false,
        message: "No Logged in user",
      };

    const username = user?.username;
    const role = user?.role;

    console.log(username, role, "🐉 helper. reg sub.");

    if (role !== "student") {
      return {
        success: false,
        message: "You need to be a student user.",
      };
    }

    const res = await regesterStudentSideApi.post("/setstudentsubjectstack", {
      username,
      newSubject,
      newGrade,
    });

    if (res.data.success) {
      return {
        success: true,
        message: res?.data?.message,
        data: res?.data?.data,
      };
    }
  } catch (e) {
    console.log("Error sending Subjects to backend.");
    return {
      data: null,
      success: false,
      message: "Something went wrong during sending subjects to backend.",
    };
  }
};
