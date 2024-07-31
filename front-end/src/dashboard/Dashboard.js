import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";
import moment from "moment";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);
  const history = useHistory();
  const filterResults = true;

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  // const finishHandler = (table_id) => (event) => {
  //   event.preventDefault();
  //   const result = window.confirm(
  //     "Is this table ready to seat new guests? This cannot be undone."
  //   );

  //   if (result) {
  //     finishTable(table_id)
  //     .then(() => loadDashboard())
  //     .catch(setError);
  //   }
  // }

  function onFinish(table_id, reservation_id) {
    finishTable(table_id, reservation_id)
    .then(loadDashboard)
    .catch(setTablesError);
  }

  const cancelHandler = async (event) => {
    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (result) {
      await updateStatus(event.target.value, "cancelled");
      loadDashboard();
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      <div>
        <h2>
          Reservations for {moment(date).format("dddd MMM DD YYYY")}
        </h2>
      </div>
      <div>
        <button onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>
          Previous
        </button>
        <button onClick={() => history.push(`/dashboard?date=${today()}`)}>
          Today
        </button>
        <button onClick={() => history.push(`/dashboard?date=${next(date)}`)}>
          Next
        </button>
      </div>
      <hr></hr>
      <div id="reservations">
        <ReservationList
          reservations={reservations}
          filterResults={filterResults}
          cancelHandler={cancelHandler}
        />
      </div>
      <div>
        <h2>Tables</h2>
        <hr></hr>
        <ErrorAlert error={tablesError} />
        <TableList
          tables={tables}
          onFinish={onFinish} />
      </div>
    </>
  );
}

export default Dashboard;
