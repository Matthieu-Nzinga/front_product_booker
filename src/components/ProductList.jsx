import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, Grid, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProductForm from "./ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, getAllProduits } from "../features/products/products";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";
import { useMediaQuery } from '@mui/material';

const columns = (isMobile, handleViewDetails) => [
  { field: "name", headerName: "Nom", width: isMobile ? 100 : 300 },
  { field: "price", headerName: "Prix", width: isMobile ? 100 : 300 },
  { field: "quantity", headerName: "Stock disponible", width: isMobile ? 100 : 300 },
  {
    field: "actions",
    headerName: "Actions",
    width: isMobile ? 100 : 200,
    renderCell: (params) => (
      <IconButton onClick={() => handleViewDetails(params.row)}>
        <VisibilityIcon />
      </IconButton>
    ),
  },
];

const ProductList = () => {
  const { product, categories } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    dispatch(getAllProduits());
    dispatch(getAllCategories());
  }, [dispatch]);
  const rows = product.map((p, index) => ({
    id: p?.id || `row-${index + 1}`,
    autoId: index + 1,
    name: p?.nom_produit,
    price: p?.prix_par_unite ? `${parseFloat(p.prix_par_unite).toFixed(2)} €` : "Non spécifié",
    quantity: p?.quantite_en_stock || 0,
    urlsPhotos: p?.urlsPhotos || [],  // Ajout des URLs des photos
  }));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setActivePhotoIndex(0); // Affiche la première photo par défaut
    setViewDetailsOpen(true);
  };

  const handleViewDetailsClose = () => {
    setViewDetailsOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="px-8 mt-28 flex flex-col gap-5 sm:pr-9">
      <ToastContainer />
      <h2 className="font-black text-3xl block md:hidden">Les produits</h2>
      <Table columns={(isMobile) => columns(isMobile, handleViewDetails)} rows={rows} isMobile={isMobile} />
      <div className="flex justify-end">
        <button
          className="text-center font-semibold text-base bg-customBlue px-[93px] text-white py-2 rounded"
          onClick={handleOpen}
        >
          AJOUTER LE PRODUIT
        </button>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white p-4 rounded-lg shadow-lg ${
            isMobile ? 'w-[90vw]' : isTablet ? 'w-[70vw]' : 'w-[400px]'
          }`}
        >
          <div className="flex justify-end">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <ProductForm onClose={handleClose} category={categories} />
        </Box>
      </Modal>

      <Modal open={viewDetailsOpen} onClose={handleViewDetailsClose}>
        <Box
          className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white p-4 rounded-lg`}
          sx={{
            width: isMobile ? '90vw' : '400px',
            maxHeight: isMobile ? '80vh' : '80vh', // Limiter la hauteur pour le scroll
            overflowY: 'auto', // Activer le défilement vertical
          }}
        >
          <div className="flex justify-end">
            <IconButton onClick={handleViewDetailsClose}>
              <CloseIcon />
            </IconButton>
          </div>
          {selectedProduct && (
            <div>
              <Typography variant="h6" className="text-2xl font-semibold">
                {selectedProduct.name}
              </Typography>
              <Typography variant="subtitle1" className="text-lg font-medium">
                Prix: {selectedProduct.price}
              </Typography>
              <Typography variant="subtitle1" className="text-lg font-medium">
                Stock: {selectedProduct.quantity}
              </Typography>
              <div className="flex gap-2 overflow-x-auto mt-4">
                {selectedProduct.urlsPhotos.map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => setActivePhotoIndex(index)}
                    variant={activePhotoIndex === index ? "contained" : "outlined"}
                  >
                    Photo {index + 1}
                  </Button>
                ))}
              </div>
              <div className="mt-4">
                <img
                  src={selectedProduct.urlsPhotos[activePhotoIndex]}
                  alt={`product-${activePhotoIndex}`}
                  className="w-full h-auto object-cover rounded"
                />
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ProductList;
