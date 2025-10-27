import User from "../models/user.js";

// create user (student / college)
export const createUserController = async (req, res) => {
  try {
    const { username, role } = req.body;

    console.log(username, "🥬");

    if (!username || !role) {
      return res
        .status(400)
        .json({ success: false, message: "No username and Role." });
    }

    const trimmedUsername = username.trim().toLowerCase();

    const alreadyUser = await User.findOne({ username: trimmedUsername });

    console.log(alreadyUser, "🎏");
    if (alreadyUser) {
      return res.status(200).json({
        success: true,
        message: `Welcome back ${alreadyUser.username}`,
        user: alreadyUser,
      });
    } else {
      const newUser = new User({ username: trimmedUsername, role });
      await newUser.save();

      return res.status(201).json({
        success: true,
        message: "User Created.",
        user: newUser,
        role: role,
      });
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: "Server error creating user." });
  }
};
