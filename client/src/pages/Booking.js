import React, { Component } from "react";

import BookingList from '../components/Bookings/BookingList/BookingList';
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

class BookingPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBooking();
  }

  fetchBooking = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            bookings {
              _id
              createdAt
              updatedAt
              event {
                _id
                title
                creator{
                  _id
                  email
                }
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
        Authorization: `Bearer ${this.context.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const { bookings } = resData.data;
        this.setState({ bookings, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  render() {

    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> : (
          <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/>
        )}
      </React.Fragment>
    );
  }
}

export default BookingPage;
