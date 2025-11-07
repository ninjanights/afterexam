import express from "express";
import {
  checkFieldName,
  collegeNameAvailability,
  getAllColleges,
  registerCollegeController,
} from "../controllers/registerCollege.js";
const router = express.Router();

// register college
router.post("/registercollege/:username", registerCollegeController);

// get all created colleges, (as College)
router.post("/allcolleges/:username", getAllColleges);

// get college name availability.
router.get("/nameavailable/:collegename", collegeNameAvailability);

// get if FieldName already exists under college name.
router.post("/checkfieldname/:fieldname", checkFieldName);

export default router;
