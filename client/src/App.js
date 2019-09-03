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

  componentDidMount = () => {
    const token = sessionStorage.getItem('TOKEN');
    const userId = sessionStorage.getItem('USERID');
    if (token && userId) {
      this.setState({
        token,
        userId
      });
    }
  }

  login = (token, userId, tokenExpiration) => {
    sessionStorage.setItem('TOKEN', token);
    sessionStorage.setItem('USERID', userId);
    this.setState({
      token,
      userId
    });
  }

  logout = () => {
    sessionStorage.removeItem('TOKEN');
    sessionStorage.removeItem('USERID');
    this.setState({
      token: null,
      userId: null
    })
  }

  render() {
    console.log(this.state);
    return (
    <BrowserRouter>
      <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout}}>
        <Navigation />
        <main className="main-content">
          <Switch>
            {this.state.token && <Redirect from="/" to="events" exact />}
            {this.state.token && <Redirect from="/auth" to="events" exact />}

            {!this.state.token && <Route path="/auth" component={AuthPage} />}
            {this.state.token && <Route path="/bookings" component={BookingPage} />}

            <Route path="/events" component={EventPage} />

            {!this.state.token && <Redirect to="auth" exact />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
  }
}

export default App;
