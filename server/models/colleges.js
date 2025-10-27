import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
  },
  requiredSubjects: [
    {
      subject: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
  ],

  minTotalRequirment: {
    type: Number,
    required: true,
  },
});

const collegeSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    location: {
      area: { type: String, required: true },
      city: { type: String, required: true },
      PIN: { type: Number, required: true },
      country: { type: String, required: true },
    },
    fields: [fieldSchema],

    ctratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GetCollege", collegeSchema);
