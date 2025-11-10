import React from "react";

import { useStudentSubject } from "../contexts/AsStudentContext.jsx";

function EachInterest() {
  const { fetchInterests, topicValues } = useStudentSubject();

  return (
    <div>
      {Array.isArray(topicValues) &&
        topicValues.map((t, i) => (
          <div key={i}>
            <p>{t.topic}</p> - {t.rating}
          </div>
        ))}
    </div>
  );
}

export default EachInterest;
