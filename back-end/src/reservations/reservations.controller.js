const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "must have data"
  });
}

function validDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const reservationDate = new Date(
      `${reservation_date}T${reservation_time}:00Z`
  );
  res.locals.time = reservationDate;
  const today = new Date();
  if (!reservation_date || reservationDate == "Invalid Date") {
      next({
          message: `reservation_date / reservation_time incorrect`,
          status: 400,
      });
  }
  if (reservationDate.getUTCDay() === 2) {
      next({
          message: "Restaurant is closed on tuesdays",
          status: 400,
      });
  }
  if (reservationDate < today) {
      next({
          message: "Reservation needs to be in the future",
          status: 400,
      });
  }
  next();
}

function validTime(req, res, next) {
  let hours = res.locals.time.getUTCHours();
    let minutes = res.locals.time.getUTCMinutes();
    if (
        hours < 10 ||
        (hours == 10 && minutes < 30) ||
        hours > 21 ||
        (hours == 21 && minutes > 30)
    ) {
        next({
            message: "Please select a time between 10:30 and 21:30",
            status: 400,
        });
    }
    next();
}

function validPeople(req, res, next) {
  let { people } = req.body.data;
  if (typeof people !== "number" || people < 1) {
      next({
          message: "people has to be a number above zero",
          status: 400,
      });
  }
  next();
}

function validStatus(req, res, next) {
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (status && !validStatus.includes(status)) {
    next({ 
      status: 400, 
      message: `invalid status: '${status}.'`
    });
  } else {
    next();
  }
}

function defaultBooked(req, res, next) {
  const { status } = req.body.data;
  if (status && status !== "booked") {
    next({
      status: 400,
      message: `new reservation can't have ${status} status`
    });
  }
  next();
}

function hasReservationId(req, res, next) {
  const reservation = req.params.reservation_id || req.body?.data?.reservation_id;

  if(reservation){
      res.locals.reservation_id = reservation;
      next();
  } else {
      next({
          status: 400,
          message: `missing reservation_id`,
      });
  }
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation ${reservation_id} does not exist`,
  });
}

function isFinished(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "finished") {
    next({
      status: 400,
      message: "finished reservation can't be updated"
    });
  }
  next();
}

function validMobile(req, res, next) {
  let { mobile_number } = req.body.data;
  const remove = mobile_number.replace(/\D/g, '');
  const number = Number(remove);
  console.log("mobile_numberrr", number, typeof number)
  if (isNaN(number)) {
      next({
          message: "mobile_number has to be a number",
          status: 400,
      });
  }
  next();
}

/**
 * List handler for reservation resources
 */

async function list(req, res) {
   const today = new Date();
  if (req.query.date) {
    const data = await service.list(req.query.date);
    res.json({ data });
  } else if (req.query.mobile_number) {
    const data = await service.search(req.query.mobile_number);
    res.json({ data });
  } else {
    const data = await service.list(today);
    res.json({ data });
  }
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data: data });
}

async function update(req, res) {
  const reservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(reservation);
  res.json({ data });
}

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const data = await service.updateStatus(reservation_id);
    res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  create: [
    hasData,
    hasRequiredProperties,
    validDate, validTime, validPeople, validMobile,
    defaultBooked,
    asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasData,
    hasRequiredProperties,
    validDate, validTime, validPeople, validMobile,
    defaultBooked,
    hasReservationId,
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    hasData,
    asyncErrorBoundary(reservationExists),
    validStatus,
    isFinished,
    asyncErrorBoundary(update)
  ]
};
