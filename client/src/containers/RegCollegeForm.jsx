import React, { useEffect, useRef, useState } from "react";
import { useAsCollegeContext } from "../contexts/AsCollegeContext";
import { regesterCollegeSideApi } from "../services/axios";
import axios from "axios";

function AddSubject({ subjectsList, setSubjectsList, setInpMessage }) {
  const [subName, setSubName] = useState("");
  const [grade, setGrade] = useState("");
  const [okSub, setOkSub] = useState(false);

  const alreadySub = () => {
    return subjectsList.some((s) => s.name === subName);
  };

  const handleSubValue = (e) => {
    e.preventDefault();

    if (alreadySub()) {
      setInpMessage("Subject already exists.");
      return;
    }

    setSubjectsList((prev) => [...prev, { name: subName, grade: grade }]);
    setSubName("");
    setGrade("");
  };

  const gradeValue = {
    "A+": 90,
    A: 85,
    "B+": 80,
    B: 75,
    "C+": 70,
    C: 65,
    D: 60,
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Subject"
        value={subName}
        onChange={(e) => setSubName(e.target.value)}
      ></input>
      <div>
        {Object.keys(gradeValue).map((g) => (
          <p
            onClick={() => {
              (e) => e.preventDefault();
              setGrade(g);
            }}
          >
            {g}
          </p>
        ))}
      </div>
      <button
        disabled={subName === "" || grade === ""}
        onClick={handleSubValue}
      >
        Add{" "}
      </button>
    </div>
  );
}

function RegCollegeForm() {
  const { registerANewCollege, loading, error } = useAsCollegeContext();
  const [pincode, setPincode] = useState("");
  const [nameAndField, setNameAndField] = useState(false);

  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState([
    { area: null, city: null, PIN: null, country: null },
  ]);

  const [displayFill, setDisplayFill] = useState(false);
  const [subjectsList, setSubjectsList] = useState([
    { name: "Mathamatics", grade: "A" },
  ]);
  const [fieldName, setFieldName] = useState("");

  const [displayPinChoice, setDisplayPinChoice] = useState([]);

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
        setNameAndField(false);

        return true;
      } else if (!res?.data?.exists) {
        setInpMessage(`${collegeName} available.`);
        setNameAndField(false);
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
    if (name === "fieldname") {
      setFieldName(value);
    }
  };

  // handle pin code.
  const handlePincode = async () => {
    if (!pincode || pincode?.length !== 6) {
      setInpMessage("Pincode is likely to be 6 digit long.");
      return;
    }
    const res = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    console.log(res?.data);
    if (res?.status === 200) {
      if (res?.data[0]?.Status === "Success") {
        setDisplayPinChoice(res?.data[0]?.PostOffice[0]);
        console.log(res?.data[0]?.PostOffice[0]?.Block);
      } else {
        setInpMessage("This pincode isn't signed to a place.");
      }
    }
  };

  // handle set Location data.
  const handleSetLocationData = async () => {
    const { Block, Country, Name, Pincode } = displayPinChoice;
    if (!Block || !Pincode || !Country) {
      setInpMessage(
        "This Pincode doesn't provide enough data to register with."
      );
      return;
    }
    setLocation([
      {
        area: Name || null,
        city: Block || null,
        PIN: Pincode || null,
        country: Country || null,
      },
    ]);
    setPincode(Pincode);
  };

  // handle clear pin location input.
  const handleClearPinInput = () => {
    if (pincode || location?.area !== null) {
      setPincode("");
      setLocation([{ area: null, city: null, PIN: null, country: null }]);
    }
  };

  // handle Check Field Name.
  const handleCheckFieldName = async () => {
    if (!fieldName.trim() || !collegeName) return;

    const fieldname = fieldName;
    console.log(fieldname, collegeName, "🎏");
    const res = await regesterCollegeSideApi.post(
      `/checkfieldname/${fieldname}`,
      {
        collegeName,
      }
    );

    if (!res?.data?.exists) {
      setInpMessage(res?.data?.message);
      setNameAndField(true);
    }
  };

  // handle process to fill field
  const handleProcessToFillField = (e) => {
    e.preventDefault();
    if (location[0] !== "" && nameAndField && fieldName) {
      setDisplayFill(true);
    }
  };

  // is location filled has data?
  const isLocationValid = () =>
    location.some((l) => l.area && l.city && l.PIN && l.country);

  useEffect(() => {
    if (!nameAndField && collegeName && fieldName) {
      handleCheckFieldName();
      console.log("yess 🌸");
    }
  }, [nameAndField, fieldName, collegeName]);

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

        {location?.map((l, i) => (
          <div key={i}>
            {Object.entries(l).map(([key, value]) => (
              <p key={key}>
                {key}: {value}
              </p>
            ))}
          </div>
        ))}

        <label htmlFor="pincode">Location Pin Code.</label>
        {displayPinChoice && (
          <div>
            <p onClick={handleSetLocationData}>
              {displayPinChoice?.Block || displayPinChoice?.Name}
            </p>
          </div>
        )}
        <input
          id="pincode"
          type="number"
          placeholder="Pincode"
          value={pincode}
          name="pincode"
          onChange={(e) => handleInput(e)}
          onBlur={handlePincode}
        ></input>
        <button disabled={pincode === ""} onClick={handleClearPinInput}>
          Clear
        </button>

        <input
          style={{
            borderColor: nameAndField ? "green" : "gray",
            borderWidth: "2px",
            borderStyle: "solid",
          }}
          id="fieldName"
          type="text"
          placeholder="Field name."
          value={fieldName}
          name="fieldname"
          onChange={(e) => handleInput(e)}
          onBlur={handleCheckFieldName}
        ></input>
        <button
          disabled={!fieldName || !isLocationValid() || !collegeName}
          onClick={handleProcessToFillField}
        >
          Next
        </button>

        {displayFill && (
          <div>
            {subjectsList.map((s, i) => (
              <div key={i}>
                <p>
                  {s.name} - {s.grade}
                </p>
              </div>
            ))}
            <AddSubject
              subjectsList={subjectsList}
              setSubjectsList={setSubjectsList}
              setInpMessage={setInpMessage}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default RegCollegeForm;
