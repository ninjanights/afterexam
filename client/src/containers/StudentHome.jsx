import React, { useEffect, useState } from "react";

import { useAsCollegeContext } from "../contexts/AsCollegeContext.jsx";
import StudentQueryForm from "./StudentQueryForm.jsx";

function StudentHome() {
  const { allColleges, fetchAllColleges } = useAsCollegeContext();
  const [studentQ, setStudentQ] = useState(false);

  useEffect(() => {
    if (allColleges === null) fetchAllColleges();
  }, [allColleges]);

  return (
    <div>
      {Array.isArray(allColleges) &&
        allColleges.length > 0 &&
        allColleges.map((clg, i) => <p key={i}>{clg?.collegeName}</p>)}

      <button onClick={() => setStudentQ((p) => !p)}>Student Form</button>
      {studentQ && <StudentQueryForm />}
    </div>
  );
}

export default StudentHome;
