import React, { useState } from "react";
import { createReservation } from "../utils/api.js";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm.js";

function NewReservation({ date }) {
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1
    })
    const [error, setError] = useState(null);
    const history = useHistory();

    const changeHandler = (event) => {
        if (event.target.name === "people") {
            setReservation({
                ...reservation,
                [event.target.name]: Number(event.target.value)
            });
        } else {
            setReservation({
            ...reservation,
            [event.target.name]: event.target.value
        });
        }
    }

    // const cancelHandler = () => {
    //     history.goBack()
    // }

    const submitHandler = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        createReservation(
            reservation,
            abortController.signal
        )
        .then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError);
        return () => abortController.abort()
    }

    return (
        <>
            <h2> New Reservation </h2>
            <ErrorAlert error={error} />
            <ReservationForm
                reservation={reservation}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
            />
        </>
    );
}

export default NewReservation;