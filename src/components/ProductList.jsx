import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ProductForm from "./ProductForm";
import ProductEditForm from "./ProductEditForm";
import { useDispatch, useSelector } from "react-redux";
import products, {
  activateProduct,
  getAllCategories,
  getAllCommands,
  getAllProduits,
  hideProduct,
  ProductSale,
  ProductUnsale,
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
  {
    field: "category",
    headerName: "Catégorie",
    width: isMobile ? 100 : 150,
  },
  { field: "name", headerName: "Nom", width: isMobile ? 100 : 150 },
  { field: "price", headerName: "Prix", width: isMobile ? 100 : 150 },
  {
    field: "quantity",
    headerName: "Stock disponible",
    width: isMobile ? 100 : 150,
  },
  {
    field: "orderedQuantity",
    headerName: "Quantité commandée",
    width: isMobile ? 100 : 150,
  },
  {
    field: "numero_produit",
    headerName: "Numéro du produit",
    width: isMobile ? 100 : 150,
  },
  {
    field: "visualisation",
    headerName: "Visualiser",
    width: isMobile ? 250 : 150,
    renderCell: (params) => (
      <div>
        <Tooltip title="Détails du produit">
          <IconButton onClick={() => handleViewDetails(params.row)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Modifier le produit">
          <IconButton onClick={() => handleEditProduct(params.row)}>
            <EditIcon style={{ fontSize: 20 }} />
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
  const [selectedCategory, setSelectedCategory] = useState(""); // État pour la catégorie sélectionnée
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(false);

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
    .map((p, index) => {
      // Rechercher la catégorie associée au produit en fonction de categoryId
      const category = categories.find((cat) => cat.id === p.categoryId) || {};

      return {
        id: p?.id || `row-${index + 1}`,
        autoId: index + 1,
        name: p?.nom_produit,
        price: p?.prix_par_unite
          ? `${parseFloat(p.prix_par_unite).toFixed(2)} €`
          : "Non spécifié",
        quantity: p?.quantite_en_stock || 0,
        orderedQuantity: calculateOrderedQuantity(p.id),
        statut: p?.statut,
        category: category?.nom || "Non spécifié", // Utiliser le nom de la catégorie ou "Non spécifié"
        urlsPhotos: p?.urlsPhotos || [],
        numero_produit: p?.numero_produit || "Non spécifié",
      };
    });

  // Filtrer les produits en fonction du terme de recherche et de la catégorie sélectionnée
  const filteredProducts = sortedProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "" || product?.category === selectedCategory;
    const matchesSearchTerm = product?.name
      ?.toLowerCase()
      .includes(searchTerm?.toLowerCase());

    return matchesCategory && matchesSearchTerm;
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewDetails = (one_product) => {
    const detailsProduct = product?.find(
      (details) => details.id === one_product.id
    );
    setSelectedProduct(detailsProduct);
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleFeatureProduct = async () => {
    setIsLoading(true); // Active le chargement
    try {
      await dispatch(ProductSale(selectedProduct.id));
      toast.success("Produit mis à la une avec succès");
      dispatch(getAllProduits());
      setViewDetailsOpen(false); // Ferme le modal si l'opération réussit
    } catch (error) {
      toast.error("Échec de modification");
    } finally {
      setIsLoading(false); // Désactive le chargement après l'opération
    }
  };
  const handleFeatureDeactivateProduct = async () => {
    setIsLoading(true); // Active le chargement
    try {
      await dispatch(ProductUnsale(selectedProduct.id));
      toast.success("Produit désactver comme à la une avec succès");
      dispatch(getAllProduits());
      setViewDetailsOpen(false); // Ferme le modal si l'opération réussit
    } catch (error) {
      toast.error("Échec de modification");
    } finally {
      setIsLoading(false); // Désactive le chargement après l'opération
    }
  };
  return (
    <div className="px-8 mt-28 flex flex-col gap-5 sm:pr-9">
      <ToastContainer />
      <h2 className="font-black text-3xl block md:hidden">Les produits</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
        <FormControl sx={{ minWidth: 130, width: 300, maxWidth: "300px" }}>
          <InputLabel id="category-select-label">
            Filtrer par catégorie
          </InputLabel>{" "}
          {/* Ajoutez InputLabel ici */}
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Filtrer par catégorie" // Le texte est toujours utilisé ici comme attribut label
          >
            <MenuItem value="">
              <em>Toutes les catégories</em>
            </MenuItem>
            {categories?.map((category) => (
              <MenuItem key={category.id} value={category.nom}>
                {category.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="Rechercher par nom"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            maxWidth: "300px", // Définir une largeur maximale
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
        rows={filteredProducts}
        isMobile={isMobile}
        sx={{
          "& .MuiDataGrid-cell": {
            padding: isMobile ? "2px 4px" : "4px 8px",
          },
          "& .MuiDataGrid-columnHeaders": {
            padding: isMobile ? "4px" : "8px",
            textAlign: "center",
          },
          "& .MuiDataGrid-footer": {
            padding: isMobile ? "4px" : "8px",
          },
        }}
      />

      <div className="flex justify-end">
        <button
          className="text-center mb-4 font-semibold text-base bg-customBlue px-[93px] text-white py-3 hover:bg-blue-600"
          onClick={handleOpen}
        >
          Ajouter un produit
        </button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 2,
            width: isMobile ? "90%" : "500px", // Réduit la largeur pour les écrans plus grands
            maxWidth: "90vw", // Assure que la largeur ne dépasse pas 90% de la largeur de l'écran
            maxHeight: "80vh", // Assure que le modal ne dépasse pas 80% de la hauteur de l'écran
            overflowY: "auto", // Permet le défilement vertical si le contenu dépasse
          }}
        >
          <ProductForm
            handleClose={handleClose}
            category={categories}
            onClose={handleClose}
          />
        </Box>
      </Modal>

      {/* Modal pour afficher les détails du produit */}
      <Modal open={viewDetailsOpen} onClose={handleViewDetailsClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 2,
            width: isMobile ? "90%" : "600px",
            maxHeight: "90vh", // Ajouté pour limiter la hauteur du modal
            overflowY: "auto", // Ajouté pour permettre le défilement vertical
          }}
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
                  <strong>Nom :</strong> {selectedProduct.nom_produit}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  <strong>Quantité en stock :</strong>{" "}
                  {selectedProduct.quantite_en_stock}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  <strong>Prix :</strong> {selectedProduct.prix_par_unite}€
                </Typography>
              </div>
            </div>
          )}
          {/* Add the button at the end of the modal */}
          {!selectedProduct?.enSolde ? (
            <div className="flex flex-col items-center mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handleFeatureProduct}
                disabled={isLoading} // Désactive le bouton pendant le chargement
              >
                {isLoading ? "En cours..." : "Marquer comme produit à la une"}
              </Button>
            </div>
          ) : <div className="flex flex-col items-center mt-4">
            <Button
              variant="contained"
              color="primary"
                onClick={handleFeatureDeactivateProduct}
              disabled={isLoading} // Désactive le bouton pendant le chargement
            >
              {isLoading ? "En cours..." : "Désactiver comme produit à la une"}
            </Button>
          </div> }
        </Box>
      </Modal>

      <Modal open={editOpen} onClose={handleEditModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 2,
            width: isMobile ? "90%" : "400px",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleEditModalClose}
          >
            <CloseIcon />
          </IconButton>
          {editProduct && (
            <ProductEditForm
              product={editProduct}
              onClose={handleEditModalClose}
              category={categories}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ProductList;
