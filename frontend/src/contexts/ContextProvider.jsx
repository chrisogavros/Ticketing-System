import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../lib/axios";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => { },
    setToken: () => { },
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    useEffect(() => {
        if (token) {
            axiosClient.get('/user')
                .then(({ data }) => {
                    setUser(data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [token]);

    return (
        <StateContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
