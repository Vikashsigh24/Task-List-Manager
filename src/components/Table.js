import React, { useEffect, useRef } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';

const getTaskCounts = (tasks) => {
  const counts = { todo: 0, inProgress: 0, done: 0 };
  tasks.forEach((task) => {
    if (task.status === 'To Do') counts.todo++;
    else if (task.status === 'In Progress') counts.inProgress++;
    else if (task.status === 'Done') counts.done++;
  });
  return counts;
};

const Table = ({ tasks = [], deleteTask, editTask }) => {
  const tableRef = useRef(null);
  const tableInstance = useRef(null);
  const counts = getTaskCounts(tasks);

  useEffect(() => {
    if (!tableRef.current) return;

    // Destroy any existing table instance
    if (tableInstance.current) {
      tableInstance.current.destroy();
      tableInstance.current = null;
    }

    // Initialize Tabulator
    tableInstance.current = new Tabulator(tableRef.current, {
      data: tasks, // Initialize with task data
      layout: 'fitDataFill',
      columns: [
        { title: 'Task ID', field: 'id', width: 80 },
        { title: 'Title', field: 'title', editor: 'input' },
        { title: 'Description', field: 'description', editor: 'input' },
        {
          title: 'Status',
          field: 'status',
          editor: 'list', // Use `list` instead of `select`
          editorParams: {
            values: ['To Do', 'In Progress', 'Done'],
          },
          cellEdited: (cell) => {
            const rowData = cell.getRow().getData();
            editTask(rowData); // Trigger the editTask function when the cell is edited
          },
        },
        {
          title: 'Actions',
          formatter: () => '<button class="delete-btn">Delete</button>',
          cellClick: (e, cell) => {
            const rowData = cell.getRow().getData();
            deleteTask(rowData.id);
          },
        },
      ],
    });

    return () => {
      tableInstance.current?.destroy();
    };
  }, [tasks, deleteTask, editTask]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '10px',
          fontWeight: 'bold',
        }}
      >
        <span>To Do: {counts.todo}</span>
        <span>In Progress: {counts.inProgress}</span>
        <span>Done: {counts.done}</span>
      </div>
      <div ref={tableRef} style={{ height: '400px' }}></div>
    </div>
  );
};

export default Table;
