import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const { loggedInUser, isAuthenticated, isLoading, userAccount } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await loggedInUser();
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    if (!isLoading && !isAuthenticated) return <Navigate to="/login" />;

    // if (!isLoading && Object.keys(userAccount).length > 0)
    //     return <Navigate to="/dashboard" />;

    if (isLoading) return <h1>Loading...</h1>;

    if (isAuthenticated) return children;
}

export default ProtectedRoute;
