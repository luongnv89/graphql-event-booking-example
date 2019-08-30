import React, {Component} from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Booking";
import EventPage from "./pages/Event";
import Navigation from "./components/Navigation";

import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({
      token,
      userId
    });
  }

  logout = () => {
    this.setState({
      token: null,
      userId: null
    })
  }

  render() {
    return (
    <BrowserRouter>
      <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout}}>
        <Navigation />
        <main className="main-content">
          <Switch>
            {!this.state.token && <Redirect from="/" to="auth" exact />}
            {!this.state.token && <Route path="/auth" component={AuthPage} />}

            {this.state.token && <Redirect from="/" to="events" exact />}
            {this.state.token && <Redirect from="/auth" to="events" exact />}
            {this.state.token && <Route path="/bookings" component={BookingPage} />}

            <Route path="/events" component={EventPage} />
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
  }
}

export default App;
