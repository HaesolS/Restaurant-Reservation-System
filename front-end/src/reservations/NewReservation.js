import React, { useState } from "react";
import { createReservation } from "../utils/api.js";
import ReservationError from "../layout/ReservationError";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm.js";
import { ValidReservation } from "./ValidReservation.js";

export const NewReservation = () => {
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
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
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        const errors = ValidReservation(reservation);
        if (errors.length) {
            return setError(errors)
        } 
        try {
            await createReservation(reservation, abortController.signal);
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        } catch(error) {
            setError([error])
        }
        return () => abortController.abort()
    };

    return (
        <>
            <h2> New Reservation </h2>
            <ReservationError errors={error} />
            <ReservationForm
                reservation={reservation}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
            />
        </>
    );
}

export default NewReservation;