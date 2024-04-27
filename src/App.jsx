
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import RootLayout from './pages/rootLayout/RootLayout';
import Profile from './pages/users/Profile';
import Users from './pages/users/Users';
import UserPlaces from './pages/places/UserPlaces';
import NewPlace from './pages/places/NewPlace';
import EditPlace from './pages/places/EditPlace';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import LoadingSpinner from './util/UI/Loading/LoadingSpinner';
import ProtectedRoute from './util/helpers/ProtectedRoute';
import ProtectedSignRoute from './util/helpers/ProtectedSignRoute';
import useAuth from './util/hooks/useAuth';


import { queryClient } from './util/http/http';
import { AuthContext } from './store/auth-context';

const router = createBrowserRouter([
  {
    path:'/', 
    element: <RootLayout />,
    children:[
      {
        index:true,
        element:<Users />
      },
      {
        path:'profile/:userId',
        element:<ProtectedRoute component={<Profile/>} />
      },
      {
        path:':userId/places', 
        element:<ProtectedRoute component={<UserPlaces/>} />
      },
      {
        path:'places/:placeId',
        element:<ProtectedRoute component={<EditPlace/>} />
      },
      {
        path:'places/new',
        element:<ProtectedRoute component={<NewPlace/>} />
      },
      {
        path:'auth',
        element:<ProtectedSignRoute component={<Login />} />
      },
      {
        path:'auth/signup',
        element:<ProtectedSignRoute component={<Signup />} />
      },
      {
        path:'*',
        element: (
          <div style={{textAlign: 'center', color: 'white', marginTop:'7rem'}} >
            <h1>Page Not Found!</h1>
          </div>
        )
      }
    ]
  },
]);

function App() {

  const {isLoading, token, userId, userImage, login, logout, changeUserImage} = useAuth();

  return (
    <>
      {isLoading && <LoadingSpinner size="60px" margin="5rem" />}
      {
        !isLoading && 
        <QueryClientProvider client={queryClient} >
          <AuthContext.Provider 
            value={{
                isLoggedIn: !!token,
                token:token,
                userId: userId,
                userImage:userImage,
                login:login,
                logout: logout,
                changeUserImage:changeUserImage 
            }}
          >
            <RouterProvider router={router} />
          </AuthContext.Provider>
        </QueryClientProvider>
      }
    </>
  );
}

export default App;
