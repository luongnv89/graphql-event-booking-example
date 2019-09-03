import React from "react";

import './BookingControls.css';

const bookingControl = props => (
  <div className="booking-control">
    <button className={props.outputType === 'list' ? 'active' : ''} onClick={props.onChange.bind(this, "list")}>
      List
    </button>
    <button className={props.outputType === 'chart' ? 'active' : ''} onClick={props.onChange.bind(this, "chart")}>
      Chart
    </button>
  </div>
);

export default bookingControl;
