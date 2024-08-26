import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";
import { useMediaQuery } from '@mui/material';
import UserForm from "./UserForm";
import { getAllUsers } from "../features/users/userSlice";

// Fonction pour formater la date et l'heure
const formatDateTime = (dateString) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", options).replace(",", " à");
};

const columns = (isMobile) => [
  { field: "firstname", headerName: "Prénom", width: isMobile ? 100 : 140 },
  { field: "name", headerName: "Nom", width: isMobile ? 100 : 140 },
  { field: "email", headerName: "Email", width: isMobile ? 100 : 280 },
  { field: "phone", headerName: "Téléphone", width: isMobile ? 100 : 150 },
  { field: "accountNumber", headerName: "Numéro de compte", width: isMobile ? 100 : 150 },
  { field: "role", headerName: "Rôle", width: isMobile ? 100 : 100 },
  {
    field: "lastLogin", headerName: "Dernière connexion", width: isMobile ? 140 : 180,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: "status",
    headerName: "Statut",
    width: isMobile ? 100 : 120,
    renderCell: (params) => (
      <span className={params.value ? "text-green-500" : "text-red-500"}>
        {params.value ? "Actif" : "Inactif"}
      </span>
    ),
  },
  { field: "actions", headerName: "Actions", width: isMobile ? 100 : 200, renderCell: () => <button className="">Action</button> },
];

const UserList = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Etat pour la recherche
  const [filteredUsers, setFilteredUsers] = useState([]);
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Trier les utilisateurs pour que les admins apparaissent en premier
  const sortedUsers = [...user]
    .sort((a, b) => {
      if (a.role === 'Admin' && b.role !== 'Admin') return -1;
      if (a.role !== 'Admin' && b.role === 'Admin') return 1;
      return 0;
    })
    .map((u, index) => ({
      id: u.id || `row-${index + 1}`,
      firstname: u.first_name,
      name: u.name,
      email: u.email,
      phone: u.phone,
      accountNumber: u.account_number || 'Non spécifié',
      role: u.role,
      lastLogin: u.lastLogin ? u.lastLogin : "Jamais connecté", // Assurez-vous que `lastLogin` existe et est formaté
      status: u.statut,
    }));
  
  useEffect(() => {
    // Filtrer les utilisateurs en fonction du numéro de compte
    const results = sortedUsers.filter(user =>
      user.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, sortedUsers]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="px-8 flex flex-col gap-5 md:ml-0">
      <div className="px-8 mt-28 flex flex-col gap-5 md:ml-0">
      <ToastContainer />
      <h2 className='font-black text-3xl block md:hidden'>Les utilisateurs</h2>
      <div className="flex justify-end mb-4">
        <TextField
          label="Rechercher par numéro de compte"
          variant="outlined"
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}  // Largeur fixe pour le champ de recherche
        />
      </div>
      <Table columns={columns} rows={filteredUsers} isMobile={isMobile} />
      <div className="flex justify-end">
        <button
          className="text-center mb-4 font-semibold text-base bg-customBlue px-[107px] text-white py-2 rounded"
          onClick={handleOpen}
        >
          Créer un utilisateur
        </button>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] ${isMobile ? 'w-[90vw]' : 'w-[400px]'} bg-white p-4 rounded-lg`}>
          <div className="flex justify-end">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <UserForm onClose={handleClose} />
        </Box>
      </Modal>
    </div>
    </div>
  );
};

export default UserList;
