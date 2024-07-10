import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api.js";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm.js";

function NewReservation({ date }) {
    const history = useHistory();
    const [reservationError, setReservationError] = useState(null);
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0
    })
    const changeHandler = ({ target }) => {
            setReservation({
                ...reservation,
                [target.name]: target.value
            });
        }

    function submitHandler(event) {
        event.preventDefault();
        createReservation({
            ...reservation,
            people: Number(reservation.people),
        })
        .then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setReservationError);
    }

    return (
        <main>
            <h1>New Reservation</h1>
            <ErrorAlert error={reservationError} />
            <ReservationForm
                reservation={reservation}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
            />
        </main>
    )
}

export default NewReservation;