import express from "express";
import {
  checkFieldName,
  collegeNameAvailability,
  getCollegesByUsername,
  registerCollegeController,
} from "../controllers/registerCollege.js";
const router = express.Router();

// register college
router.post("/registercollege/:username", registerCollegeController);

// get all created colleges, (as College)
router.get("/createdcolleges/:username", getCollegesByUsername);

// get college name availability.
router.get("/nameavailable/:collegename", collegeNameAvailability );

// get if FieldName already exists under college name.
router.post("/checkfieldname/:fieldname", checkFieldName)

// get all colleges
// router.get("/allcolleges/:username", getCollegesByUsername);

export default router;
