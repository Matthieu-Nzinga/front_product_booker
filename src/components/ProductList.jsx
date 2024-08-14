import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ProductForm from "./ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, getAllProduits } from "../features/products/products";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";
import { useMediaQuery } from '@mui/material';

const columns = (isMobile) => [
  { field: "name", headerName: "Nom", width: isMobile ? 100 : 300 },
  { field: "price", headerName: "Prix", width: isMobile ? 100 : 300 },
  { field: "quantity", headerName: "Stock disponible", width: isMobile ? 100 : 300 },
  { field: "actions", headerName: "Actions", width: isMobile ? 100 : 200, renderCell: () => <button className="">Action</button> },
];

const ProductList = () => {
  const { product, categories } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduits());
    dispatch(getAllCategories());
  }, []);

  
  const rows = product.map((p, index) => ({
    id: p?.id || `row-${index + 1}`,
    autoId: index + 1,
    name: p?.nom_produit,
    price: p?.prix_par_unite ? `${parseFloat(p.prix_par_unite).toFixed(2)} €` : "Non spécifié",
    quantity: p?.quantite_en_stock || 0,
  }));

  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="px-8 mt-28 flex flex-col gap-5  sm:pr-9">
      <ToastContainer />
      <h2 className='font-black text-3xl block md:hidden'>Les produits</h2>
      <Table columns={columns} rows={rows} isMobile={isMobile} />
      <div className="flex justify-end">
        <button
          className="text-center font-semibold text-base bg-customBlue px-[93px] text-white py-2 rounded"
          onClick={handleOpen}
        >
          AJOUTER LE PRODUIT
        </button>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] ${isMobile ? 'w-[90vw]' : 'w-[400px]'} bg-white p-4 rounded-lg`}>
          <div className="flex justify-end">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <ProductForm onClose={handleClose} category={categories} />
        </Box>
      </Modal>
    </div>
  );
};

export default ProductList;
