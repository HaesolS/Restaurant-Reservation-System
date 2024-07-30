import React from "react";

export const TableList = ({ tables, finishHandler }) => {
  return (
    <div>
      {tables.map((table) => (
        <div className="table" key={table.table_id}>
          <h3>Table {table.table_name}</h3>
          <h5>{table.capacity} seats </h5>
          <p data-table-id-status={table.table_id}>
            &nbsp;/ &nbsp;{table.occupied ? "occupied" : "free"}
          </p>
            <div>
              {table.occupied ? (
                <button
                  className="finish"
                  data-table-id-finish={table.table_id}
                  onClick={() => finishHandler(table.table_id)}>
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