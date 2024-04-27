import { useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../store/auth-context";

const ProtectedRoute = ({ component: Component}) => {

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isLoggedIn){
            navigate('/auth');
        }
    },[auth.isLoggedIn]);

    return Component;
};

export default ProtectedRoute;