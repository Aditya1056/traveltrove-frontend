import { useContext } from 'react';

import {useQuery} from '@tanstack/react-query';

import UsersList from '../../components/users/UsersList';
import LoadingSpinner from '../../util/UI/Loading/LoadingSpinner';
import ErrorBlock from '../../util/UI/ErrorBlock/ErrorBlock';

import { fetchRequest } from '../../util/http/http';
import { AuthContext } from '../../store/auth-context';

const Users = () => {

    const auth = useContext(AuthContext);

    const {data, isLoading, isError, error} = useQuery({
        queryKey:['users'],
        queryFn: ({signal}) => {
            return fetchRequest({
                signal, 
                url: import.meta.env.VITE_BACKEND_URL + '/api/users',
            });
        }
    });

    return (
        <>
            {
                isLoading && 
                <LoadingSpinner size="50px" margin="3rem" />
            }
            {
                isError && 
                <ErrorBlock errorContent={error.message} />
            }
            {
                !isLoading && !isError && 
                <UsersList items={data} />
            }
        </>
    );
}

export default Users;