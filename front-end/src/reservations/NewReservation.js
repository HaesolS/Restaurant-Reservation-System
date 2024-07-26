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

    // const changeHandler = (event) => {
    //     setReservation({
    //         ...reservation,
    //         [event.target.name]: event.target.value
    //     });
    // }

    const cancelHandler = () => {
        history.goBack()
    }

    const submitHandler = (reservation) => {
        const abortController = new AbortController();
        createReservation(
            reservation,
        //    people: Number(reservation.people),
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
            //    reservation={reservation}
            //    changeHandler={changeHandler}
                onCancel={cancelHandler}
                onSubmit={submitHandler}
            />
        </>
    );
}

export default NewReservation;