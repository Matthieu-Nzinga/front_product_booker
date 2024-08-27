import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, Typography, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
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
    "Livré": "green",
    "En cours": "black", // Changer la couleur pour "En cours"
};


const columns = (isMobile, handleViewDetails) => [
    { field: "date", headerName: "Date", width: isMobile ? 100 : 150 },
    {
        field: "nombreProduits",
        headerName: "Nombre de produits",
        width: isMobile ? 100 : 260,
    },
    { field: "prixTotal", headerName: "Prix total", width: isMobile ? 100 : 150 },
    {
        field: "statut",
        headerName: "Statut",
        width: isMobile ? 100 : 150,
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

const Commands = () => {
    const { commands } = useSelector((state) => state.products) || [];
    const dispatch = useDispatch();
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(""); // Ajouter l'état pour le statut
    const isMobile = useMediaQuery("(max-width: 640px)");

    useEffect(() => {
        dispatch(getAllCommands());
    }, [dispatch]);

    // Filtrer et trier les commandes
    const sortedCommands = commands
        .slice()
        .sort((a, b) => {
            // Priorité sur les statuts
            const statusOrder = { "En attente": 1, "En cours": 2, "Livré": 3 };

            const statusA = statusOrder[a.status] || 4; // 4 pour tout autre statut
            const statusB = statusOrder[b.status] || 4;

            if (statusA !== statusB) {
                return statusA - statusB; // Trier d'abord par statut
            }

            // Si les statuts sont les mêmes, trier par date (le plus récent en premier)
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

        try {
            await dispatch(putCommand({ id: selectedCommand.id, status })).unwrap();
            toast.success("Statut mis à jour avec succès");
            dispatch(getAllCommands());
            handleCloseModal();
        } catch (error) {
            toast.error("Échec de la mise à jour du statut");
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
                                <Typography variant="subtitle1" className="text-lg font-medium">
                                    Nom: {selectedCommand.user.name} {selectedCommand.user.first_name}
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

                            <div className="mt-6">
                                {selectedCommand.status === "Livré" ? (
                                    <Typography variant="subtitle1" className="text-lg font-medium">
                                        Cette commande a déjà été livrée
                                    </Typography>
                                ) : (
                                    <FormControl fullWidth>
                                        <InputLabel id="status-select-label">Statut</InputLabel>
                                        <Select
                                            labelId="status-select-label"
                                            value={status}
                                            onChange={handleStatusChange}
                                        >
                                            <MenuItem value="En cours">En cours</MenuItem>
                                            <MenuItem value="Livré">Livré</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            </div>

                            {selectedCommand.status !== "Livré" && (
                                <div className="mt-6">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdateStatus}
                                        disabled={selectedCommand.status === status}
                                    >
                                        Modifier
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Box>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default Commands;
