import React from "react";

import "./EventItem.css";

const eventItem = props => (
  <li className="event-item">
    <div>
      <h1>{props.title}</h1>
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString()}{" "}
        {new Date(props.date).toLocaleTimeString()}
      </h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>Your are the owner of this event</p>
      ) : (
        <button
          className="btn"
          onClick={props.onDetail.bind(this, props.eventId)}
        >
          View Details
        </button>
      )}
    </div>
  </li>
);

export default eventItem;
