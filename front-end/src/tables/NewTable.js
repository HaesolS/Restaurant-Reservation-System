import React, { useState } from "react";
import { createTable } from "../utils/api";
import ReservationError from "../layout/ReservationError";
import { useHistory } from "react-router-dom";

export const NewTable = () => {
  const initialTableState = {
    table_name: "",
    capacity: 0,
  };

  const [table, setTable] = useState({
    ...initialTableState,
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  const changeHandler = (event) => {
    if (event.target.name === "capacity") {
      setTable({
        ...table,
        [event.target.name]: Number(event.target.value),
      });
    } else {
      setTable({
        ...table,
        [event.target.name]: event.target.value,
      });
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    createTable(table, abortController.signal)
      .then(history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.abort();
  };

  return (
    <>
      <h2>Create a Table:</h2>
      <ReservationError errors={error} />
      <form onSubmit={submitHandler}>
        <fieldset>
          <div>
            <label htmlFor="table_name">Table Name:</label>
            <input
              id="table_name"
              name="table_name"
              type="text"
              required
              value={table.table_name}
              onChange={changeHandler}
            />
          </div>
          <div>
            <label htmlFor="capacity">Capacity:</label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              required
              value={table.capacity}
              onChange={changeHandler}
            />
          </div>
          <div>
          <button type="submit">
              Submit
          </button>
          <button onClick={() => history.goBack()}>
            Cancel
          </button>
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default NewTable;