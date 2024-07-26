import React, { useEffect, useState } from "react";
import { updateStatus, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

function ReservationList({ res }) {
    const [reservation, setReservation] = useState(res);
    const [error, setError] = useState(null);
    const history = useHistory();

    const cancelHandler = (event) => {
        event.preventDefault();
        setError(null);
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            updateStatus({ status: "cancelled" }, reservation.reservation_id)
            .then(() => {
                listTables()
                history.push("/dashboard");
            })
            .catch(setError)
        }
    }

    useEffect(() => {
        setReservation(reservation);
    }, [reservation, history])

    return (
        <>
        <ErrorAlert error={error} />
        <tr>
            <th> {reservation.reservation_id} </th>
            <td> {reservation.first_name} </td>
            <td> {reservation.last_name} </td>
            <td> {reservation.people} </td>
            <td> {reservation.mobile_number} </td>
            <td> {reservation.reservation_date} </td>
            <td> {reservation.reservation_time} </td>
            <td data-reservation-id-status={reservation.reservation_id}> {reservation.status} </td>
            <td>
                {reservation.status === "booked" ? (
                <>
                <a href={`/reservations/${reservation.reservation_id}/seat`}>
                    <button> Seat </button>
                </a>
                <a href={`/reservations/${reservation.reservation_id}/edit`}>
                    <button> Edit </button>
                </a>
                <button onClick={cancelHandler} data-reservation-id-cancel={reservation.reservation_id}> Cancel </button>
                </>
                ) : (
                <></>
                )}
            </td>
        </tr>
        </>
    );
}

export default ReservationList;