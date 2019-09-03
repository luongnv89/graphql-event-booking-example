import React, { Component } from "react";

import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingChart from "../components/Bookings/BookingChart/BookingChart";
import BookingControls from "../components/Bookings/BookingControls/BookingControls";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

class BookingPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "list"
  };

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
                price
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

  deleteBookingHandler = bookingId => {
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!){
            cancelBooking(bookingId: $id) {
              _id
              title
              creator{
                _id
                email
              }
            }
          }
        `,
      variables: {
        id: bookingId
      }
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
        console.log(resData);
        this.setState(prevState => ({
          bookings: prevState.bookings.filter(
            booking => booking._id !== bookingId
          )
        }));
      })
      .catch(err => {
        console.log(err);
      });
  };

  changeOutputType = type => {
    if (type === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingControls outputType={this.state.outputType} onChange={this.changeOutputType}/>
          <div>
            {this.state.outputType === "list" ? (
              <BookingList
                bookings={this.state.bookings}
                onDelete={this.deleteBookingHandler}
              />
            ) : (
              <BookingChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }
    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default BookingPage;
