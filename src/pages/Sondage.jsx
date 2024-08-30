import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Modal, Box, useMediaQuery, Tooltip, IconButton, Select, MenuItem } from "@mui/material";
import SondageForm from "../components/SondageForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllSondages } from "../features/products/products";
import Table from "../components/Table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format, parseISO } from "date-fns";
import SondageDetailsModal from "../components/SondageDetailsModal";
import { getAllUsers } from "../features/users/userSlice";
import { ToastContainer } from "react-toastify";

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
  const [filterRole, setFilterRole] = useState("all"); // Valeur par défaut

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

  const handleFilterChange = (event) => {
    setFilterRole(event.target.value);
  };

  useEffect(() => {
    dispatch(getAllSondages());
    dispatch(getAllUsers())
  }, [dispatch]);

  const filteredSondages = sondages.filter((sondage) => {
    if (filterRole === "Client") {
      return sondage.user?.role === "Client";
    } else if (filterRole === "Admin") {
      return sondage.user?.role === "Admin";
    }
    return true; // Si aucun filtre n'est appliqué, afficher tous les sondages
  });

  const rows = filteredSondages
    .map((sondage) => ({
      id: sondage.id,
      nom_produit: sondage.nom_produit,
      description: sondage.description,
      message: sondage.question,
      prix: sondage?.prix
        ? `${parseFloat(sondage.prix).toFixed(2)} €`
        : "Non spécifié",
      createdAt: sondage.createdAt,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((sondage) => ({
      ...sondage,
      createdAt: sondage.createdAt
        ? format(parseISO(sondage.createdAt), "dd/MM/yyyy HH:mm")
        : "N/A",
    }));

  return (
    <div>
      <Header text={"Les Sondages"} />
      <ToastContainer />
      <div className="px-8">
        <div className="flex justify-between items-center mt-28">
          <div>
            <Select
              value={filterRole}
              onChange={handleFilterChange}
              variant="outlined"
              sx={{
                marginRight: 2,
                width: 400,
              }}
            >
              <MenuItem value="all">Tous les sondages</MenuItem>
              <MenuItem value="Client">Suggestion des clients</MenuItem>
              <MenuItem value="Admin">Vos sondages</MenuItem>
            </Select>
           </div>
          <div>
            <button
              className="text-center mb-4 font-semibold text-base bg-customBlue px-[93px] text-white py-3 hover:bg-blue-600 rounded-xl"
              onClick={handleOpen}
            >
              Créer un sondage
            </button>
        </div>
        </div>

        <Table
          rows={rows}
          columns={() => getColumns(handleViewDetails, isMobile)}
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
          users={user}
        />
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: '90%', sm: 400 },
            maxHeight: '80vh',
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
        >
          <SondageForm handleClose={handleClose} title="Créer un sondage" />
        </Box>
      </Modal>
    </div>
  );
};

export default Sondage;
