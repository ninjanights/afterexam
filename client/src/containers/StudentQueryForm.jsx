import React, { useEffect, useState } from "react";

function StudentQueryForm() {
  const [studentSubjectList, setStudentSubjectList] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [gradeInput, setGradeInput] = useState("");
  const [subNameOk, setSubNameOk] = useState(false);

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
  const handleCheckIfPreSubject = () => {
    if (!subjectInput.trim()) return;

    const isDuplicate = studentSubjectList.some(
      (sub) =>
        sub.subject.toLowerCase().trim() === subjectInput.toLowerCase().trim()
    );

    setSubNameOk(!isDuplicate);
    if (isDuplicate) {
      setDisplayMessage(`You have already added ${subjectInput} subject.`);
    }
  };

  // add one sub in form list.
  const addOneSubject = () => {
    if (!subjectInput || !gradeInput || !subNameOk) return;
    const newEntry = { subject: subjectInput, grade: gradeInput };

    setStudentSubjectList((prev) => [...prev, newEntry]);

    setSubjectInput("");
    setGradeInput("");
    setSubNameOk(false);
  };

  return (
    <div>
      {Array.isArray(studentSubjectList) &&
        studentSubjectList.length > 0 &&
        studentSubjectList.map((s, i) => (
          <p key={i}>
            {s?.subject} - {s?.grade}
          </p>
        ))}

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
              onClick={(e) => {
                e.preventDefault();
                setGradeInput(g);
              }}
            >
              {g}
            </p>
          ))}

          <button onClick={addOneSubject}>Add Sub</button>
        </div>
      )}
    </div>
  );
}

export default StudentQueryForm;
