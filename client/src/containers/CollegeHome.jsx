import React, { useState } from "react";
import { useAsCollegeContext } from "../contexts/AsCollegeContext";

import RegCollegeForm from "./RegCollegeForm";

// collegeName, location, fields
function CollegeHome() {
  const [showRCF, setShowRCF] = useState(false);

  return (
    <div>
      <p onClick={() => setShowRCF((prev) => !prev)}>Register a new college.</p>
      {showRCF && <RegCollegeForm />}
    </div>
  );
}

export default CollegeHome;
