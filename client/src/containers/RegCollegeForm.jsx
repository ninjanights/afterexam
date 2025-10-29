import React, { useEffect, useRef, useState } from "react";
import { useAsCollegeContext } from "../contexts/AsCollegeContext";
import { regesterCollegeSideApi } from "../services/axios";
import axios from "axios";

function RegCollegeForm() {
  const { registerANewCollege, loading, error } = useAsCollegeContext();
  const [pincode, setPincode] = useState("");

  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState([
    { area: null, city: null, PIN: null, country: null },
  ]);
  const [fields, setFields] = useState([]);

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
        setInpMessage("jjj");
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

    setPincode();
  };

  // handle clear pin location input.
  const handleClearPinInput = () => {
    if (pincode || location?.area !== null) {
      setPincode("");
      setLocation([{ area: null, city: null, PIN: null, country: null }]);
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

        {/* location: {
      area: { type: String, required: true },
      city: { type: String, required: true },
      PIN: { type: Number, required: true },
      country: { type: String, required: true },
    }, */}
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
      </form>
    </div>
  );
}

export default RegCollegeForm;
