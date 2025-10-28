import React from "react";

import { useNavigate, NavLink, Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

function Navbar() {
  const { loggedInUser, logout } = useUserContext();
  const navigate = useNavigate();

  const handleLogOut = () => {
    if (loggedInUser === null) return;
    logout();
    navigate("/login");
  };

  return (
    <div>
      <ul>
        <li>
          <NavLink
            to={loggedInUser ? "/home" : "/login"}
            end
            className={({ isActive }) => (isActive ? "activeNav" : "")}
          >
            After School
          </NavLink>
        </li>

        {loggedInUser && (
          <div>
            <li>
              <span>{loggedInUser?.data?.username}</span>
            </li>
            <li>
              <span>{loggedInUser?.data?.role}</span>
            </li>
            <li>
              {loggedInUser && (
                <button onClick={() => handleLogOut()}>Logout</button>
              )}
            </li>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
