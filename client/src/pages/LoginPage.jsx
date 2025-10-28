import React, { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
useNavigate;
function LoginPage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");

  const { login } = useUserContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await login(username, role);
    if (res) {
      if (res.success) {
        setMessage(res.message);
      }
      console.log(res, "res in loggin");
      navigate("/home");
    } else {
      console.log("login failed");
    }
  };

  // handle Input.
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "usernameInput") {
      setUsername(value);
    }
  };

  return (
    <div>
      <p>{message ? message : ""}</p>
      <label htmlFor={"usernameid"}>
        Already have an username? just put the username to contnue, else login
        with a new username.
      </label>
      <input
        type="text"
        id={"usernameid"}
        placeholder="Username"
        value={username}
        name={"usernameInput"}
        onChange={(e) => {
          handleInput(e);
        }}
      />

      <div>
        <button
          onClick={() => setRole("student")}
          className={`roleBtn ${role === "student" ? "activeRole" : ""}`}
        >
          Student
        </button>
        <button
          onClick={() => setRole("college")}
          className={`roleBtn ${role === "college" ? "activeRole" : ""}`}
        >
          College
        </button>
      </div>
      <button onClick={handleLogin}>Go.</button>
    </div>
  );
}

export default LoginPage;
