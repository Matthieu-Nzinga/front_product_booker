import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { LuShoppingCart, LuUsers2 } from "react-icons/lu";
import { BiDollar } from "react-icons/bi";
import DashboardCard from "../components/DashboardCard";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  getAllCommands,
  getAllProduits,
  putCommand,
} from "../features/products/products";
import Table from "../components/Table";
import { format } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from "react-toastify";
import { getAllUsers } from "../features/users/userSlice";

const statusColors = {
  "En attente": "#F4BD13",
  Livré: "green",
  "En cours": "black", // Changer la couleur pour "En cours"
  Annulé: "red",
};

const columns = (isMobile, handleViewDetails) => [
  { field: "date", headerName: "Date", width: isMobile ? 100 : 220 },
  {
    field: "nombreProduits",
    headerName: "Nombre de produits",
    width: isMobile ? 100 : 260,
  },
  { field: "prixTotal", headerName: "Prix total", width: isMobile ? 100 : 220 },
  {
    field: "statut",
    headerName: "Statut",
    width: isMobile ? 100 : 220,
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
    renderCell: (params) =>
      params.row.statut !== "Annulé" && (
        <IconButton onClick={() => handleViewDetails(params.row.id)}>
          <VisibilityIcon />
        </IconButton>
      ),
  },
];

const Dashboard = () => {
  const { commands, product } = useSelector((state) => state.products) || [];
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(""); // Ajouter l'état pour le statut
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(getAllCommands());
    dispatch(getAllProduits());
    dispatch(getAllUsers());
  }, [dispatch]);

  const activeUsersCount = user.filter((u) => u.statut === true).length;

  const activeProductsCount = product.filter((u) => u.statut === true).length;

  const currentMonth = new Date().getMonth();
  const monthlyCommandCount = commands.filter((command) => {
    const commandMonth = new Date(command.createdAt).getMonth();
    return commandMonth === currentMonth && command.status !== "Annulé";
  }).length;

  const calculateTotal = (commands) => {
    const currentMonth = new Date().getMonth();
    return commands
      .filter(
        (command) =>
          new Date(command.createdAt).getMonth() === currentMonth &&
          command.status !== "Annulé"
      )
      .reduce((total, command) => total + command.total_commande, 0);
  };

  const monthlyTotalCommands = calculateTotal(commands);

  const card = [
    {
      id: 1,
      icon: <GiCardboardBoxClosed size={35} color="#316CEA" />,
      number: activeProductsCount,
      title: "Produits actifs",
    },
    {
      id: 2,
      icon: <LuShoppingCart size={35} color="#316CEA" />,
      number: monthlyCommandCount,
      title: "Commandes mensuelles",
    },
    {
      id: 3,
      icon: <LuUsers2 size={35} color="#316CEA" />,
      number: activeUsersCount,
      title: "Clients actifs",
    },
    {
      id: 4,
      icon: <BiDollar size={35} color="#316CEA" />,
      number: parseInt(monthlyTotalCommands) + "€",
      title: "Recette mensuelle",
    },
  ];
  const sortedCommands = commands.slice().sort((a, b) => {
    // Priorité sur les statuts
    const statusOrder = { "En attente": 1, "En cours": 2, Livré: 3 };

    const statusA = statusOrder[a.status] || 4; // 4 pour tout autre statut
    const statusB = statusOrder[b.status] || 4;

    if (statusA !== statusB) {
      return statusA - statusB; // Trier d'abord par statut
    }

    // Si les statuts sont les mêmes, trier par date (le plus récent en premier)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const rows = sortedCommands.slice(0, 5).map((command, index) => ({
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
      setStatus(command.status); // Initialiser le statut avec la valeur de la commande
      setOpen(true);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedCommand(null);
    setStatus(""); // Réinitialiser le statut lorsque la modal est fermée
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  const handleUpdateStatus = async () => {
    if (!selectedCommand) return;

    setIsUpdating(true); // Début du chargement

    try {
      await dispatch(putCommand({ id: selectedCommand.id, status })).unwrap();
      toast.success("Statut mis à jour avec succès");
      dispatch(getAllCommands());
      handleCloseModal();
    } catch (error) {
      toast.error("Échec de la mise à jour du statut");
    } finally {
      setIsUpdating(false); // Fin du chargement
    }
  };

  return (
    <div>
      <Header text={"Tableau de bord"} />
      <div className="px-4 sm:px-8 mt-28">
        <div className="flex flex-wrap justify-between items-center space-y-4 md:space-y-0">
          {card.map((item, index) => (
            <div key={index} className="w-full md:w-[48%] lg:w-[23.5%]">
              <DashboardCard
                icon={item.icon}
                number={item.number}
                title={item.title}
              />
            </div>
          ))}
        </div>
        <h1 className="font-semibold text-2xl sm:text-3xl py-5">
          Les commandes récentes
        </h1>

        <Table
          columns={(isMobile) => columns(isMobile, handleOpenModal)}
          rows={rows}
          isMobile={isMobile}
        />
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
                  <Typography variant="h6" className="text-2xl font-semibold">
                    Informations du client
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="text-lg font-medium"
                  >
                    Nom: {selectedCommand.user.name}{" "}
                    {selectedCommand.user.first_name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="text-lg font-medium"
                  >
                    Téléphone: {selectedCommand.user.phone}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="text-lg font-medium"
                  >
                    Email: {selectedCommand.user.email}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="text-lg font-medium"
                  >
                    Sexe: {selectedCommand.user.sexe}
                  </Typography>
                </div>

                <div className="mt-6">
                  {selectedCommand.status === "Livré" ? (
                    <Typography
                      variant="subtitle1"
                      className="text-lg font-medium"
                    >
                      Cette commande a déjà été livrée
                    </Typography>
                  ) :
                    selectedCommand.status === "Annulé" ? (
                      <Typography
                        variant="subtitle1"
                        className="text-lg font-medium"
                      >
                        Cette commande a été annulée
                      </Typography>) :
                      (
                        <FormControl fullWidth>
                          <InputLabel id="status-select-label">Statut</InputLabel>
                          <Select
                            labelId="status-select-label"
                            value={status}
                            onChange={handleStatusChange}
                          >
                            <MenuItem value="En attente">En attente</MenuItem>
                            <MenuItem value="En cours">En cours</MenuItem>
                            <MenuItem value="Livré">Livré</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                </div>

                {selectedCommand.status !== "Livré" &&
                  selectedCommand.status !== "Annulé" && (
                    <div className="mt-6">
                      <Button
                        onClick={handleUpdateStatus}
                        variant="contained"
                        color="primary"
                        className="mt-4 w-full"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Modification en cours..." : "Modifier"}
                      </Button>
                    </div>
                  )}
              </div>
            )}
          </Box>
        </Modal>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Dashboard;
