import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState();

  const login = useCallback((uid, token, expirationDate) =>{
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = 
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // Now + 1h
    setTokenExpiration(tokenExpirationDate);
      localStorage.setItem('userData', JSON.stringify({
      userId: uid,
      token,
      expiration: tokenExpirationDate.toISOString()
    }));
  }, []);

  const logout = useCallback(() =>{
    setToken(null);
    setUserId(null);
    setTokenExpiration(null);
    localStorage.removeItem('userData');
  }, []);

  // Whenever our token changes (ie login, logout)
  // Creates a timer to logout when JWT expires
  useEffect(() => {
    if (token && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpiration]);

  // Will run on mount
  // Checks localstorage for JWT, and if so logs user
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if(
      storedData && 
      storedData.token && 
      new Date(storedData.expiration) > new Date()  // if stored date is still later than now
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { userId, token, login, logout,  }
};