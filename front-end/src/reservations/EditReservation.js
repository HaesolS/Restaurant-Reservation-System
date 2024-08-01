import React, { useEffect, useState } from "react";
import { readReservation, updateReservation } from "../utils/api";
import ReservationError from "../layout/ReservationError";
import { useHistory, useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { ValidReservation } from "./ValidReservation.js";

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
      .then(data => setReservation(data))
      .catch(setError);
      return () => abortController.abort();
    }, [reservation_id]);

    useEffect(() => {
      if (reservation.reservation_time) {
        let timeParts = reservation.reservation_time.split(":");
        let newReservationTime = timeParts[0] + ":" + timeParts[1];
        setReservation(prev => ({
          ...prev,
          reservation_time: newReservationTime
        }));
      }
    }, [reservation.reservation_time])
     
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
    
    const submitHandler = async (event) => {
      event.preventDefault();
      const abortController = new AbortController();
      const errors = ValidReservation(reservation);
      if (errors.length) {
        return setError(errors)
      } 
      try {
        await updateReservation(reservation, abortController.signal)
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      } catch(error) {
          setError([error])
      }
      return () => abortController.abort();
    }
    return (
      <>
        <h2> Edit Reservation </h2>
        <ReservationError errors={error} />
        <ReservationForm
            reservation={reservation}
            changeHandler={changeHandler}
            submitHandler={submitHandler}
        />
      </>
    );
  };
  
  export default EditReservation;