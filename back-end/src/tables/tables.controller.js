const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties(
  "table_name",
  "capacity"
);
const hasReservationId = hasProperties(
  "reservation_id"
);

function validTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    next({
      status: 400,
      message: `table_name must be at least 2 characters long.`,
    });
  }
  next();
}

function validCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (capacity < 1 || typeof capacity !== "number") {
    next({
      status: 400,
      message: "capacity must be at least 1 person."
    });
  }
  next();
}

function validTableCapacity(req, res, next) {
  const tableCapacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;
  if ( tableCapacity < people ) {
    return next({
      status: 400,
      message: "too many people for table capacity."
    });
  }
    next();
}

async function validStatus(req, res, next) {
  const status = res.locals.reservation.status;
  if (status && status === "seated") {
    return next({
      status: 400,
      message: "table is already seated."
    });
  }
  next();
}

function isNotOccupied(req, res, next) {
  const reservation_id = res.locals.table.reservation_id;
  if (reservation_id) {
    return next({
      status: 400,
      message: "table is already occupied."
    });
  }
  next();
}

function isOccupied(req, res, next) {
  const reservation_id = res.locals.table.reservation_id;
  if (!reservation_id) {
    return next({
      status: 400,
      message: "table is not occupied."
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
    status: 404,
    message: `table ${table_id} does not exist.`
  });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await service.readReservation(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation_id ${reservation_id} does not exist`,
  })
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "must have data "
  })
}

async function getReservation(req, res, next) {
  const reservation_id = res.locals.table.reservation_id;
  const reservation = await service.readReservation(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation ${reservation_id} not found.`
  });
}

// CRUD

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  }
  const data = await service.update(updatedTable, updatedReservation);
  res.json({ data });
}

async function destroy(req, res) {
  const table = res.locals.table;
  const updatedTable = {
    ...table,
    reservation_id: null,
  };
  const updatedReservation = {
    ...res.locals.reservation,
    reservation_id: res.locals.reservation.reservation_id,
    status: "finished",
  }
  const data = await service.update(updatedTable, updatedReservation);
  res.json({ data });
}

function read(req, res) {
  const data = res.locals.table;
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
      hasData,
      hasRequiredProperties,
      validTableName, validCapacity,
      asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(tableExists),
    hasData,
    hasProperties("reservation_id"),
    asyncErrorBoundary(reservationExists),
    validTableCapacity, validStatus,
    isNotOccupied,
    asyncErrorBoundary(update)
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    isOccupied,
    asyncErrorBoundary(getReservation),
    asyncErrorBoundary(destroy)
  ],
  read: [
    asyncErrorBoundary(tableExists),
    read
  ],
  list: [asyncErrorBoundary(list)]
}