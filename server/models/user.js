import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "college"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
