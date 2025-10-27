import { regesterCollegeSideApi, loginOrBaseApi } from "./axios.js";

// register a new college.
export const regesterCollegeH = async (collegeName, location, fields) => {
  try {
    if (!collegeName || !location || !fields) return;

    console.log(collegeName, location, fields, "🥬🥬🥬");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user)
      return res.status(400).json({
        success: false,
        message: "No Logged in user",
      });
    const username = user?.data?.username;

    console.log(collegeName);
    const response = await regesterCollegeSideApi.post(
      `/registercollege/${username}`,
      {
        collegeName,
        location,
        fields,
      }
    );

    if (response.success) {
      return response.data;
    }
  } catch (e) {
    console.log("Error regestering college in helper.");
  }
};

// log in user (student / college)
export const loginUserH = async (username, role) => {
  try {
    if (!username || !role) {
      return {
        data: null,
        message: "No Username / Role provided.",
      };
    }

    const res = await loginOrBaseApi.post("/login", {
      username,
      role,
    });

    if (res.data.success) {
      return {
        data: res.data.user,
        success: true,
        message: `Welcome ${res?.data?.user?.username}`,
      };
    }
  } catch (e) {
    console.log("Error regestering college in helper.");
    return {
      data: null,
      success: false,
      message: "Something went wrong during login.",
    };
  }
};

// get all created colleges. (as College);
export const getAllCreatedCollegesH = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return {
        success: false,
        message: "No logged in user found.",
      };
    }
    const role = user?.data?.role;
    if (!role || role !== "college") {
      return {
        success: false,
        message: "This isn't a College user.",
      };
    }
    const username = user?.data?.username;

    const res = await regesterCollegeSideApi(`/createdcolleges/${username}`);

    if (res.data.success) {
      return {
        success: true,
        message: "Found colleges.",
        createdCollegeList: res?.data?.data,
      };
    }
  } catch (e) {
    console.log("Error finding Created colleges, as Colleges.");
    return {
      data: null,
      success: false,
      message: "Something went wrong during getting created colleges.",
    };
  }
};
