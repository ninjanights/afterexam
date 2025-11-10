import { interestsApi } from "./axios";

// get interests of students (first time / existing).
export const getInterestsFieldsH = async (topicname) => {
  try {
    if (!topicname) {
      return { success: false };
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return {
        success: false,
        message: "Need to login first.",
      };
    }
    const username = user?.username;
    if (!username) {
      return {
        success: false,
        message: "Username not found in user object.",
      };
    }

    const res = await interestsApi.get(`/topics/${username}/${topicname}`);
    if (res.data.success) {
      return {
        success: true,
        message: res.data.message,
        data: res?.data?.data,
      };
    }
  } catch (e) {
    console.log("Error getting the fields under topics.");
    return {
      data: null,
      success: false,
      message: "Error in getting topics.",
    };
  }
};
