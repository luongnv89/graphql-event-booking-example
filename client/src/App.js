import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Booking";
import EventPage from "./pages/Event";
import Navigation from "./components/Navigation";

import AuthContext from "./context/auth-context";

// import { useLocalStorage } from './hooks/useLocalStorage';
import { useLocalStorage } from 'react-hooks-crocode';

const App = props => {

  const [token, setToken ] = useLocalStorage('TOKEN');
  const [userId, setUserId] = useLocalStorage('USERID');

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{ token: token, userId: userId, login: login, logout: logout }}
      >
        <Navigation />
        <main className="main-content">
          <Switch>
            {token && <Redirect from="/" to="events" exact />}
            {token && <Redirect from="/auth" to="events" exact />}

            {!token && <Route path="/auth" component={AuthPage} />}
            {token && <Route path="/bookings" component={BookingPage} />}

            <Route path="/events" component={EventPage} />

            {!token && <Redirect to="auth" exact />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;
