import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { regesterCollegeH } from "../services/regesterCollege.js";
import { getAllCreatedCollegesH } from "../services/regesterCollege.js";

const AsCollegeContext = createContext();

export const AsCollegeProvider = ({ children }) => {
  const [createdColleges, setCreatedColleges] = useState([]);
  const [allColleges, setAllColleges] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // register a new college.
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

  // fetch created Colleges.
  // const getCreatedColleges = async () => {
  //   try{

  //   }catch(e){

  //   }
  // }

  // fetch all colleges.

  return (
    <AsCollegeContext.Provider value={{ registerANewCollege, loading, error }}>
      {children}
    </AsCollegeContext.Provider>
  );
};
export const useAsCollegeContext = () =>  useContext(AsCollegeContext);
