import React, { Component } from "react";

import Modal from "../components/Modal";
import Backdrop from "../components/Backdrop";
import "./Event.css";
import AuthContext from "../context/auth-context";

class EventPage extends Component {
  state = {
    creating: false,
    events: [],
  }

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.startCreateEventHandler = this.startCreateEventHandler.bind(this);
    this.modalCancelHandler = this.modalCancelHandler.bind(this);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }


  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  modalConfirmHandler = () => {
    console.log("Handle Modal Confirm");
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const event = { title, price, date, description };
    console.log(event);
    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.context.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        this.fetchEvents();
        this.setState({ creating: false });
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchEvents () {
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
        this.setState({events});
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const eventList = this.state.events.map(event => {
      return (<li className="event-item" key={event._id}>{event.title}</li>)
    })
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  ref={this.dateElRef}
                ></input>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  id="description"
                  rows="5"
                  ref={this.descriptionElRef}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        { this.context.token && (<div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>)}
        {this.state.events.length > 0 && (<ul className="event-list">
          {eventList}
        </ul>)}
      </React.Fragment>
    );
  }
}

export default EventPage;
