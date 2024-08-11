import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ProductForm from "./ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduits, postProduit } from "../features/products/products";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const columns = [
  { field: "autoId", headerName: "ID", width: 70, hide: true },
  { field: "id", headerName: "ID Produit", width: 250, hide: true },
  { field: "name", headerName: "Nom", width: 200 },
  { field: "price", headerName: "Prix", width: 200 },
  { field: "quantity", headerName: "Stock disponible", width: 200 },
  { field: "actions", headerName: "Actions", width: 150, renderCell: () => <button>Action</button> },
];

const ProductList = () => {
  const { product } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduits());
  }, [dispatch]);

  const rows = product.map((p, index) => ({
    id: p.id || `row-${index + 1}`,
    autoId: index + 1,
    name: p.nom_produit,
    price: p.prix_par_unite ? `${parseFloat(p.prix_par_unite).toFixed(2)} €` : "Non spécifié",
    quantity: p.quantite_en_stock || 0,
  }));

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const visibleColumns = columns.filter(column => column.field !== "autoId" && column.field !== "id");


  return (
    <div className="w-[100%] px-8 mt-28 flex flex-col gap-5">
       <ToastContainer />
      <DataGrid
        rows={rows}
        columns={visibleColumns}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
      <div className="flex justify-end">
        <button
          className="text-center font-semibold text-base bg-customBlue px-20 text-white py-2 rounded"
          onClick={handleOpen}
        >
          AJOUTER LE PRODUIT
        </button>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] w-[400px] bg-white p-4 rounded-lg">
          <div className="flex justify-end">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <ProductForm onClose={handleClose} /> {/* Passer handleClose comme prop onClose */}
        </Box>
      </Modal>
    </div>
  );
};

export default ProductList;
