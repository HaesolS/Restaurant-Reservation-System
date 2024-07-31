import React, { useEffect, useState } from "react";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";

function EditReservation() {
    const initialState = {
      first_name: "",
      last_name: "",
      mobile_number: "",
      reservation_date: "",
      reservation_time: "",
      people: 0,
    }
    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({ ...initialState });
    const [error, setError] = useState(null);
    const history = useHistory();
    
    useEffect(() => {
      const abortController = new AbortController();
      setError(null);
      readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);


      return () => abortController.abort();
    }, [reservation_id]);
     
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
    
    const submitHandler = (event) => {
      event.preventDefault();
      const abortController = new AbortController();
      updateReservation(reservation, abortController.signal)
      .then((res) => {
        setReservation({ ...res });
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setError);
      return () => abortController.abort();
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