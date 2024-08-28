import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Modal, Box, useMediaQuery, Tooltip, IconButton } from "@mui/material";
import SondageForm from "../components/SondageForm"; // Assurez-vous que le chemin est correct
import { useDispatch, useSelector } from "react-redux";
import { getAllSondages } from "../features/products/products";
import Table from "../components/Table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns";

// Définir les colonnes de la table comme une fonction
const getColumns = (handleViewDetails, isMobile) => [
  { field: 'nom_produit', headerName: 'Nom du produit', width: 200 },
  { field: 'description', headerName: 'Description', width: 200 },
  { field: 'question', headerName: 'Question', width: 250 },
  {
    field: 'createdAt',
    headerName: 'Date',
    width: 200,
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

  useEffect(() => {
    dispatch(getAllSondages());
  }, [dispatch]);
  // Préparer les données pour la table
  const rows = sondages.map((sondage) => ({
    id: sondage.id,
    nom_produit: sondage.nom_produit,
    description: sondage.description,
    question: sondage.question,
    createdAt: sondage.createdAt
    ? format(new Date(sondage.createdAt), "dd/MM/yyyy")
    : "N/A",
  }));

  const handleViewDetails = (product) => {
    // Implémentez la logique pour afficher les détails du produit
  };

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
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <SondageForm handleClose={handleClose} title="Créer un sondage" />
        </Box>
      </Modal>
    </div>
  );
};

export default Sondage;
