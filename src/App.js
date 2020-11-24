import React, { useState, useCallback, useEffect } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './places/pages/Auth';
import { AuthContext } from './shared/context/auth.context'

let logoutTimer;

function App() {
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

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace/>
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace/>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path="/auth" exact>
          <Auth/>
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn: !!token, 
        token: token,
        userId: userId, 
        login: login, 
        logout: logout 
      }}>
      <Router>
        <MainNavigation/>
        <main>
            {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );

}

export default App;
