import { createContext, useContext, useState, useEffect } from "react";
import { loginUserH } from "../services/regesterCollege";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // login fn
  const login = async (username, role) => {
    const res = await loginUserH(username, role);
    if (res) {
      setLoggedInUser(res.data.user);
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
