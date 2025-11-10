import React, { useEffect, useState } from "react";

import { useAsCollegeContext } from "../contexts/AsCollegeContext.jsx";
import StudentQueryForm from "./StudentQueryForm.jsx";
import EachInterest from "./EachInterest.jsx";

import { useStudentSubject } from "../contexts/AsStudentContext.jsx";

function StudentHome() {
  const {
    subjectStack,
    stackGrand,
    loading,
    error,
    fetchSubjectStack,
    addSubjectStack,

    fetchInterests,
    topicValues,
  } = useStudentSubject();

  const { allColleges, fetchAllColleges } = useAsCollegeContext();
  const [studentQ, setStudentQ] = useState(false);

  useEffect(() => {
    if (allColleges === null) fetchAllColleges();
  }, [allColleges]);

  // handle fetch topics.
  const handleFetchTopics = (e, topicname) => {
    e.preventDefault();
    fetchInterests(topicname);
  };

  return (
    <div>
      {Array.isArray(allColleges) &&
        allColleges.length > 0 &&
        allColleges.map((clg, i) => <p key={i}>{clg?.collegeName}</p>)}

      <p onClick={(e) => handleFetchTopics(e, "music")}>Music</p>
      <p onClick={(e) => handleFetchTopics(e, "dance")}>Dance</p>

      <EachInterest />

      <button onClick={() => setStudentQ((p) => !p)}>Student Form</button>
      {studentQ && <StudentQueryForm />}
    </div>
  );
}

export default StudentHome;
