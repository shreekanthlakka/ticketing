import { createContext, useContext, useEffect, useReducer } from "react";
import {
    getCurrentLoggedInUser,
    loginApi,
    logoutApi,
} from "../services/userService";

const authContext = createContext();

const initialState = {
    userAccount: null,
    isLoading: false,
    error: null,
    isLoggedIn: false,
    isAuthenticated: false,
};

function authReducer(state, action) {
    switch (action.type) {
        case "START":
            return { ...state, isLoading: true, error: {} };
        case "ERROR":
            return { ...state, isLoading: false, error: action.payload };
        case "LOGIN":
            return {
                ...state,
                isLoading: false,
                userAccount: action.payload,
                isLoggedIn: true,
                // isAuthenticated: true,
            };
        case "LOGOUT":
            return initialState;
        case "SET_CURRENT_USER":
            return {
                ...state,
                isLoading: false,
                userAccount: action.payload,
                isAuthenticated: action.isAuthenticated,
            };
        default:
            return state;
    }
}

function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(
        authReducer,
        localStorage.getItem("AuthContextInitData")
            ? JSON.parse(localStorage.getItem("AuthContextInitData"))
            : initialState
    );

    const { userAccount, isLoading, error, isLoggedIn, isAuthenticated } =
        state;

    useEffect(() => {
        localStorage.setItem("AuthContextInitData", JSON.stringify(state));
    }, [state]);

    const login = async (formData) => {
        let res;
        try {
            dispatch({ type: "START" });
            res = await loginApi(formData);
            if (!res.success) {
                throw {
                    status: res.statusCode,
                    message: res.message,
                };
            }
            dispatch({ type: "LOGIN", payload: res.data });
            return res;
        } catch (error) {
            dispatch({ type: "ERROR" });
            return res;
        }
    };

    const logout = async () => {
        try {
            dispatch({ type: "START" });
            const res = await logoutApi();
            if (!res.success) {
                throw {
                    status: res.statusCode,
                    message: res.message,
                };
            }
            dispatch({ type: "LOGOUT" });
            return res;
        } catch (error) {
            dispatch({ type: "ERROR", payload: error });
        }
    };

    const loggedInUser = async () => {
        let res;
        try {
            dispatch({ type: "START" });
            res = await getCurrentLoggedInUser();
            if (!res.success) {
                throw {
                    status: res.statusCode,
                    message: res.message,
                };
            }
            dispatch({
                type: "SET_CURRENT_USER",
                payload: res.data,
                isAuthenticated: res.isAuthenticated,
            });
            return res;
        } catch (error) {
            dispatch({ type: "ERROR", payload: error });
            return res;
        }
    };

    const value = {
        userAccount,
        isLoading,
        error,
        isLoggedIn,
        login,
        logout,
        loggedInUser,
        isAuthenticated,
    };
    return (
        <authContext.Provider value={value}>{children}</authContext.Provider>
    );
}

function useAuth() {
    const context = useContext(authContext);
    if (!context) {
        throw new Error("Auth Context used outside scope");
    }
    return context;
}

export { AuthContextProvider, useAuth };
