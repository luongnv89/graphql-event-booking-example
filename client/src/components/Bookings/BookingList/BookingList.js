import React from 'react';

import './BookingList.css';

const bookingList = props => (
    <ul className="booking-list">
      {props.bookings.map(booking => (
        <li key={booking._id} className="booking-item">
          <div className="booking-data">
            <h1>{booking.event.title} - {booking.event.price}</h1>
            <h2>{new Date(booking.createdAt).toLocaleDateString()}</h2>
          </div>
          <div className="booking-actions">
            <button className="btn" onClick={props.onDelete.bind(this,booking._id)}>Cancel</button>
          </div>
        </li>
      ))}
    </ul>
)

export default bookingList;