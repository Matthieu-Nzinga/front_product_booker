import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, Typography, Button, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Nouvelle icône
import EditIcon from "@mui/icons-material/Edit";
import ProductForm from "./ProductForm";
import ProductEditForm from "./ProductEditForm";
import { useDispatch, useSelector } from "react-redux";
import { activateProduct, getAllCategories, getAllCommands, getAllProduits, hideProduct } from "../features/products/products";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";
import { useMediaQuery } from '@mui/material';

const columns = (isMobile, handleViewDetails, handleDisableProduct, handleActivateProduct, handleEditProduct) => [
  { field: "name", headerName: "Nom", width: isMobile ? 100 : 300 },
  { field: "price", headerName: "Prix", width: isMobile ? 100 : 300 },
  { field: "quantity", headerName: "Stock disponible", width: isMobile ? 100 : 300 },
  { field: "orderedQuantity", headerName: "Quantité commandée", width: isMobile ? 100 : 300 },
  {
    field: "visualisation",
    headerName: "Visualiser",
    width: isMobile ? 250 : 300,
    renderCell: (params) => (
      <div>
        <Tooltip title="Détails du produit">
          <IconButton onClick={() => handleViewDetails(params.row)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Modifier le produit">
          <IconButton onClick={() => handleEditProduct(params.row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        {params.row.statut ? (
          <Tooltip title="Désactiver le produit" arrow>
            <IconButton
              onClick={() => handleDisableProduct(params.row.id)}
              color="error"
            >
              <DisabledByDefaultIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Activer le produit" arrow>
            <IconButton
              onClick={() => handleActivateProduct(params.row.id)}
              color="success"
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
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
  const [editOpen, setEditOpen] = useState(false); // Ajout de l'état pour le modal d'édition
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
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

  const sortedProducts = [...product]
    .sort((a, b) => b.statut - a.statut) // Les produits avec statut true viennent en premier
    .map((p, index) => ({
      id: p?.id || `row-${index + 1}`,
      autoId: index + 1,
      name: p?.nom_produit,
      price: p?.prix_par_unite ? `${parseFloat(p.prix_par_unite).toFixed(2)} €` : "Non spécifié",
      quantity: p?.quantite_en_stock || 0,
      orderedQuantity: calculateOrderedQuantity(p.id),
      statut: p?.statut, // Ajouter le statut pour l'affichage
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

  const handleActivateProduct = async (productId) => {
    try {
      await dispatch(activateProduct(productId));
      toast.success("Produit activé avec succès");
      dispatch(getAllProduits());
    } catch (error) {
      toast.error("Échec de l'activation du produit");
    }
  };

  const handleEditProduct = (productselected) => {
    // Rechercher le produit par ID dans le tableau des produits
    const productToEdit = product.find((p) => p.id === productselected.id);
   
  
    if (productToEdit) {
      setEditProduct(productToEdit); // Définir le produit à modifier
      setEditOpen(true); // Ouvrir le modal de modification
    } else {
      toast.error("Produit non trouvé"); // Afficher un message d'erreur si le produit n'est pas trouvé
    }
  };
  
  

  const handleEditModalClose = () => {
    setEditOpen(false); // Fermer le modal de modification
    setEditProduct(null); // Réinitialiser le produit à modifier
  };

  return (
    <div className="px-8 mt-28 flex flex-col gap-5 sm:pr-9">
      <ToastContainer />
      <h2 className="font-black text-3xl block md:hidden">Les produits</h2>
      <Table
        columns={(isMobile) => columns(isMobile, handleViewDetails, handleDisableProduct, handleActivateProduct, handleEditProduct)}
        rows={sortedProducts}
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

      <Modal open={editOpen} onClose={handleEditModalClose}>
        <Box
          className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white p-4 rounded-lg ${
            isMobile ? 'w-[90vw]' : 'w-[400px]'
          }`}
        >
          <div className="flex justify-end">
            <IconButton onClick={handleEditModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          {editProduct && (
            <ProductEditForm
              product={editProduct}
              categories={categories}
              onClose={handleEditModalClose}
            />
          )}
        </Box>
      </Modal>

      <Modal open={viewDetailsOpen} onClose={handleViewDetailsClose}>
        <Box
          className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white p-4 rounded-lg ${
            isMobile ? 'w-[90vw]' : 'w-[400px]'
          }`}
        >
          <div className="flex justify-end">
            <IconButton onClick={handleViewDetailsClose}>
              <CloseIcon />
            </IconButton>
          </div>
          {selectedProduct && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedProduct.name}
              </Typography>
              <Typography variant="body1" paragraph>
                Prix : {selectedProduct.price}
              </Typography>
              <Typography variant="body1" paragraph>
                Quantité en stock : {selectedProduct.quantity}
              </Typography>
              <Typography variant="body1" paragraph>
                Quantité commandée : {selectedProduct.orderedQuantity}
              </Typography>
              <div className="flex flex-col items-center">
                <img
                  src={selectedProduct.urlsPhotos[activePhotoIndex]}
                  alt={`photo ${activePhotoIndex + 1}`}
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
                <div className="flex justify-between w-full mt-2">
                  {selectedProduct.urlsPhotos.length > 1 && (
                    <>
                      <Button
                        onClick={() => setActivePhotoIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={activePhotoIndex === 0}
                      >
                        Précédent
                      </Button>
                      <Button
                        onClick={() => setActivePhotoIndex((prev) => Math.min(prev + 1, selectedProduct.urlsPhotos.length - 1))}
                        disabled={activePhotoIndex === selectedProduct.urlsPhotos.length - 1}
                      >
                        Suivant
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ProductList;
