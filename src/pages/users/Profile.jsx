import { useContext } from "react";

import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import UserProfile from "../../components/users/UserProfile";
import LoadingSpinner from "../../util/UI/Loading/LoadingSpinner";
import ErrorBlock from "../../util/UI/ErrorBlock/ErrorBlock";

import { fetchRequest } from "../../util/http/http";
import { AuthContext } from "../../store/auth-context";

const Profile = (props) => {

    const userId = useParams().userId;

    const auth = useContext(AuthContext);

    const {data, isPending, isError, error} = useQuery({
        queryKey:['user-profile', {userId: userId}],
        queryFn:({signal}) => {
            return fetchRequest({
                signal, 
                url: import.meta.env.VITE_BACKEND_URL + `/api/users/profile/${userId}`,
                headers:{
                    'Authorization': 'Bearer ' + auth.token
                }
            });
        }
    });

    return (
        <>
            {
                isPending && 
                <LoadingSpinner size="60px" margin="7rem" />
            }
            {
                isError && 
                <ErrorBlock errorContent={error.message} />
            }
            {
                !isPending && !isError && 
                <UserProfile userData={data.user} avatars={data.avatars} />
            }
        </>
    );
}

export default Profile;