import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../components/Header";
import Table from "../components/Table";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getAllCommands, putCommand } from "../features/products/products";
import { useMediaQuery } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const statusColors = {
  "En attente": "#F4BD13",
  Livré: "green",
};

const columns = (isMobile, handleViewDetails) => [
  { field: "date", headerName: "Date", width: isMobile ? 100 : 260 },
  {
    field: "nombreProduits",
    headerName: "Nombre de produits",
    width: isMobile ? 100 : 260,
  },
  { field: "prixTotal", headerName: "Prix total", width: isMobile ? 100 : 260 },
  {
    field: "statut",
    headerName: "Statut",
    width: isMobile ? 100 : 260,
    renderCell: (params) => (
      <div style={{ color: statusColors[params.value] || "black" }}>
        {params.value}
      </div>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    width: isMobile ? 100 : 120,
    renderCell: (params) => (
      <IconButton onClick={() => handleViewDetails(params.row.id)}>
        <VisibilityIcon />
      </IconButton>
    ),
  },
];

const Controls = () => {
  const { commands } = useSelector((state) => state.products) || [];
  const dispatch = useDispatch();
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    dispatch(getAllCommands());
  }, [dispatch]);

  // Filtrer et trier les commandes
  const sortedCommands = commands
    .slice() // Créer une copie pour ne pas modifier l'original
    .sort((a, b) => {
      if (a.status === 'En attente' && b.status !== 'En attente') return -1;
      if (a.status !== 'En attente' && b.status === 'En attente') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const rows = sortedCommands.map((command, index) => ({
    id: command.id || `row-${index + 1}`,
    date: command.createdAt
      ? format(new Date(command.createdAt), "dd/MM/yyyy")
      : "N/A",
    nombreProduits: (command.reservations && command.reservations.length) || 0,
    prixTotal: command.total_commande + " €",
    statut: command.status || "N/A",
  }));

  const handleOpenModal = (commandId) => {
    const command = commands.find((cmd) => cmd.id === commandId);
    if (command) {
      setSelectedCommand(command);
      setOpen(true);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedCommand(null);
  };

  const handleDeliveryConfirmation = async (orderId) => {
    try {
      await dispatch(putCommand(orderId)).unwrap();
      toast.success("Opération réussie");
      dispatch(getAllCommands());
      handleCloseModal();
    } catch (error) {
      toast.error("Opération échouée");
    }
  };

  return (
    <div>
      <Header text={"Les Commandes"} />
      <div className="mt-28 px-8">
        <Table
          columns={(isMobile) => columns(isMobile, handleOpenModal)}
          rows={rows}
          isMobile={isMobile}
        />
      </div>

      <Modal open={open} onClose={handleCloseModal}>
        <Box
          className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white p-4 rounded-lg shadow-lg ${
            isMobile ? "w-[90vw]" : "w-[400px]"
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
                <Typography variant="h6" className="text-2xl font-semibold">
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
                <Typography variant="subtitle1" className="text-lg font-medium">
                  Sexe: {selectedCommand.user.sexe}
                </Typography>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                {selectedCommand.reservations.map((reservation, index) => {
                  const imageUrl = reservation?.produit?.urlsPhotos?.[0];
                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-100 p-4 rounded-md shadow-md"
                    >
                      <img
                        src={imageUrl || "default-image-url.jpg"}
                        alt={`Produit ${
                          reservation.produit?.nom_produit || "Inconnu"
                        }`}
                        className="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded-md"
                      />
                      <div className="flex flex-col flex-grow sm:mx-4 mt-4 sm:mt-0">
                        <Typography
                          variant="body2"
                          className="text-xl font-bold"
                        >
                          {reservation.produit?.nom_produit ||
                            "Nom de produit manquant"}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-sm text-gray-600"
                        >
                          Prix unitaire:{" "}
                          {reservation.produit?.prix_par_unite
                            ? `${reservation.produit.prix_par_unite} €`
                            : "N/A"}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-sm text-gray-600 mt-2"
                        >
                          Quantité: {reservation.quantite_commande || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-sm text-gray-600 mt-2"
                        >
                          Prix total:{" "}
                          {reservation.quantite_commande *
                            (reservation.produit?.prix_par_unite || 0)}{" "}
                          €
                        </Typography>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDeliveryConfirmation(selectedCommand.id)}
                  disabled={selectedCommand.status === "Livré"}
                >
                  {selectedCommand.status === "Livré"
                    ? "Commande déjà livrée"
                    : "Marquer comme livrée"}
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Controls;
