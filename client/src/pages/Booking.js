import React, { useState, useEffect, useContext } from "react";

import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingChart from "../components/Bookings/BookingChart/BookingChart";
import BookingControls from "../components/Bookings/BookingControls/BookingControls";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

const BookingPage = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState("list");

  const context = useContext(AuthContext);

  useEffect(() => {
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
    setIsLoading(true);
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
        const { bookings } = resData.data;
        setBookings(bookings);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const deleteBookingHandler = bookingId => {
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
        setBookings(bookings.filter(booking => booking._id !== bookingId));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const changeOutputType = type => {
    if (type === "list") {
      setOutputType("list");
    } else {
      setOutputType("chart");
    }
  };

  let content = <Spinner />;
  if (!isLoading) {
    content = (
      <React.Fragment>
        <BookingControls outputType={outputType} onChange={changeOutputType} />
        <div>
          {outputType === "list" ? (
            <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
          ) : (
            <BookingChart bookings={bookings} />
          )}
        </div>
      </React.Fragment>
    );
  }
  return <React.Fragment>{content}</React.Fragment>;
};

export default BookingPage;
