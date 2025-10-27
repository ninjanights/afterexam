import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";

import CollegeHome from "../containers/CollegeHome";
import StudentHome from "../containers/StudentHome";

function HomePage() {
  const { loggedInUser } = useUserContext();
  const [viewAs, setViewAs] = useState("");
  console.log(loggedInUser, "🎏");

  useEffect(() => {
    if (loggedInUser)
      setViewAs(loggedInUser?.data?.role === "college" ? "college" : "student");

    console.log(viewAs, "🎏🎏");
  }, [loggedInUser]);

  return (
    <div>
      {viewAs === "college" ? (
        <div>
          <CollegeHome />
        </div>
      ) : viewAs === "student" ? (
        <div>
          <StudentHome />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default HomePage;
