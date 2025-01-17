export function ValidReservation(reservation) {
    const date = reservation.reservation_date;
    const time = reservation.reservation_time;
    const errors = [];

    const day = new Date(date).getUTCDay();
    if (day === 2) {
        errors.push(new Error("Restaurant is closed on Tuesdays."));
    }
    
    const formattedDate = new Date(`${date}T${time}`);
    if (formattedDate <= new Date()) {
        errors.push(new Error("Only future reservations are allowed."));
    }

    const hours = Number(time.split(":")[0]);
    const minutes = Number(time.split(":")[1]);
    if (hours < 10 || (hours === 10 && minutes < 30)) {
      errors.push(new Error("Reservation time must be after 10:30 AM."));
    }
    if (hours > 21 || (hours === 21 && minutes > 30)) {
      errors.push(new Error("Reservation time must be before 9:30 PM."));
    }

    return errors;
}