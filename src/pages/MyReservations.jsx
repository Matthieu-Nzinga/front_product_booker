import React, { useState, useEffect } from 'react';
import { getAllCommands, putCommand } from '../features/products/products'; // Assurez-vous d'importer l'action pour annuler la commande
import { useDispatch, useSelector } from 'react-redux';
import Table from "../components/Table";
import { Box, Button, IconButton, Modal, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { format } from 'date-fns';
import { jwtDecode } from "jwt-decode"; // Corrigez la syntaxe de l'importation
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from '@mui/icons-material/Cancel'; // Importez l'icône d'annulation
import { toast, ToastContainer } from 'react-toastify';
import CommandEdit from '../components/CommandEdit';
import VisibilityIcon from "@mui/icons-material/Visibility";
const statusColors = {
  "En attente": "#F4BD13",
  "Livré": "green",
  "En cours": "black",
  "Annulé": "red", // Ajoutez une couleur pour le statut Annulé
};

const columns = (isMobile, handleEditCommand, handleViewDetails) => [
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
        {
          params.row.statut !== "Annulé" && (
            <Tooltip title="Détails de la commande">
              <IconButton onClick={() => handleViewDetails(params.row.id)}>
                <VisibilityIcon style={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )
        }
        {/* Affiche l'icône de modification uniquement si le statut n'est pas En cours ou Annulé */}
        {params.row.statut !== "En cours" && params.row.statut !== "Annulé" && params.row.statut !== "Livré" && (
          <Tooltip title="Modifier la commande">
            <IconButton onClick={() => handleEditCommand(params.row)}>
              <EditIcon style={{ fontSize: 20 }} />
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
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(""); // Ajouter l'état pour le statut

  const { commands } = useSelector((state) => state.products) || [];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCommands());
  }, [dispatch]);

  const handleEditModalClose = () => {
    setEditOpen(false);
    setEditCommand(null);
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

  const handleOpenModal = (commandId) => {
    const command = commands.find((cmd) => cmd.id === commandId);
    if (command) {
      setSelectedCommand(command);
      setStatus(command.status); // Initialiser le statut avec la valeur de la commande
      setOpen(true);
    }
  };
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedCommand(null);
    setStatus(""); // Réinitialiser le statut lorsque la modal est fermée
  };
  return (
    <div className='p-5'>
      <ToastContainer />
      <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl my-5 sm:my-7">
        Mes réservations
      </h1>
      <Table
        columns={(isMobile) =>
          columns(isMobile, handleEditCommand, handleOpenModal)
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
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white p-4 rounded-lg shadow-lg ${isMobile ? "w-[90vw]" : "w-[400px]"
            }`}
          sx={{
            maxHeight: isMobile ? "80vh" : "80vh",
            overflowY: "auto",
          }}
        >
          <div className="flex justify-end">
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </div>
          {selectedCommand && (
            <div>
              <Typography variant="h6" className="text-2xl font-semibold">
                Détails de la commande
              </Typography>
              <Typography variant="subtitle1" className="text-lg font-medium">
                Date:{" "}
                {format(new Date(selectedCommand.createdAt), "dd/MM/yyyy")}
              </Typography>
              <Typography variant="subtitle1" className="text-lg font-medium">
                Nombre de produits: {selectedCommand.reservations.length}
              </Typography>
              <Typography variant="subtitle1" className="text-lg font-medium">
                Prix total: {selectedCommand.total_commande} €
              </Typography>
              <Typography variant="subtitle1" className="text-lg font-medium">
                Statut: {selectedCommand.status}
              </Typography>

              <div className="mt-6">
                <Typography variant="h6" className="text-2xl font-semibold" >
                  Informations du client
                </Typography>
                <Typography variant="subtitle1" className="text-lg font-medium">
                  Nom: {selectedCommand.user.name}{" "}
                  {selectedCommand.user.first_name}
                </Typography>
                <Typography variant="subtitle1" className="text-lg font-medium">
                  Téléphone: {selectedCommand.user.phone}
                </Typography>
                <Typography variant="subtitle1" className="text-lg font-medium">
                  Email: {selectedCommand.user.email}
                </Typography>
              </div>
              {/* Afficher les détails des produits */}
              <div className="mt-6">
                <Typography variant="h6" className="text-2xl font-semibold">
                  Les Produits de la commande
                </Typography>
                {selectedCommand.reservations.map((reservation) => (
                  <div key={reservation.id} className="mt-2">
                    <Typography
                      variant="subtitle1"
                      className="text-lg font-medium"
                    >
                      <strong> {reservation.produit.nom_produit}</strong>:{" "} <br />
                      - Prix : {reservation.produit.prix_par_unite} € <br />
                      - Quanité commandée : {reservation.quantite_commande}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default MyReservations;
