import { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../UI/Loading/LoadingSpinner";

import { AuthContext } from "../../store/auth-context";


const ProtectedSignRoute = ({ component: Component}) => {

    const [isLoading, setIsLoading] = useState(true);

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(false);
        if(auth.isLoggedIn){
            navigate('/');
        }
    },[auth.isLoggedIn]);

    return (
        <>
            {
                isLoading && 
                <LoadingSpinner size="50px" margin="6rem" />
            }
            {
                !isLoading && 
                Component
            }
        </>
    );

};

export default ProtectedSignRoute;