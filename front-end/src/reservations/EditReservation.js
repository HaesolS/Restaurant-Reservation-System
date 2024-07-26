import React, { useEffect, useState } from "react";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";

function EditReservation({ date }) {
    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({reservation_id});
    const [error, setError] = useState(null);
    const history = useHistory();
    
    useEffect(() => {
      readReservation(reservation_id)
      .then((response) => {
        setReservation({
          ...response,
          people: Number(response.people),
        })
      })
      .catch(setError);
    }, [reservation_id]);
     
    const changeHandler = (event) => {
      setReservation({
        ...reservation,
        [event.target.name]: event.target.value,
      });
    }
    
    const submitHandler = (event) => {
      event.preventDefault();
      updateReservation({
        ...reservation,
        people: Number(reservation.people),
      })
      .then((res) => {
        setReservation({ ...res });
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setError);
    }
  
    return (
      <>
        <h2> Edit Reservation </h2>
        <ErrorAlert error={error} />
        <ReservationForm
            reservation={reservation}
            changeHandler={changeHandler}
            submitHandler={submitHandler}
        />
      </>
    );
  };
  
  export default EditReservation;