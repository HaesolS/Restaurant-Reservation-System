import React, { useState } from "react";
import { listReservations } from "../utils/api";
import { useHistory } from "react-router-dom";
import ReservationList from "./ReservationList";

function SearchReservation() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [reservations, setReservations] = useState(null);
    const [error, setError] = useState('No reservations found');
    const history = useHistory();
  
    const submitHandler = (event) => {
        event.preventDefault();
        setError(null);
        listReservations({ mobile_number: mobileNumber })
        .then((res) => {
          setReservations(res);
          history.push('/search');
        })
        .catch((err) => setError('No reservations found'));
    }
  
    return (
      <>
        <h2> Search </h2>
        <div>
        <form onSubmit={submitHandler}>
            <div>
                <label htmlFor="mobile_number">Mobile Number:</label>
                <input
                    id="mobile_number"
                    name="mobile_number"
                    type="search"
                    required
                    placeholder="Enter a customer's phone number"
                    value={mobileNumber}
                    onChange={(event) => setMobileNumber(event.target.value)}
                />
            </div>
            <button type="submit">
                Find
            </button>
        </form>
        </div>
        <br />
        {reservations && reservations.length ?
        <div>
          <h3> Matching Reservations </h3>
          <table>
            <thead>
              <th> Reservation ID </th>
              <th> First Name </th>
              <th> Last Name </th>
              <th> Party Size </th>
              <th> Phone Number </th>
              <th> Reservation Date </th>
              <th> Reservation Time </th>
              <th> Reservation Status </th>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <ReservationList res={res} />
              ))}
            </tbody>
          </table>
        </div>
        :
        <>
          <p> {error} </p>
        </>
        }
      </>
    );
  }

export default SearchReservation;