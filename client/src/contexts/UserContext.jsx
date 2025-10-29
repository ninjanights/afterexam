import { createContext, useContext, useState, useEffect } from "react";
import { loginUserH } from "../services/regesterCollege";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // get if already user is in Local Storage.
  useEffect(() => {
    if (loggedInUser) return;

    const alreadyUserInLocalStorage = localStorage.getItem("user");
    if (!alreadyUserInLocalStorage || alreadyUserInLocalStorage === "undefined")
      return;
    setLoggedInUser(JSON.parse(alreadyUserInLocalStorage));
  }, []);

  // login fn
  const login = async (username, role) => {
    const res = await loginUserH(username, role);
    if (res?.data) {
      setLoggedInUser(res);
      console.log(res);

      localStorage.setItem("user", JSON.stringify(res));
    }
    return res;
  };

  // logout fn
  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
