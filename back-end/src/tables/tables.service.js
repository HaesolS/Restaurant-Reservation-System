const knex = require("../db/connection.js");

function list() {
    return knex("tables")
    .select("*")
    .orderBy("table_name");
}
  
function create(table) {
    return knex("tables")
      .insert(table)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
}
  
async function update(reservation_id, table_id) {
    const trx = await knex.transaction();
    return trx("reservations")
        .where({ reservation_id })
        .update({ status: "seated" })
        .then(() =>
            trx("tables")
            .where({ table_id })
            .update({ reservation_id: reservation_id, table_status: "occupied" }, "*")
        )
        .then(trx.commit)
        .catch(trx.rollback);
}

async function destroy(reservation_id, table_id) {
    const trx = await knex.transaction();
    return trx("reservations")
        .where({ reservation_id })
        .update({ status: "finished" })
        .then(() =>
            trx("tables")
            .where({ table_id })
            .update({ reservation_id: null, table_status: "free" }, "*")
        )
        .then(trx.commit)
        .catch(trx.rollback)
}

function readReservation(reservation_id) {
    return knex("reservations as r")
    .select("*")
    .where({ reservation_id })
    .first();
}

function read(table_id) {
    return knex("tables")
    .select("*")
    .where({ table_id })
    .first();
}
  
module.exports = {
    list,
    create,
    update,
    destroy,
    readReservation,
    read,
  };