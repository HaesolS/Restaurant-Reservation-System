import React from "react";

export const ReservationList = ({
    reservations,
    cancelHandler,
    filterResults,
  }) => {
    function checkStatus(reservation) {
        return (
          reservation.status === "finished" || reservation.status === "cancelled"
        );
      }
      function formatTime(time) {
        let hours = Number(time.split(":")[0]);
        let minutes = Number(time.split(":")[1]);
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedTime = hours + ":" + minutes + " " + ampm;
        return formattedTime;
      }
      function renderReservations(reservations) {
        if (reservations.length) {
          return reservations.map((reservation) => {
            return filterResults && checkStatus(reservation) ? (
              null
            ) : (
              <div className="reservation" key={reservation.reservation_id}>
                <h4>{reservation.first_name} {reservation.last_name}</h4>
                    <p>Party of {reservation.people}</p>
                <h5>{formatTime(reservation.reservation_time)}</h5>
                    <p>&nbsp; / &nbsp;mobile : {reservation.mobile_number}</p>
                    <p data-reservation-id-status={reservation.reservation_id}>
                        &nbsp; / &nbsp;<i>{reservation.status}</i>
                    </p>
                <div>
                    {reservation.status === "booked" ? (
                    <>
                    <a href={`/reservations/${reservation.reservation_id}/seat`}>
                    <button>
                        Seat
                    </button>
                    </a>
                    <a href={`/reservations/${reservation.reservation_id}/edit`}>
                    <button>
                        Edit
                    </button>
                    </a>
                    <button
                        type="button"
                        data-reservation-id-cancel={reservation.reservation_id}
                        value={reservation.reservation_id}
                        onClick={cancelHandler}
                    >
                        Cancel
                    </button>
                    </>
                    ) : null}
                </div>
            </div>
            );
          });
        } else {
          return (
            <div>
              <h4>No reservations found</h4>
            </div>
          );
        }
      }
    
      return <div>{renderReservations(reservations)}</div>;
    };

export default ReservationList;