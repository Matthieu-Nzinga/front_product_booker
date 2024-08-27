import React, { useState, useEffect } from 'react';
import { getAllCommands, putCommand } from '../features/products/products'; // Assurez-vous d'importer l'action pour annuler la commande
import { useDispatch, useSelector } from 'react-redux';
import Table from "../components/Table";
import { Box, IconButton, Modal, Tooltip, useMediaQuery } from '@mui/material';
import { format } from 'date-fns';
import { jwtDecode } from "jwt-decode"; // Corrigez la syntaxe de l'importation
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from '@mui/icons-material/Cancel'; // Importez l'icône d'annulation
import { toast } from 'react-toastify';
import CommandEdit from '../components/CommandEdit';

const statusColors = {
  "En attente": "#F4BD13",
  "Livré": "green",
  "En cours": "black",
  "Annulé": "red", // Ajoutez une couleur pour le statut Annulé
};

const columns = (isMobile, handleEditCommand, handleCancelCommand) => [
  { field: "date", headerName: "Date", width: isMobile ? 100 : 150 },
  { field: "nombreProduits", headerName: "Nombre de produits", width: isMobile ? 100 : 150 },
  { field: "prixTotal", headerName: "Prix total", width: isMobile ? 100 : 150 },
  {
    field: "statut",
    headerName: "Statut",
    width: isMobile ? 100 : 150,
    renderCell: (params) => (
      <div style={{ color: statusColors[params.value] || 'black' }}>
        {params.value}
      </div>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    width: isMobile ? 150 : 200, // Augmentez la largeur pour ajouter l'icône d'annulation
    renderCell: (params) => (
      <>
        {/* Affiche l'icône de modification uniquement si le statut n'est pas En cours ou Annulé */}
        {params.row.statut !== "En cours" && params.row.statut !== "Annulé" && params.row.statut !== "Livré" && (
          <Tooltip title="Modifier la commande">
            <IconButton onClick={() => handleEditCommand(params.row)}>
              <EditIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        )}
        {/* Affiche l'icône d'annulation uniquement si le statut est En attente */}
        {params.row.statut === "En attente" && (
          <Tooltip title="Annuler la commande">
            <IconButton onClick={() => handleCancelCommand(params.row.id)}>
              <CancelIcon style={{ fontSize: 20, color: 'red' }} />
            </IconButton>
          </Tooltip>
        )}
      </>
    ),
  },
];

const MyReservations = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const [editOpen, setEditOpen] = useState(false);
  const [editCommand, setEditCommand] = useState(null);

  const { commands } = useSelector((state) => state.products) || [];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCommands());
  }, [dispatch]);

  const handleEditModalClose = () => {
    setEditOpen(false);
    setEditCommand(null);
  };

  const handleCancelCommand = (commandId) => {
    dispatch(putCommand({ id: commandId, status: "Annulé" }));
    dispatch(getAllCommands());
    toast.success("Commande annulée avec succès.");
  };

  const filteredCommands = Array.isArray(commands)
    ? commands.filter(command => command.userId === userId)
    : [];

  const sortedCommands = filteredCommands
    .slice()
    .sort((a, b) => {
      const statusOrder = { "En attente": 1, "En cours": 2, "Livré": 3 };
      const statusA = statusOrder[a.status] || 4;
      const statusB = statusOrder[b.status] || 4;
      if (statusA !== statusB) return statusA - statusB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const rows = sortedCommands.map((command, index) => ({
    id: command.id || `row-${index + 1}`,
    date: command.createdAt ? format(new Date(command.createdAt), 'dd/MM/yyyy') : 'N/A',
    nombreProduits: (command.reservations && command.reservations.length) || 0,
    prixTotal: command.total_commande + " €",
    statut: command.status || 'N/A',
  }));

  const isMobile = useMediaQuery('(max-width: 640px)');

  const handleEditCommand = (commandSelected) => {
    const commandToEdit = commands.find((p) => p.id === commandSelected.id);
    if (commandToEdit) {
      setEditCommand(commandToEdit);
      setEditOpen(true);
    } else {
      toast.error("Commande non trouvée");
    }
  };

  return (
    <div className='p-5'>
      <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl my-5 sm:my-7">
        Mes réservations
      </h1>
      <Table
        columns={(isMobile) =>
          columns(isMobile, handleEditCommand, handleCancelCommand)
        }
        rows={rows} isMobile={isMobile}
      />
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
            width: isMobile ? "80%" : "500px", // Ajustez la largeur ici
            maxHeight: "90vh", // Limite la hauteur du modal
            overflowY: "auto", // Ajoute le défilement vertical
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleEditModalClose}
          >
            <CloseIcon />
          </IconButton>
          {editCommand && (
            <CommandEdit
              command={editCommand}
              onClose={handleEditModalClose}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default MyReservations;
