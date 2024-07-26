import React, { useState, useEffect } from "react";
import { readReservation, listTables, updateTable } from "../utils/api";
import { useHistory, useParams } from "react-router";

function ReservationSeat() {
    const [tables, setTables] = useState([]);
    const [tableId, setTableId] = useState("");
    const [reservation, setReservation] = useState({});
    const history = useHistory();
    const { reservation_id } = useParams();

    useEffect(() => {
        listTables().then(setTables);
    }, []);

    useEffect(() => {
        readReservation(reservation_id)
            .then(setReservation);
    }, [reservation_id]);

    const changeHandler = (event) => {
        setTableId(event.target.value);
      };

    const submitHandler = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await updateTable(reservation.reservation_id, tableId);
        history.push("/dashboard");
      };

    return (
        <>
            <h2> Seat Reservation </h2>
            <form onSubmit={submitHandler}>
                <fieldset>
                <div>
                <select
                    id="table_id"
                    name="table_id"
                    onChange={changeHandler}
                >
                <option> Select a table </option>
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
                <div>
                    <button type="button" onClick={() => history.goBack()}>
                        Cancel
                    </button>
                    <button type="submit">
                        Submit
                    </button>
                </div>
                </fieldset>
            </form>
        </>
    );
}

export default ReservationSeat;