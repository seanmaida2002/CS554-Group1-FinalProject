import { Navigate, Outlet } from "react-router-dom";
import React, {useContext} from 'react';
import { AuthContext } from "../context/AuthContext";

export const PrivateRoute = () => {
    const {currentUser} = useContext(AuthContext);

    return currentUser ? <Outlet/> : <Navigate to='/login' replace={true} />;

};

export default PrivateRoute;