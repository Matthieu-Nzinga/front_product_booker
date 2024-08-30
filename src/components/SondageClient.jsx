import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  getAllSondages } from "../features/products/products";
import Table from "./Table";
import { format } from "date-fns";
import { IconButton, Tooltip, useMediaQuery, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SondageDetailsModal from "./SondageDetailsModal";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const getColumns = (handleViewDetails, isMobile) => [
  { field: "nom_produit", headerName: "Nom du produit", width: 150 },
  { field: "description", headerName: "Description", width: 150 },
  { field: "question", headerName: "Message", width: 150 },
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

const SondageClient = () => {
  const { sondages } = useSelector((state) => state.products) || [];
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [selectedSondage, setSelectedSondage] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    dispatch(getAllSondages());
  }, [dispatch]);

  const handleOpenDetails = (sondage) => {
    setSelectedSondage(sondage);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedSondage(null);
    setDetailsOpen(false);
  };

  const handleViewDetails = (sondagedet) => {
    const detailsSondage = sondages.find(sondage => sondage.id === sondagedet.id);
    handleOpenDetails(detailsSondage);
  };

  // Filtrer les sondages pour n'afficher que ceux dont l'utilisateur n'a pas encore répondu
  // et où le sondage est associé à un utilisateur dont le role est Admin et userId est différent
  const filteredSondages = sondages.filter((sondage) => {
    return (
      sondage?.reponses?.every(response => response.userId !== userId) &&
      sondage.user.userId !== userId &&
      sondage.user.role === "Admin"
    );
  });

  // Préparer les données pour la table
  const rows = filteredSondages.map((sondage) => ({
    id: sondage.id,
    nom_produit: sondage.nom_produit,
    description: sondage.description,
    question: sondage.question,
    createdAt: sondage.createdAt
      ? format(new Date(sondage.createdAt), "dd/MM/yyyy")
      : "N/A",
  }));

  return (
    <div className="w-90">
      <ToastContainer />
      <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl my-5 sm:my-7">
        Les sondages
      </h1>
      {filteredSondages.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          Il n'y a pas un nouveau sondage pour l'instant. Merci !
        </Typography>
      ) : (
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
      )}
      <SondageDetailsModal
        sondage={selectedSondage}
        open={detailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default SondageClient;
