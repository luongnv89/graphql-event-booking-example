import React from "react";
import { NavLink } from "react-router-dom";

import './index.css';

const Navigation = props => (
  <header className="main-nav">
    <div className="nav-logo">
      <h1>Montimage</h1>
    </div>
    <nav className="nav-item">
      <ul>
        <li>
          <NavLink to="/auth"> Authentication</NavLink>
        </li>
        <li>
          <NavLink to="/events"> Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings"> Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default Navigation;