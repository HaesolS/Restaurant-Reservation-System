const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// Validation middleware

// function hasProperties(req, res, next) {
//   if (!req.body.data) {
//     return next({
//       status: 400,
//       message: "data is missing."
//     });
//   }
//   const { table_name, capacity } = req.body.data;
//   if (!table_name) {
//     return next({
//       status: 400,
//       message: "table_name is missing."
//     });
//   }
//   if (!capacity) {
//     return next({
//         status: 400,
//         message: "capacity is missing."
//     });
//   }
//   next({
//       status: 201
//     });
// }

const hasRequiredProperties = hasProperties(
  "table_name",
  "capacity"
);

function validTableName(req, res, next) {
  const table_name = req.body.data.table_name;
  if (table_name.length <= 1) {
    return next({
      status: 400,
      message: `table_name must be at least 2 characters long.`,
    });
  }
  next();
}

function validCapacity(req, res, next) {
  if (req.body.data.capacity < 1) {
    return next({
      status: 400,
      message: "capacity must be at least 1 person."
    });
  }
  next();
}

function validTableCapacity(req, res, next) {
  const tableCapacity = res.locals.table.capacity;
  const guests = res.locals.reservation.people;
  if ( tableCapacity < guests ) {
    next({
      status: 400,
      message: `Too many guests ( ${guests} ) for table size. Please choose table with capacity.`,
    });
  } else {
    next();
  }
}

function capacityIsNumber(req, res, next) {
  if (!Number.isInteger(res.locals.table.capacity)) {
    return next({
      status: 400,
      message: "capacity is not a number."
    })
  }
  next();
}

function validTable(req, res, next) {
  const occupied = res.locals.table.occupied;
  const status = res.locals.reservation.status;
  if (occupied || status === "seated") {
    return next({
    status: 400,
    message: "table is occupied."
  });
}
  next();
}

async function tableExists(req, res, next) {
  const table_id = req.params.table_id;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 400,
    message: `Table ${table_id} does not exist.`
  });
}

async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(req.body.data.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation_id ${req.body.data.reservation_id} does not exist`,
  });
}

function isOccupied(req, res, next) {
  if (res.locals.table.reservation_id) {
    next();
  } else {
    next({
      status: 400,
      message: `Table is not occupied`,
    });
  }
}

// CRUD

async function list(req, res) {
  const data = await service.list();
  // status?
  res.status(200).json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const data = await service.update(req.body.data.reservation_id, res.locals.table.table_id);
  res.status(200).json({ data });
}

async function destroy(req, res) {
  const data = await service.destroy(res.locals.table.reservation_id, res.locals.table.table_id);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
      validTableName, validCapacity, validTableCapacity, capacityIsNumber,
      asyncErrorBoundary(create)
  ],
  update: [
  hasRequiredProperties,
    tableExists,
    reservationExists,
  //  validCapacity, validTable, validTableCapacity, capacityIsNumber,
    isOccupied,
    asyncErrorBoundary(update)
  ],
  delete: [
    tableExists,
    validTable,
    asyncErrorBoundary(destroy)
  ]
}