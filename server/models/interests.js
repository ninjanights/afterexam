import mongoose from "mongoose";

const interestsSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
});

const studentInterestsSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    music: [interestsSchema],
    dance: [interestsSchema],
  },
  { timestamps: true }
);

export default mongoose.model("StudentInterests", studentInterestsSchema);
