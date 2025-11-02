import { createContext, useContext, useState, useEffect } from "react";
import {
  regesterCollegeH,
  getAllCollegesH,
} from "../services/regesterCollege.js";

const AsCollegeContext = createContext();

export const AsCollegeProvider = ({ children }) => {
  const [createdColleges, setCreatedColleges] = useState([]);
  const [allColleges, setAllColleges] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch all colleges.
  const fetchAllColleges = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAllCollegesH();
      if (res?.success) {
        console.log(res?.collegeList, "dss");
        setAllColleges(res?.collegeList);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false };
      }
    } catch (e) {
      console.log("Error fetching all colleges.");
      return {
        data: null,
        success: false,
        message: "Something went wrong during getting all colleges.",
      };
    }
  };

  // reg. a new college.
  const registerANewCollege = async (collegeName, location, fields) => {
    try {
      setLoading(true);
      setError(null);
      if (!collegeName || !location || !fields) {
        return {
          success: false,
          message: "Give us proper details about this college.",
        };
      }

      const res = await regesterCollegeH(collegeName, location, fields);
      if (res?.data?.success) {
        return {
          success: true,
          message: "Yeah new college is registered.",
          newCollege: res?.data?.data,
        };
      }
    } catch (e) {
      setError("Failed to register college.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AsCollegeContext.Provider
      value={{
        registerANewCollege,
        fetchAllColleges,
        allColleges,
        loading,
        error,
      }}
    >
      {children}
    </AsCollegeContext.Provider>
  );
};
export const useAsCollegeContext = () => useContext(AsCollegeContext);
