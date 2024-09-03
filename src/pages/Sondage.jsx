import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Modal, Box, useMediaQuery, Tooltip, IconButton, Button} from "@mui/material";
import SondageForm from "../components/SondageForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllSondages, showAndHideSondage } from "../features/products/products";
import Table from "../components/Table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format, parseISO } from "date-fns";
import SondageDetailsModal from "../components/SondageDetailsModal";
import { getAllUsers } from "../features/users/userSlice";
import { toast, ToastContainer } from "react-toastify";
import ArchiveIcon from "@mui/icons-material/Archive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import jsPDF from "jspdf";
import "jspdf-autotable";

const getColumns = (handleViewDetails,handleArchive, handleActivate, isMobile) => [
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
        {params.row.statut ? (
          <Tooltip title="Archiver le sondage">
            <IconButton color="error" onClick={() => handleArchive(params.row.id)}>
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        ) : (
            <Tooltip color="success" title="Activer le sondage">
            <IconButton onClick={() => handleActivate(params.row.id)}>
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
        )}
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
  const filteredRole = useSelector((state) => state.products.filteredRole);

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
  const handleArchive = async (id) => {
    // Logique pour archiver le sondage
    const body = {
      statut: false,
    }
   
    try {
      await dispatch(showAndHideSondage({ id, body }));
      toast.success("Sondage archivé avec succès");
      dispatch(getAllSondages());
    } catch (error) {
      toast.error("Échec");
    }
  };

  const handleActivate = async (id) => {
    // Logique pour activer le sondage
    const body = {
      statut: true,
    }

    try {
      await dispatch(showAndHideSondage({ id, body }));
      toast.success("Sondage activé avec succès");
      dispatch(getAllSondages());
    } catch (error) {
      toast.error("Échec");
    }

  };

  useEffect(() => {
    dispatch(getAllSondages());
    dispatch(getAllUsers())
  }, [dispatch]);

  const filteredSondages = sondages.filter((sondage) => {
    if (filteredRole === "Client") {
      return sondage.user?.role === "Client"; 
    } else if (filteredRole === "Admin") {
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
      statut: sondage?.statut,
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
  
  // Fonction pour exporter les données en PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "Nom du produit", dataKey: "nom_produit" },
      { header: "Description", dataKey: "description" },
      { header: "Message", dataKey: "message" },
      { header: "Prix", dataKey: "prix" },
      { header: "Date", dataKey: "createdAt" },
    ];

    doc.autoTable({
      columns,
      body: rows,
      margin: { top: 10 },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: "middle",
      },
      headStyles: {
        fillColor: [52, 73, 94], // Couleur du header
      },
    });

    doc.save("sondages.pdf");
  };


  return (
    <div>
      <Header text={"Les Sondages"} />
      <ToastContainer />
      <div className="px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mt-28 space-y-4 sm:space-y-0">
          <Button
            variant="contained"
            color="primary"
            onClick={exportPDF}
            sx={{
              marginLeft: { xs: 0, sm: 2 },
              width: { xs: '100%', sm: 'auto' },
              marginBottom: { xs: 2, sm: 0 },
            }}
          >
            Exporter en format PDF
          </Button>
          <button
            className="w-full sm:w-auto text-center font-semibold text-base bg-customBlue px-6 py-3 text-white hover:bg-blue-600 rounded-xl"
            onClick={handleOpen}
          >
            Créer un sondage
          </button>
        </div>

        <Table
          rows={rows}
          columns={() =>
            getColumns(handleViewDetails, handleArchive, handleActivate, isMobile)
          }
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
            width: { xs: "90%", sm: 400 },
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          <SondageForm handleClose={handleClose} title="Créer un sondage" />
        </Box>
      </Modal>
    </div>

  );
};

export default Sondage;
