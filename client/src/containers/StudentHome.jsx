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

  const [selectedInterest, setSelectedInterest] = useState("");
  const [showTray, setShowTray] = useState(false);

  useEffect(() => {
    if (allColleges === null) fetchAllColleges();
  }, [allColleges]);

  // handle fetch topics.
  const handleFetchTopics = (e, topicname) => {
    e.preventDefault();
    const isSameTopic = selectedInterest === topicname;
    setSelectedInterest(topicname);
    setShowTray(!isSameTopic || !showTray);
    fetchInterests(topicname);
  };

  return (
    <div>
      {Array.isArray(allColleges) &&
        allColleges.length > 0 &&
        allColleges.map((clg, i) => <p key={i}>{clg?.collegeName}</p>)}

      <div className="topics">
        <p
          className="eachTopicName"
          onClick={(e) => handleFetchTopics(e, "music")}
        >
          Music
        </p>
        <p
          className="eachTopicName"
          onClick={(e) => handleFetchTopics(e, "dance")}
        >
          Dance
        </p>
      </div>
      <div className={`trayContainer ${showTray ? "openedTray" : ""}`}>
        {showTray && <EachInterest />}
      </div>

      <button onClick={() => setStudentQ((p) => !p)}>Student Form</button>
      {studentQ && <StudentQueryForm />}
    </div>
  );
}

export default StudentHome;
