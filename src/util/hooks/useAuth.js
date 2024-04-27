import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

const useAuth = () => {

    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [tokenExpiration, setTokenExpiration] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userImage, setUserImage] = useState(null);
  
    const login = useCallback((userId, userImage, userToken, expiration) => {
      setUserId(userId);
      setToken(userToken);
      setUserImage(userImage);
      const expirationDate = new Date(new Date().getTime() + expiration);
      setTokenExpiration(expirationDate);
      localStorage.setItem(
        'userData', 
        JSON.stringify({
          id: userId, 
          image: userImage,
          token: userToken, 
          expirationDate: expirationDate.toISOString()
        })
      );
    }, []);
    
    const logout = useCallback(() => {
      setUserId(null);
      setToken(null);
      setTokenExpiration(null);
      setUserImage(null);
      localStorage.removeItem('userData');
    }, []);

    const changeUserImage = useCallback((image) => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      storedData.image = image;
      localStorage.setItem('userData', JSON.stringify(storedData));
      setUserImage(image);
    }, []);
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if(storedData && storedData.token && new Date(storedData.expirationDate) > new Date()){
        const timeRemaining = new Date(storedData.expirationDate).getTime() - new Date().getTime();
        login(storedData.id, storedData.image, storedData.token, timeRemaining);
      }
      setIsLoading(false);
    }, [login]);
  
    useEffect(() => {
      if(token && tokenExpiration){
        const timeRemaining = tokenExpiration.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, timeRemaining);
      }
      else{
        clearTimeout(logoutTimer);
      }
    },[token, tokenExpiration, logout]);

    return {
        token,
        userId,
        userImage,
        isLoading,
        login,
        logout,
        changeUserImage
    };
}

export default useAuth;