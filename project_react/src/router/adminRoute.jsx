import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {

    const {
        isLoggedIn,
        isAdmin
    } = useAuth();

    // not login or not admin
    if (!isLoggedIn || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    // admin
    return <Outlet />;
};

export default AdminRoute;