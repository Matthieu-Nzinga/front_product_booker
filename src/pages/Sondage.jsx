import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Modal, Box, useMediaQuery, Tooltip, IconButton } from "@mui/material";
import SondageForm from "../components/SondageForm"; // Assurez-vous que le chemin est correct
import { useDispatch, useSelector } from "react-redux";
import { getAllSondages } from "../features/products/products";
import Table from "../components/Table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format, parseISO } from "date-fns";
import SondageDetailsModal from "../components/SondageDetailsModal";
import { getAllUsers } from "../features/users/userSlice";

// Définir les colonnes de la table comme une fonction
const getColumns = (handleViewDetails, isMobile) => [
  { field: "nom_produit", headerName: "Nom du produit", width: 150 },
  { field: "description", headerName: "Description", width: 150 },
  { field: "message", headerName: "Message", width: 150 },
  { field: "prix", headerName: "Prix", width: 150 },
  {
    field: "createdAt",
    headerName: "Date",
    width: 150,
  },
  {
    field: "visualisation",
    headerName: "Visualiser",
    width: isMobile ? 250 : 150,
    renderCell: (params) => (
      <div>
        <Tooltip title="Détails sur le sondage">
          <IconButton onClick={() => handleViewDetails(params.row)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
];

const Sondage = () => {
  const { sondages } = useSelector((state) => state.products);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [selectedSondage, setSelectedSondage] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { user } = useSelector((state) => state.users);

  const handleOpenDetails = (sondage) => {
    setSelectedSondage(sondage);
    setDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setSelectedSondage(null);
    setDetailsOpen(false);
  };

  const handleViewDetails = (sondagedet) => {
    const detailsSondage = sondages.find(sondage => sondage.id === sondagedet.id)
    handleOpenDetails(detailsSondage);
  };

  useEffect(() => {
    dispatch(getAllSondages());
    dispatch(getAllUsers())
  }, [dispatch]);

  // Préparer les données pour la table
  const rows = sondages
    .map((sondage) => ({
      id: sondage.id,
      nom_produit: sondage.nom_produit,
      description: sondage.description,
      message: sondage.question,
      prix: sondage?.prix
        ? `${parseFloat(sondage.prix).toFixed(2)} €`
        : "Non spécifié",
      createdAt: sondage.createdAt, // Garder la date au format ISO pour le tri
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Trier les sondages du plus récent au plus ancien en tenant compte de l'heure
    .map((sondage) => ({
      ...sondage,
      createdAt: sondage.createdAt
        ? format(parseISO(sondage.createdAt), "dd/MM/yyyy HH:mm") // Formatage pour affichage avec l'heure
        : "N/A",
    }));
  return (
    <div>
      <Header text={"Les Sondages"} />
      <div className="px-8">
        <div className="flex justify-end">
          <button
            className="text-center mb-4 font-semibold text-base bg-customBlue px-[93px] text-white py-3 hover:bg-blue-600 mt-28 rounded-xl"
            onClick={handleOpen}
          >
            Créer un sondage
          </button>
        </div>

        <Table
          rows={rows}
          columns={() => getColumns(handleViewDetails, isMobile)} // Appel de la fonction pour obtenir les colonnes
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
        <SondageDetailsModal
          sondage={selectedSondage}
          open={detailsOpen}
          onClose={handleCloseDetails}
          users = {user}
        />
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: '90%', sm: 400 }, // Responsiveness
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflowY: 'auto', // Enable vertical scroll if needed
          }}
        >
          <SondageForm handleClose={handleClose} title="Créer un sondage" />
        </Box>
      </Modal>
    </div>
  );
};

export default Sondage;
