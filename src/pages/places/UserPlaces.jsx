import { useContext } from 'react';

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import PlacesList from '../../components/places/PlacesList';
import LoadingSpinner from '../../util/UI/Loading/LoadingSpinner';
import ErrorBlock from '../../util/UI/ErrorBlock/ErrorBlock';
import Avatar from '../../util/UI/Avatar/Avatar';

import { fetchRequest } from '../../util/http/http';
import { AuthContext } from '../../store/auth-context';

const UserPlaces = () => {

    const userId = useParams().userId;

    const auth = useContext(AuthContext);

    const {data, isPending, isError, error} = useQuery({
        queryKey:['user-places', {user: userId}],
        queryFn: ({signal}) => {
            return fetchRequest({
                signal, 
                url: import.meta.env.VITE_BACKEND_URL + `/api/places/user/${userId}`,
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
                <LoadingSpinner size="50px" margin="5rem" />
            }
            {
                isError && 
                <ErrorBlock errorContent={error.message} />
            }
            { 
                !isPending && !isError && 
                <>
                    {
                        auth.userId !== userId && 
                        <div 
                            style={{
                                width:"100%", 
                                marginTop:"2rem",
                                display:"flex", 
                                justifyContent:"center",
                                alignItems:"center",
                            }} 
                            >
                            <div 
                                style={{
                                    width:"13rem",
                                    paddingTop:"1rem",
                                    paddingBottom:"1rem",
                                    display:"flex", 
                                    flexDirection:"column",
                                    justifyContent:"center",
                                    alignItems:"center",
                                    borderRadius:"10px",
                                    boxShadow:"1px 1px 3px grey",
                                    color:"#99bce0",
                                }} 
                            >
                                <Avatar 
                                    image={data.userDetails.image} 
                                    title={data.userDetails.name} 
                                    width="90px" 
                                    height="90px" 
                                />
                                <h2 
                                    style={{
                                        width:"90%", 
                                        textAlign:"center",
                                        marginTop:"1.5rem",
                                        marginBottom:"1.5rem",
                                        paddingLeft:"5px",
                                        paddingRight:"5px",
                                        overflow:"auto",
                                        whiteSpace:"nowrap"
                                    }}
                                >
                                    {data.userDetails.name}
                                </h2>
                                <p
                                    style={{
                                        width:"90%", 
                                        textAlign:"center",
                                        paddingLeft:"5px",
                                        paddingRight:"5px",
                                        overflow:"auto",
                                        whiteSpace:"nowrap"
                                    }}
                                >
                                    {data.userDetails.places} places shared yet!
                                </p>
                            </div>
                        </div>
                    }
                    <PlacesList items={data.userPlaces} />
                </>
            }
        </>
    );
}

export default UserPlaces;