import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button,
  Tooltip,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EditIcon from "@mui/icons-material/Edit";
import ProductForm from "./ProductForm";
import ProductEditForm from "./ProductEditForm";
import { useDispatch, useSelector } from "react-redux";
import {
  activateProduct,
  getAllCategories,
  getAllCommands,
  getAllProduits,
  hideProduct,
} from "../features/products/products";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "./Table";
import { useMediaQuery } from "@mui/material";

const columns = (
  isMobile,
  handleViewDetails,
  handleDisableProduct,
  handleActivateProduct,
  handleEditProduct
) => [
  { field: "name", headerName: "Nom", width: isMobile ? 100 : 300 },
  { field: "price", headerName: "Prix", width: isMobile ? 100 : 300 },
  {
    field: "quantity",
    headerName: "Stock disponible",
    width: isMobile ? 100 : 300,
  },
  {
    field: "orderedQuantity",
    headerName: "Quantité commandée",
    width: isMobile ? 100 : 300,
  },
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
              <CheckCircleOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ),
  },
];

const ProductList = () => {
  const { product, categories, commands } = useSelector(
    (state) => state.products
  );
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // État pour le terme de recherche
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    dispatch(getAllProduits());
    dispatch(getAllCategories());
    dispatch(getAllCommands());
  }, [dispatch]);

  const calculateOrderedQuantity = (productId) => {
    return commands.reduce((total, command) => {
      if (command.status === "En attente") {
        const reservedProduct = command.reservations.find(
          (reservation) => reservation.produitId === productId
        );
        return (
          total + (reservedProduct ? reservedProduct.quantite_commande : 0)
        );
      }
      return total;
    }, 0);
  };

  const sortedProducts = [...product]
    .sort((a, b) => b.statut - a.statut)
    .map((p, index) => ({
      id: p?.id || `row-${index + 1}`,
      autoId: index + 1,
      name: p?.nom_produit,
      price: p?.prix_par_unite
        ? `${parseFloat(p.prix_par_unite).toFixed(2)} €`
        : "Non spécifié",
      quantity: p?.quantite_en_stock || 0,
      orderedQuantity: calculateOrderedQuantity(p.id),
      statut: p?.statut,
      urlsPhotos: p?.urlsPhotos || [],
    }));

  // Filtrer les produits en fonction du terme de recherche
  const filteredProducts = sortedProducts.filter((product) =>
    product?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setActivePhotoIndex(0);
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
    const productToEdit = product.find((p) => p.id === productselected.id);

    if (productToEdit) {
      setEditProduct(productToEdit);
      setEditOpen(true);
    } else {
      toast.error("Produit non trouvé");
    }
  };

  const handleEditModalClose = () => {
    setEditOpen(false);
    setEditProduct(null);
  };

  return (
    <div className="px-8 mt-28 flex flex-col gap-5 sm:pr-9">
      <ToastContainer />
      <h2 className="font-black text-3xl block md:hidden">Les produits</h2>
      <div className="flex justify-end mb-2">
        <TextField
          variant="outlined"
          label="Rechercher par nom"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            maxWidth: "600px", // Définir une largeur maximale
            width: "100%", // Assurer que le champ de recherche utilise toute la largeur disponible jusqu'à la largeur maximale
          }}
        />
      </div>

      <Table
        columns={(isMobile) =>
          columns(
            isMobile,
            handleViewDetails,
            handleDisableProduct,
            handleActivateProduct,
            handleEditProduct
          )
        }
        rows={filteredProducts} // Utiliser les produits filtrés
        isMobile={isMobile}
        sx={{
          "& .MuiDataGrid-cell": {
            padding: "4px 8px",
          },
          "& .MuiDataGrid-columnHeaders": {
            padding: "8px",
            textAlign: "center",
          },
          "& .MuiDataGrid-footer": {
            padding: "8px",
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
            isMobile ? "w-[90vw]" : isTablet ? "w-[70vw]" : "w-[400px]"
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
          className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white p-4 rounded-lg shadow-lg ${
            isMobile ? "w-[90vw]" : isTablet ? "w-[70vw]" : "w-[400px]"
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
              onClose={handleEditModalClose}
              category={categories}
            />
          )}
        </Box>
      </Modal>

      {/* Modal pour afficher les détails du produit */}
      <Modal open={viewDetailsOpen} onClose={handleViewDetailsClose}>
  <Box
    className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white p-4 rounded-lg shadow-lg ${
      isMobile ? "w-[90vw]" : isTablet ? "w-[70vw]" : "w-[600px]"
    }`}
  >
    <div className="flex justify-end">
      <IconButton onClick={handleViewDetailsClose}>
        <CloseIcon />
      </IconButton>
    </div>
    {selectedProduct && (
      <div>
        <Typography variant="h6" component="div" className="mb-4">
          Détails du produit
        </Typography>
        <div className="flex flex-col items-center">
          {selectedProduct.urlsPhotos.length > 0 && (
            <img
              src={selectedProduct.urlsPhotos[activePhotoIndex]}
              alt={`Photo ${activePhotoIndex + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
              className="mb-2"
            />
          )}
          {selectedProduct.urlsPhotos.length > 1 && (
            <div className="flex gap-2 mb-4">
              {selectedProduct.urlsPhotos.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => setActivePhotoIndex(index)}
                  variant={
                    index === activePhotoIndex ? "contained" : "outlined"
                  }
                >
                  Photo {index + 1}
                </Button>
              ))}
            </div>
          )}

          {/* Display additional product details */}
          <Typography variant="body1" className="mb-2">
            <strong>Nom :</strong> {selectedProduct.name}
          </Typography>
          <Typography variant="body1" className="mb-2">
            <strong>Quantité commandée :</strong> {selectedProduct.orderedQuantity}
          </Typography>
          <Typography variant="body1" className="mb-2">
            <strong>Prix :</strong> {selectedProduct.price}
          </Typography>
          <Typography variant="body1" className="mb-2">
            <strong>Quantité en stock :</strong> {selectedProduct.quantity}
          </Typography>
        </div>
      </div>
    )}
  </Box>
</Modal>

    </div>
  );
};

export default ProductList;
