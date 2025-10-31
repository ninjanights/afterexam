import React, { useEffect, useRef, useState } from "react";
import { useAsCollegeContext } from "../contexts/AsCollegeContext";
import { regesterCollegeSideApi } from "../services/axios";
import axios from "axios";

function AddSubject({
  subjectsList,
  setSubjectsList,
  setInpMessage,
  gradeValue,
  setOkSub,
}) {
  const [subName, setSubName] = useState("");
  const [grade, setGrade] = useState("");

  const alreadySub = () => {
    return subjectsList.some((s) => s.subject === subName);
  };

  const handleSubValue = (e) => {
    e.preventDefault();

    if (alreadySub()) {
      setInpMessage("Subject already exists.");
      return;
    }

    setSubjectsList((prev) => [...prev, { subject: subName, grade: grade }]);
    setOkSub(true);
    setSubName("");
    setGrade("");
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
        {Object.keys(gradeValue).map((g, i) => (
          <p
            key={i}
            onClick={(e) => {
              e.preventDefault();
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
    { subject: "Mathamatics", grade: "A" },
  ]);
  const [fieldName, setFieldName] = useState("");
  const [fieldBucket, setFieldBucket] = useState(null);
  const [nameOk, setNameOk] = useState(false);

  const [displayPinChoice, setDisplayPinChoice] = useState(null);

  const [inpMessage, setInpMessage] = useState("");
  const [inpError, setInpError] = useState("");
  const [okSub, setOkSub] = useState(false);

  const [minTotalRequirment, setMinTotalRequirment] = useState(0);

  const gradeValue = {
    "A+": 90,
    A: 85,
    "B+": 80,
    B: 75,
    "C+": 70,
    C: 65,
    D: 60,
  };

  useEffect(() => {
    if (fieldBucket) {
      console.log(fieldBucket, "🎏45");
    }
  }, [fieldBucket]);

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
        setNameOk(false);

        return true;
      } else if (!res?.data?.exists) {
        setInpMessage(`${collegeName} available.`);
        setNameOk(true);
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
    try {
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
    } catch (e) {
      setInpMessage("Error while checking for pincode validation.");
    }
  };

  // handle set Location data.
  const handleSetLocationData = async () => {
    if (!displayPinChoice) return;
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

    if (!res?.data?.exists && nameOk) {
      setInpMessage(res?.data?.message);
      setNameAndField(true);
    } else if (res?.data?.exists && !nameOk) {
      setInpMessage("First change the college name to something new.");
      setNameAndField(false);
    }
  };

  // handle process to fill field
  const handleProcessToFillField = (e) => {
    e.preventDefault();
    if (!nameOk) {
      setInpMessage("You can't register a new college with an existing name.");
    } else if (isLocationValid() && nameAndField && fieldName && nameOk) {
      setDisplayFill(true);
    }
  };

  // is location filled has data?
  const isLocationValid = () =>
    location.some((l) => l.area && l.city && l.PIN && l.country);

  // handle min total requirement.
  const handleMinTotalRequirement = () => {
    const total = subjectsList?.reduce((acc, s) => {
      return acc + (gradeValue[s.grade] || 0);
    }, 0);

    const average = subjectsList?.length > 0 ? total / subjectsList.length : 0;
    return average;
  };

  useEffect(() => {
    const av = handleMinTotalRequirement();
    setMinTotalRequirment(av);
  }, [subjectsList]);

  // handle add field to bucket.
  const handleAddFieldToBucket = (e) => {
    e.preventDefault();

    if (!collegeName || !isLocationValid() || !fieldName || !okSub) return;
    else {
      setFieldBucket({
        fieldName: fieldName,
        requiredSubjects: subjectsList,
        minTotalRequirment: minTotalRequirment,
      });
    }
  };

  // handle form submit for new college with one field.
  const handleRegisterANewCollegeWithOneField = async (e) => {
    e.preventDefault();
    try {
      const fields = fieldBucket;

      console.log(fields, "GO NOW");

      if (!collegeName || !isLocationValid() || !fields) {
        setInpMessage("Somethings required before registering.");
      }
      const res = await registerANewCollege(collegeName, location, fields);
      if (res?.success) {
        setInpMessage(res?.message);
        console.log(res, "NEW COLLEGE RES.");
        setCollegeName("");
        setFieldBucket("");
        setLocation([{ area: null, city: null, PIN: null, country: null }]);

        setNameAndField(false);

        setSubjectsList([{ subject: "Mathematics", grade: "A" }]);
        setOkSub(false);
        setDisplayFill(false);
        setFieldName("");
      } else {
        setInpMessage(res?.message || "Registration failed.");
      }
    } catch (e) {
      console.error("Unexpected error:", e);
      setInpMessage("Something went wrong in registering college.");
    }
  };

  return (
    <div>
      {inpMessage && <p>{inpMessage}</p>}
      <form onSubmit={handleRegisterANewCollegeWithOneField}>
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

        {nameOk && (
          <div>
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
              disabled={
                !fieldName ||
                !isLocationValid() ||
                !collegeName ||
                !nameAndField
              }
              onClick={handleProcessToFillField}
            >
              Next
            </button>
          </div>
        )}

        {displayFill && (
          <div>
            <p>{Math.ceil(minTotalRequirment)}%</p>
            {subjectsList.map((s, i) => (
              <div key={i}>
                <p>
                  {s.subject} - {s.grade}
                </p>
              </div>
            ))}
            <AddSubject
              subjectsList={subjectsList}
              setSubjectsList={setSubjectsList}
              setInpMessage={setInpMessage}
              gradeValue={gradeValue}
              setOkSub={setOkSub}
              handleMinTotalRequirement={handleMinTotalRequirement}
            />
          </div>
        )}

        <button
          disabled={!isLocationValid() || !okSub || !collegeName || !fieldName}
          onClick={handleAddFieldToBucket}
        >
          Add {fieldName}
        </button>
        <button type="submit">Register field to this College.</button>
      </form>
    </div>
  );
}

export default RegCollegeForm;
