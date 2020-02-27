import React, { useState, useEffect, useContext } from "react";

import Modal from "../components/Modal";
import Backdrop from "../components/Backdrop";
import "./Event.css";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

const EventPage = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const context = useContext(AuthContext);

  const titleElRef = React.createRef();
  const priceElRef = React.createRef();
  const dateElRef = React.createRef();
  const descriptionElRef = React.createRef();

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              price
              date
              description
              creator{
                _id
                email
              }
            }
          }
        `
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const { events } = resData.data;
        setEvents(events);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(fetchEvents, []);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const bookEventHandler = () => {
    if (!context.token) {
      setSelectedEvent(null);
      return;
    }

    const requestBody = {
      query: `
            mutation BookEvent($id: ID!){
              bookEvent (eventId: $id){
                _id
                createdAt
                updatedAt
              }
            }
        `,
      variables: {
        id: selectedEvent._id
      }
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        setSelectedEvent(null);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const modalConfirmHandler = () => {
    console.log("Handle Modal Confirm");
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      console.error('Invalid data');
      return;
    }
    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!){
            createEvent(eventInput: {title: $title, price: $price, date: $date, description: $description}) {
              _id
              title
              price
              date
              description
              creator{
                _id
                email
              }
            }
          }
        `,
      variables: {
        title,
        price,
        date,
        description
      }
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        setCreating(false);
        events.push(resData.data.createEvent);
        setEvents(events);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const showDetailHandler = eventId => {
    setSelectedEvent(events.find(e => e._id === eventId));
  };

  useEffect(() => {
    return () => {
      console.log(`component did mount`);
    };
  }, []);

  return (
    <React.Fragment>
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                id="description"
                rows="5"
                ref={descriptionElRef}
              ></textarea>
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={context.token ? "Book" : "Confirm"}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}{" "}
            {new Date(selectedEvent.date).toLocaleTimeString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {context.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={context.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default EventPage;
