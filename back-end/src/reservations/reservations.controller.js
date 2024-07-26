const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

/**
 * Validation middleware
 */

// function hasProperties(req, res, next) {
//   if (!req.body.data) {
//     return next({
//       status: 400,
//       message: "data is missing."
//     });
//   }
//   const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = req.body.data;
//   if (!first_name) {
//     return next({
//       status: 400,
//       message: "first_name is missing."
//     });
//   }
//   if (!last_name) {
//     return next({
//       status: 400,
//       message: "last_name is missing."
//     })
//   }
//   if (!mobile_number) {
//     return next({
//       status: 400,
//       message: "mobile_number is missing."
//     });
//   }
//   if (!reservation_date) {
//     return next({
//       status: 400,
//       message: "reservation_date is missing."
//     });
//   }
//   if (!reservation_time) {
//     return next({
//       status: 400,
//       message: "reservation_time is missing."
//     });
//   }
//   if (!people) {
//     return next({
//       status: 400,
//       message: "people is missing."
//     })
//   }
//   next({
//     status: 201
//   });
// }

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);


function validDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const reservationDate = new Date(
      `${reservation_date}T${reservation_time}:00Z`
  );
  res.locals.time = reservationDate;
  const today = new Date();
  if (isNaN(reservationDate.getDate())) {
      next({
          message: `reservation_date / reservation_time incorrect`,
          status: 400,
      });
  }

  if (reservationDate.getUTCDay() == 2) {
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
  const { status } = req.body.data;
  if (status !== 'seated' && status !== 'finished') {
    return next();
  }
  next({
    status: 400,
    message: "status cannot be seated or finished.",
  })
}

function reservationExists(req, res, next) {
  const { reservation_id } = req.params
  const reservation = service.read(reservation_id);
  res.locals.reservation = reservation;
  if (!reservation) {
    next({
      status: 404,
      message: `Reservation ${reservation_id} not found.`
    });
  }
  next();
}

/**
 * List handler for reservation resources
 */

// async function list(req, res) {
//   const { date } = req.query;
//   if (date) {
//     const data = await service.list(date)
//   res.json({ data });
//   } else {
//     const data = await service.list();
//     res.json({ data })
//   }
// }

async function list(req, res) {
  const data = await (req.query.mobile_number
    ? service.listByNumber(req.query.mobile_number)
    : service.list(req.query.date));

  res.json({
    data,
  });
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
  const updated = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updated);
  res.status(200).json({ data });
}

async function updateStatus(req, res) {
  const { status } = res.locals;
  const { reservation_id } = res.locals.reservation;
  const data = await service.updateStatus(reservation_id,
    res.status(200).json({ data }));
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)],
  create: [
    hasRequiredProperties,
    validDate, validTime, validPeople, // validStatus,
    asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    validDate, validTime, validPeople, validStatus,
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    asyncErrorBoundary(updateStatus)
  ]
};
