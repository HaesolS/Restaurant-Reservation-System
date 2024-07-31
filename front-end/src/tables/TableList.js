import React from "react";

export const TableList = ({ tables, onFinish }) => {

  function finishHandler({
    target: {dataset: {tableIdFinish, reservationIdFinish}} = {},
  }) {

    const result = window.confirm(
      "Is this table ready to seat new guests?\n\nThis cannot be undone."
    );

    if (
      tableIdFinish &&
      reservationIdFinish &&
      result
    ) {
      onFinish(tableIdFinish, reservationIdFinish);
    }
  }

  return (
    <div>
      {tables.map((table) => (
        <div className="table" key={table.table_id}>
          <h3>Table {table.table_name}</h3>
          <h5>{table.capacity} seats </h5>
          <p data-table-id-status={table.table_id}>
            &nbsp;/ &nbsp;{table.reservation_id ? "occupied" : "free"}
          </p>
            <div>
              {table.reservation_id ? (
                <button
                  type="button"
                  className="finish"
                  data-table-id-finish={table.table_id}
                  data-reservation-id-finish={table.reservation_id}
                  onClick={finishHandler}
                >
                  Finish
                </button>
              ) : (
                ""
              )}
            </div>
        </div>
      ))}
    </div>
  );
};

export default TableList;