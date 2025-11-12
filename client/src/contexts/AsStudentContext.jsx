import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  deleteSubjectH,
  getStudentSubjectStackH,
  setStudentSubjectStackH,
} from "../services/registerStudentSubjects";
import { getInterestsFieldsH, postTopicValuesH } from "../services/interests";

const SubjectContext = createContext();

export const StudentSubjectProvider = ({ children }) => {
  const [subjectStack, setSubjectStack] = useState(null);
  const [stackGrand, setStackGrand] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [topicValues, setTopicValues] = useState(null);
  const [topicName, setTopicName] = useState("");

  useEffect(() => {
    fetchSubjectStack();
  }, []);

  // fetch subject stack.
  const fetchSubjectStack = async () => {
    setLoading(true);
    setError(null);

    const res = await getStudentSubjectStackH();
    if (res.success) {
      setSubjectStack(res?.data?.subjectStack || []);
      setStackGrand(res?.data?.stackGrand || null);
    } else {
      setError(res?.message || "Failed to fetch subject stack.");
    }
    setLoading(false);
  };

  // set subjects to stack (student).
  const addSubjectStack = async (newEntry) => {
    setLoading(true);
    setError(null);

    const { newSubject, newGrade } = newEntry;
    const res = await setStudentSubjectStackH(newSubject, newGrade);
    if (res.success) {
      setSubjectStack(res.data?.subjectStack);
      setStackGrand(res.data?.stackGrand);
    } else {
      setError(res?.message || "Failed to update subject stack.");
    }
    setLoading(false);
    return res;
  };

  // delete subject from stack.
  const deleteSubject = async (subjectName) => {
    setLoading(true);
    setError(null);

    if (!subjectName) return;

    const res = await deleteSubjectH(subjectName);
    if (res.success) {
      setSubjectStack(res?.data?.subjectStack);
      setStackGrand(res?.data?.stackGrand);
    } else {
      setError(res?.message || "Failed to delete subject from stack.");
    }
    setLoading(false);
    return res;
  };

  // fetch topics under interests.
  const fetchInterests = async (topicname) => {
    setLoading(true);
    setError(null);

    if (!topicname) return;
    const res = await getInterestsFieldsH(topicname);
    console.log(res, "jjj");
    if (res.success) {
      setTopicValues(res?.data);
      setTopicName(res.topicName);
    }
  };

  // set topic values.
  const setTopicValuesC = async (localTopics, topicName) => {
    const res = await postTopicValuesH(localTopics, topicName);
    return res;
  };

  return (
    <SubjectContext.Provider
      value={{
        subjectStack,
        stackGrand,
        loading,
        error,
        fetchSubjectStack,
        addSubjectStack,
        deleteSubject,

        fetchInterests,
        topicValues,
        topicName,

        setTopicValuesC,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useStudentSubject = () => useContext(SubjectContext);
