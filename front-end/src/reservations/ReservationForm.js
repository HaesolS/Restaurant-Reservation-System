import React from "react";
import { useHistory } from "react-router-dom";

export const ReservationForm = ({
    reservation,
    changeHandler,
    submitHandler
}) => {
  const history = useHistory();

  return (
    <>
      <form onSubmit={submitHandler}>
        <fieldset>
            <div>
                <label htmlFor="first_name">
                    First Name
                </label>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    required
                    value={reservation.first_name}
                    onChange={changeHandler}
                />
            </div>
            <div>
            <label htmlFor="last_name">Last Name</label>
            <input
                type="text"
                id="last_name"
                name="last_name"
                required
                value={reservation.last_name}
                onChange={changeHandler}
            />
            </div>
            <div>
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
                type="tel"
                id="mobile_number"
                name="mobile_number"
                placeholder="xxx-xxx-xxxx"
                required
                value={reservation.mobile_number}
                onChange={changeHandler}
            />
            </div>
            <div>
            <label htmlFor="reservation_date">Date of Reservation</label>
            <input
                type="date"
                id="reservation_date"
                name="reservation_date"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                required
                value={reservation.reservation_date}
                onChange={changeHandler}
            />
            </div>
            <div>
            <label htmlFor="reservation_time">Time of Reservation</label>
            <input
                type="time"
                id="reservation_time"
                name="reservation_time"
                placeholder="HH:MM"
                pattern="[0-9]{2}:[0-9]{2}"
                required
                value={reservation.reservation_time}
                maxLength="100"
                onChange={changeHandler}
            />
            </div>
            <div>
            <label htmlFor="people">Number of people</label>
            <input
                type="number"
                id="people"
                name="people"
                required
                value={reservation.people}
                min={1}
                onChange={changeHandler}
            />
            </div>
            <div>
            <button type="submit">
                Submit
            </button>
            <button type="button" onClick={() => history.goBack()}>
                Cancel
            </button>
            </div>
        </fieldset>
    </form>
    </>
  );
};

export default ReservationForm;