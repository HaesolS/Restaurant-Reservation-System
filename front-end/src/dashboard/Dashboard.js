import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory, useLocation } from "react-router-dom";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState(date);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const searchedDate = location.search.slice(-10);

  function clearTables(tables) {
    let result = [];
    tables.forEach((table) => {
      if (table.reservation_id) {
        result.push(table);
      }
    })
    return result;
  }
  let clearTableToggler = clearTables(tables);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadReservations() {
      try {
        if (currentDate === date) {
          const returnedReservations = await listReservations({ date }, abortController.signal);
          setReservations(returnedReservations);
        } else {
          const returnedReservations = await listReservations({ currentDate }, abortController.signal);
          setReservations(returnedReservations);
        }
      } catch (error) {
        setError(error);
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [date, currentDate, history.location])

  useEffect(() => {
    const abortController = new AbortController();
    async function loadTables() {
      try {
        const returnedTables = await listTables();
        setTables(returnedTables);
      } catch (error) {
        setError(error);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, [history, date, currentDate])

  useEffect(() => {
    if (searchedDate && searchedDate !== '') {
      setCurrentDate(searchedDate);
    }
  }, [searchedDate, history]);

  if (reservations) {

    return (
      <>
        <h1>Dashboard</h1>
        <ErrorAlert error={error} />
        <div>
          <h2>Reservations for {currentDate}</h2>
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
          <div id="reservations">
            <table>
              <thead>
                <tr>
                  <th> ID </th>
                  <th> First Name </th>
                  <th> Last Name </th>
                  <th> Number of People </th>
                  <th> Mobile Number </th>
                  <th> Date </th>
                  <th> Time </th>
                  <th> Status </th>
                  <th> Seat </th>
                  <th> Edit </th>
                  <th> Cancel </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <ReservationList res={res} key={res.reservation_id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div id="tables">
          <h2>Tables</h2>
          <table>
            <thead>
              <tr>
                <th> ID </th>
                <th> Table Name </th>
                <th> Capacity </th>
                <th> Reservation ID </th>
                <th> Table Status </th>
                {clearTableToggler.length ?
                <th> Clear Tables </th>
                :
                <></>}
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <TableList table={table} key={table.table_id} />
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
} else {
  return (
    <div>
    <h4> Loading... </h4>
    </div>
  )
  }
}

export default Dashboard;
