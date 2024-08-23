import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, Typography, Button, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ProductForm from "./ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, getAllCommands, getAllProduits, hideProduct } from "../features/products/products";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";
import { useMediaQuery } from '@mui/material';

const columns = (isMobile, handleViewDetails, handleDisableProduct) => [
  { field: "name", headerName: "Nom", width: isMobile ? 100 : 300 },
  { field: "price", headerName: "Prix", width: isMobile ? 100 : 300 },
  { field: "quantity", headerName: "Stock disponible", width: isMobile ? 100 : 300 },
  { field: "orderedQuantity", headerName: "Quantité commandée", width: isMobile ? 100 : 300 },
  {
    field: "actions",
    headerName: "Visualiser",
    width: isMobile ? 200 : 300,
    renderCell: (params) => (
      <div>
        <IconButton onClick={() => handleViewDetails(params.row)}>
          <VisibilityIcon />
        </IconButton>
        <Tooltip title="Désactiver le produit" arrow>
          <IconButton
            onClick={() => handleDisableProduct(params.row.id)}
            color="error"
          >
            <DisabledByDefaultIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
];

const ProductList = () => {
  const { product, categories, commands } = useSelector((state) => state.products);
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
    dispatch(getAllCommands());
  }, [dispatch]);

  const calculateOrderedQuantity = (productId) => {
    return commands.reduce((total, command) => {
      if (command.status === 'En attente') {
        const reservedProduct = command.reservations.find(reservation => reservation.produitId === productId);
        return total + (reservedProduct ? reservedProduct.quantite_commande : 0);
      }
      return total;
    }, 0);
  };

  const rows = product.map((p, index) => ({
    id: p?.id || `row-${index + 1}`,
    autoId: index + 1,
    name: p?.nom_produit,
    price: p?.prix_par_unite ? `${parseFloat(p.prix_par_unite).toFixed(2)} €` : "Non spécifié",
    quantity: p?.quantite_en_stock || 0,
    orderedQuantity: calculateOrderedQuantity(p.id),
    urlsPhotos: p?.urlsPhotos || [],
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

  const handleDisableProduct = async (productId) => {
    try {
      await dispatch(hideProduct(productId));
      toast.success("Produit désactivé avec succès");
      dispatch(getAllProduits());
    } catch (error) {
      toast.error("Échec de la désactivation du produit");
    }
  };

  return (
    <div className="px-8 mt-28 flex flex-col gap-5 sm:pr-9">
      <ToastContainer />
      <h2 className="font-black text-3xl block md:hidden">Les produits</h2>
      <Table
        columns={(isMobile) => columns(isMobile, handleViewDetails, handleDisableProduct)}
        rows={rows}
        isMobile={isMobile}
        sx={{
          '& .MuiDataGrid-cell': {
            padding: '4px 8px', // Réduit le padding des cellules
          },
          '& .MuiDataGrid-columnHeaders': {
            padding: '8px', // Ajuste le padding des en-têtes de colonnes
            textAlign: 'center', // Centre le texte des en-têtes de colonnes
          },
          '& .MuiDataGrid-footer': {
            padding: '8px', // Ajuste le padding du pied de page
          },
        }}
      />
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
            maxHeight: isMobile ? '80vh' : '80vh',
            overflowY: 'auto',
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
