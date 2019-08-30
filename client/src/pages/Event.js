import React, { Component } from "react";

import Modal from "../components/Modal";
import Backdrop from "../components/Backdrop";
import "./Event.css";

class EventPage extends Component {
  state = {
    creating: false
  };

  constructor(props) {
    super(props);
    this.startCreateEventHandler = this.startCreateEventHandler.bind(this);
    this.modalCancelHandler = this.modalCancelHandler.bind(this);
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  modalConfirmHandler = () => {
    console.log("Handle Modal Confirm");
  };

  render() {
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
            {" "}
            <p>Modal content</p>
          </Modal>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventPage;
