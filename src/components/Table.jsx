import React from 'react'
import { DataGrid } from "@mui/x-data-grid";

const Table = ({ columns, rows, isMobile }) => {
  // Appel de la fonction columns avec les paramètres nécessaires
  const columnsToDisplay = columns(isMobile);

  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columnsToDisplay}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  )
}

export default Table
