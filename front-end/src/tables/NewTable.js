import React, { useState } from "react";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

function NewTable() {
  const initialTableState = {
    table_name: "",
    capacity: 0,
  };

  const [table, setTable] = useState({
    ...initialTableState,
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  function validate(table) {
    const errors = [];

    function isValidName({ table_name }) {
      if (table_name.length < 2) {
        errors.push(
          new Error("table_name must be 2 or more characters")
        );
      }
    }

    function isValidCapacity({ capacity }) {
      if (capacity <= 0) {
        errors.push(new Error("capacity must be at least 1."));
      }
    }

    isValidName(table);
    isValidCapacity(table);
    return errors;
  }

  const changeHandler = ({ target: { name, value } }) => {
    let newValue = value;
    if(name === 'capacity') {
      newValue = Number(value); 
    }
    setTable({
      ...table,
      [name]: newValue,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const errors = validate(table);
    if (errors.length) {
      return setError(errors);
  };

  const abortController = new AbortController();
    setError(null);
    createTable(table, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch((error) => {
        setError(error);
      });
    return () => abortController.abort();
  }

  return (
    <>
      <h2>Create a Table:</h2>
      <ErrorAlert error={ error ? error[0] : null } />
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