import React, { useState, useEffect } from "react";
import { readReservation, listTables, updateTable } from "../utils/api";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat() {
    const [tables, setTables] = useState([]);
    const [tableId, setTableId] = useState("");
    const [reservation, setReservation] = useState({});
    const history = useHistory();
    const { reservation_id } = useParams();

    const [submitError, setSubmitError] = useState(null);
    const [tablesError, setTablesError] = useState(null);
    const [reservationError, setReservationError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        setTablesError(null)
        listTables(abortController.signal).then(setTables).catch(setTablesError);

        return () => abortController.abort();
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        setReservationError(null)
        readReservation(reservation_id, abortController.signal).then(setReservation).catch(setReservationError);

        return () => abortController.abort();
    }, [reservation_id]);

    const changeHandler = ({target: {value}}) => {
        setTableId(value);
      };

    const submitHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setSubmitError(null)
        updateTable(reservation.reservation_id, tableId)
        .then(() => history.push("/dashboard"))
        .catch(setSubmitError);
    };

    const onCancel = () => {
        history.goBack();
    }

    return (
        <>
            <h2> Seat Reservation </h2>
            <ErrorAlert error={reservationError} />
            <ErrorAlert error={tablesError} />
            <ErrorAlert error={submitError} />

            <h3>
                # {reservation_id} - {reservation.first_name} {reservation.last_name} on{" "}
                {reservation.reservation_date} at {reservation.reservation_time} for{" "}
                {reservation.people}{" "}
            </h3>
            <form onSubmit={submitHandler}>
                <fieldset>
                <div className="row">
                    <div className="form-group col">
                        <label htmlFor="table_id">Seat at:</label>
                        <select
                            id="table_id"
                            name="table_id"
                            className="form-control"
                            value={tableId}
                            required={true}
                            onChange={changeHandler}
                        >
                            <option value=""> Select a table </option>
                                {tables.map((table) => (
                                    <option
                                        key={table.table_id}
                                        value={table.table_id}
                                        disabled={
                                            table.capacity < reservation.people || table.occupied
                                        }
                                    >
                                        {table.table_name} - {table.capacity}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
                <div>
                    <button 
                        type="button" 
                        className="btn btn-secondary mr-2 cancel"
                        onClick={onCancel}
                    >
                        <span className="oi oi-x" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <span className="oi oi-check" /> Submit
                    </button>
                </div>
                </fieldset>
            </form>
        </>
    );
}

export default ReservationSeat;