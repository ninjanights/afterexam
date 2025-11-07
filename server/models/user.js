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
    subjectStack: [
      {
        subject: { type: String, required: true, unique: true },
        grade: { type: String, required: true },
      },
    ],
    stackGrand: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
