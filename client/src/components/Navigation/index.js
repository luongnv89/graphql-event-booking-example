import React from "react";
import { NavLink } from "react-router-dom";

import './index.css';

import AuthContext from '../../context/auth-context';

const Navigation = props => (
  <AuthContext.Consumer>
  {(context) => {
    return (
      <header className="main-nav">
      <div className="nav-logo">
        <h1>Montimage</h1>
      </div>
      <nav className="nav-item">
        <ul>
          {!context.token && <li>
            <NavLink to="/auth"> Authentication</NavLink>
          </li>}
          <li>
            <NavLink to="/events"> Events</NavLink>
          </li>
          {context.token && <li>
            <NavLink to="/bookings"> Bookings</NavLink>
          </li>}
        </ul>
      </nav>
    </header>
    )
  }}
  </AuthContext.Consumer>
);

export default Navigation;