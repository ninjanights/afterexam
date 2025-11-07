import React, { useEffect, useState } from "react";
import { useStudentSubject } from "../contexts/AsStudentContext";

function StudentQueryForm() {
  const {
    subjectStack,
    stackGrand,
    loading,
    error,
    fetchSubjectStack,
    addSubjectStack,
  } = useStudentSubject();

  const [subjectInput, setSubjectInput] = useState("");
  const [gradeInput, setGradeInput] = useState("");
  const [subNameOk, setSubNameOk] = useState(false);

  const [displayMessage, setDisplayMessage] = useState("");

  const gradesList = {
    "A+": 90,
    A: 85,
    "B+": 80,
    B: 75,
    "C+": 70,
    C: 65,
    D: 60,
  };

  // handle input.
  const handleInputValue = (e) => {
    const { name, value } = e.target;
    if (name === "subjectInput") {
      setSubNameOk(false);
      setSubjectInput(value);
    }
  };

  // check if it's already in list.
  const handleCheckIfPreSubject = (e) => {
    e.preventDefault();
    if (!subjectInput.trim()) return;

    const isDuplicate = subjectStack.some(
      (sub) =>
        sub.subject.toLowerCase().trim() === subjectInput.toLowerCase().trim()
    );

    setSubNameOk(!isDuplicate);
    if (isDuplicate) {
      setDisplayMessage(`You have already added ${subjectInput} subject.`);
    }
  };

  const handleAddToSubjectStack = async (e) => {
    e.preventDefault();
    if (subjectInput === "" || gradeInput === "") return;

    const newEntry = {
      newSubject: subjectInput,
      newGrade: gradeInput,
    };

    const res = await addSubjectStack(newEntry);
    if (res.success) {
      setSubjectInput("");
      setGradeInput("");
    }
  };

  return (
    <div>
      {Array.isArray(subjectStack) &&
        subjectStack?.length > 0 &&
        subjectStack?.map((s, i) => (
          <p key={i}>
            {s?.subject} - {s?.grade}
          </p>
        ))}
      {displayMessage && <p style={{ color: "red" }}>{displayMessage}</p>}
      <form onSubmit={handleAddToSubjectStack}>
        <input
          type="text"
          placeholder="Subject"
          value={subjectInput}
          name="subjectInput"
          onChange={(e) => handleInputValue(e)}
        ></input>
        <button disabled={!subjectInput} onClick={handleCheckIfPreSubject}>
          NEXT
        </button>

        {subNameOk && (
          <div>
            {Object.keys(gradesList).map((g, i) => (
              <p
                key={i}
                style={{
                  cursor: "pointer",
                  fontWeight: gradeInput === g ? "bold" : "normal",
                  color: gradeInput === g ? "green" : "black",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setGradeInput(g);
                }}
              >
                {g}
              </p>
            ))}

            <button disabled={!subNameOk || loading} type="submit">
              {loading ? "Adding" : `Add ${subjectInput}.`}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default StudentQueryForm;
