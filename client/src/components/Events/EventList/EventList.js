import React from "react";

import EventItem from "./EventItem/EventItem";

import "./EventList.css";

const eventList = props => {
  const events = props.events.map(event => {
    return (
      <EventItem
        eventId={event._id}
        title={event.title}
        key={event._id}
        price={event.price}
        date={event.date}
        creatorId={event.creator._id}
        userId={props.authUserId}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="event-list">{events}</ul>;
};

export default eventList;
