import React, { useEffect, useState } from "react";
import { useAsCollegeContext } from "../contexts/AsCollegeContext";
import RegCollegeForm from "./RegCollegeForm";

// collegeName, location, fields
function CollegeHome() {
  const [showRCF, setShowRCF] = useState(false);
  const { allColleges, fetchAllColleges } = useAsCollegeContext();

  useEffect(() => {
    if (allColleges === null) fetchAllColleges();
  }, []);

  return (
    <div>
      {Array.isArray(allColleges) &&
        allColleges.length > 0 &&
        allColleges.map((clg, i) => <p key={i}>{clg?.collegeName}</p>)}
      <p onClick={() => setShowRCF((prev) => !prev)}>Register a new college.</p>
      {showRCF && <RegCollegeForm />}
    </div>
  );
}

export default CollegeHome;
