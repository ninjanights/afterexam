import React, { useEffect, useState } from "react";
import { useAsCollegeContext } from "../contexts/AsCollegeContext";
import { regesterCollegeSideApi } from "../services/axios";

function RegCollegeForm() {
  const { registerANewCollege, loading, error } = useAsCollegeContext();
  const [pincode, setPincode] = useState("");

  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState([{}]);
  const [fields, setFields] = useState([]);

  const [inpMessage, setInpMessage] = useState("");
  const [inpError, setInpError] = useState("");

  // check if college name exists.
  const checkCollegeNameExists = async () => {
    if (!collegeName.trim()) return;
    try {
      setInpMessage("");
      const collegename = collegeName;
      const res = await regesterCollegeSideApi.get(
        `/nameavailable/${collegename}`
      );

      console.log(res);

      if (res?.data?.exists) {
        setInpMessage(`${collegeName} already exists.`);
        return true;
      } else if (!res?.data?.exists) {
        setInpMessage(`${collegeName} available.`);
        return false;
      }
    } catch (e) {
      console.error("Error checking college name:", e);
    } finally {
      console.log("Done checking college name availability.");
    }
  };

  // set time out for input message clear.
  useEffect(() => {
    if (inpMessage) {
      const timer = setTimeout(() => {
        setInpMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [inpMessage]);

  // handle input.
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "collegeName") {
      setCollegeName(value);
    }
    if (name === "pincode") {
      setPincode(value);
    }
  };

  return (
    <div>
      {inpMessage && <p>{inpMessage}</p>}
      <form>
        <label htmlFor="collegeName">College Name.</label>
        <input
          id="collegeName"
          type="text"
          placeholder="New college name."
          value={collegeName}
          name="collegeName"
          onChange={(e) => handleInput(e)}
          onBlur={checkCollegeNameExists}
        ></input>
      </form>
    </div>
  );
}

export default RegCollegeForm;
