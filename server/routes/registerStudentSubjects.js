import {
  deleteSubjectFromStack,
  getStudentsSubjectStack,
  setSubjectsOfStudent,
} from "../controllers/registerStudentSubject.js";
import express from "express";
const router = express.Router();

// get subject stack.
router.post("/getstudentsubjectstack", getStudentsSubjectStack);

// reg new subject.
router.post("/setstudentsubjectstack", setSubjectsOfStudent);

// delete a subject.
router.delete("/deletesubject", deleteSubjectFromStack);

export default router;
