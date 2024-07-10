const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * Validation middleware
 */

/* 
function validDate(req, res, next) {
  const { data = {} } = req.body;
  const reservationDate = new Date(data["reservation_date"]);
  const currentDate = new Date();
  if (isNaN(reservationDate)) {
    return next({
      status: 400,
      message: "Invalid reservation date."
    })
  }
  if (reservationDate < currentDate) {
    return next({
      status: 400,
      message: "Reservation date must be in the future."
    })
  }
  next();
}*/

/* REGEX DOESN'T WORK?
function validTime(req, res, next) {
  const { data = {} } = req.body;
  const reservationTime = data["reservation_time"];
  const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/;
  if (!regex.test(reservationTime)) {
    next({
      status: 400,
      message: "Invalid reservation time."
    })
  }
  next();
} */

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  if (date) {
    const data = await service.list(date)
  res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data })
  }
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data: data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    //validDate, validTime,
    asyncErrorBoundary(create)
  ]
};
