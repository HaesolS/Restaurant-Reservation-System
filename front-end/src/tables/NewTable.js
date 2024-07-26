import React, { useState } from "react";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

function NewTable() {
  const [table, setTable] = useState({
    table_name: "",
    capacity: 0
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  const changeHandler = (event) => {
    setTable({
      ...table,
      [event.target.name]: event.target.value
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    createTable(table)
    .then(() => {
      history.push(`/dashboard`);
    })
    .catch(setError);
  }

  return (
    <main>
      <h2>New Table</h2>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="table_name"> Table Name </label>
          <input
            id="table_name"
            name="table_name"
            type="text"
            required
            value={table.table_name}
            onChange={changeHandler}
          />
          <small> Enter table name... </small>
        </div>
        <div>
        <label htmlFor="capacity"> Capacity </label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          required
          value={table.capacity}
          onChange={changeHandler}
        />
        <small> Enter table capacity... </small>
        </div>
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
        <button type="submit">
          Submit
        </button>
      </form>
    </main>
  );
};

export default NewTable;