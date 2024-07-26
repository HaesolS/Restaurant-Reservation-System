import React, { useState } from "react";
import { finishTable, listTables, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

function TableList({ table }) {
    const [currentTable, setCurrentTable] = useState(table);
    const [error, setError] = useState(null);
    const history = useHistory();

    async function finishedTable() {
        const abortController = new AbortController();
        try {
            const response = await finishTable(currentTable.table_id, abortController.signal);
            const newTable = response.find((table) => table.table_id === currentTable.table_id);
            setCurrentTable({ ...newTable })
            listTables()
            return newTable;
        } catch (error) {
            setError(error);
        }
    }

    async function finishHandler(event) {
        const abortController = new AbortController();
        event.preventDefault();
        setError(null);
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
            await updateStatus({ status: "finished" }, currentTable.reservation_id, abortController.signal);
            await finishedTable();
            history.push("/tables");
            return;
        }
    }

    return (
        <>
        <ErrorAlert error={error} />
        <tr>
            <th> {currentTable.table_id} </th>
            <td> {currentTable.table_name}</td>
            <td> {currentTable.capacity}</td>
            <td> {currentTable.reservation_id}</td>
            <td data-table-id-status={`${table.table_id}`}> {currentTable.table_status} </td>
            <td>
                {currentTable.reservation_id ?
                <button onClick={finishHandler} data-table-id-finish={`${table.table_id}`}>
                    Finish
                </button>
                :
                <></>
                }
            </td>
        </tr>
        </>
    );
}

export default TableList;