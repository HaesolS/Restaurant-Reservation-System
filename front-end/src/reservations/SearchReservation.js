import React, { useState } from "react";
import ReservationList from "./ReservationList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

function SearchReservation() {
  const [error, setError] = useState(null);
  const [mobile_number, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [reservationMessage, setReservationMessage] = useState("");

  const changeHandler = ({ target }) => {
    setMobileNumber(target.value);
  }

  const findHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    listReservations({ mobile_number }, abortController.signal)
      .then((reservations) => setReservations(reservations))
      .then(setReservationMessage("No reservations found"))
      .catch((error) => setError(error));
    return () => abortController.abort();
  }

  return (
    <>
      <div>
        <h1>Search Reservation</h1>
        <ErrorAlert error={error} setError={setError} />
      </div>

      <div id="mobileSearchBox">
        <input 
          type="text" 
          name="mobile_number"
          onChange={changeHandler}
          value={mobile_number}
          placeholder="Enter a customer's phone number" 
        />
        <button 
          type="submit" 
          onClick={findHandler}>
            Find
        </button>
      </div>

    <div className="reservationList">
      {reservations.length ? 
        <ReservationList reservations={reservations} />
        :
        <h3>{reservationMessage}</h3>
      }
    </div>
    </>
  );
}

export default SearchReservation;