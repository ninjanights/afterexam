import { interestsApi } from "./axios";

// post values for a topic.
export const postTopicValuesH = async (topicName, localTopics) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;
    if (!username) {
      return {
        success: false,
        message: "Username not found in user object.",
      };
    }
    if (!localTopics) {
      return {
        success: false,
        message: "No topic values were sent.",
      };
    }

    const res = await interestsApi.post(`/posttopics/${username}`, {
      topicArray: localTopics,
      topicName: topicName,
    });

    if (res?.data?.success) {
      return {
        success: true,
        message: res?.data?.message,
        data: res?.data?.data,
      };
    }
  } catch (e) {
    console.log("Error sending new topic values");
    return {
      data: null,
      success: false,
      message: "Error in helper, while sending topic values.",
    };
  }
};

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
        topicName: res?.data?.topicName,
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
