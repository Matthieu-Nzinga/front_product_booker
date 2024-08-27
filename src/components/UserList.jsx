import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, TextField, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";
import { useMediaQuery } from '@mui/material';
import UserForm from "./UserForm";
import { getAllUsers, updateUserStatus } from "../features/users/userSlice";
import EditIcon from "@mui/icons-material/Edit";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import UserEditForm from "./UserEditForm";

// Fonction pour formater la date et l'heure
const formatDateTime = (dateString, defaultText = "Jamais connecté") => {
  // Vérifier si la date est valide
  if (!dateString) return defaultText; // Valeur par défaut si dateString est null ou undefined

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return defaultText; // Vérifier si la date est invalide

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("fr-FR", options).replace(",", " à");
};

const columns = (isMobile, handleDisableUser, handleActivateUser, handleEditUser) => [
  { field: "first_name", headerName: "Prénom", width: isMobile ? 100 : 150 },
  { field: "name", headerName: "Nom", width: isMobile ? 100 : 130 },
  { field: "email", headerName: "Email", width: isMobile ? 100 : 150 },
  { field: "phone", headerName: "Téléphone", width: isMobile ? 100 : 150 },
  { field: "account_number", headerName: "Numéro de compte", width: isMobile ? 100 : 150 },
  { field: "role", headerName: "Rôle", width: isMobile ? 100 : 100 },
  {
    field: "lastLogin", headerName: "Dernière connexion", width: isMobile ? 140 : 150,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: "lastCommand", headerName: "Dernière commande", width: isMobile ? 140 : 150,
    renderCell: (params) => formatDateTime(params.value, "Jamais commandé"),
  },
  {
    field: "statut",
    headerName: "Statut",
    width: isMobile ? 100 : 120,
    renderCell: (params) => (
      <span className={params.row.statut ? "text-green-500" : "text-red-500"}>
        {params.row.statut ? "Actif" : "Inactif"}
      </span>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: isMobile ? 100 : 200,
    renderCell: (params) => (
      <div className="flex gap-2">
        <Tooltip title="Modifier l'utilisateur">
          <IconButton onClick={() => handleEditUser(params.row)}>
            <EditIcon style={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {params.row.statut ? (
          <Tooltip title="Désactiver l'utilisateur" arrow>
            <IconButton
              onClick={() => handleDisableUser(params.row.id)}
              color="error"
            >
              <DisabledByDefaultIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Activer l'utilisateur" arrow>
            <IconButton
              onClick={() => handleActivateUser(params.row.id)}
              color="success"
            >
              <CheckCircleOutlineOutlinedIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ),
  },
];


const UserList = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Etat pour la recherche
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const sortedUsers = [...user]
    .sort((a, b) => {
      if (a.role === 'Admin' && b.role !== 'Admin') return -1;
      if (a.role !== 'Admin' && b.role === 'Admin') return 1;
      return 0;
    })
    .map((u, index) => ({
      id: u.id || `row-${index + 1}`,
      first_name: u.first_name,
      name: u.name,
      email: u.email,
      phone: u.phone,
      account_number: u.account_number || 'Non spécifié',
      role: u.role,
      lastLogin: u.lastLogin ? u.lastLogin : "Jamais connecté",
      lastCommand: u.lastCommand ? u.lastCommand : "Jamais commandé",
      statut: u.statut,
    }));

  const filteredUsers = sortedUsers.filter(user =>
    user.account_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Gestionnaires de clics pour activer/désactiver les utilisateurs
  const handleDisableUser = (id) => {
    dispatch(updateUserStatus({ id, statut: false }));
    toast.success("Utilisateur désactivé !");
  };

  const handleActivateUser = (id) => {
    dispatch(updateUserStatus({ id, statut: true }));
    toast.success("Utilisateur activé !");
  };
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditOpen(true);
  };


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
        <Table columns={(isMobile) =>
          columns(isMobile,
            handleDisableUser,
            handleActivateUser,
            handleEditUser
          )}
          rows={filteredUsers}
          isMobile={isMobile}
        />
        <div className="flex justify-end">
          <button
            className="text-center mb-4 font-semibold text-base bg-customBlue px-[107px] text-white py-2 rounded"
            onClick={handleOpen}
          >
            Créer un utilisateur
          </button>
        </div>

        <Modal open={open} onClose={handleClose}>
          <Box
            className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] ${isMobile ? 'w-[90vw]' : 'w-[400px]'} bg-white p-4 rounded-lg`}
            sx={{
              maxHeight: isMobile ? '80vh' : '80vh', // Ajuste la hauteur maximale
              overflowY: 'auto', // Ajoute le défilement vertical
            }}
          >
            <div className="flex justify-end">
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <UserForm onClose={handleClose} />
          </Box>
        </Modal>

        <Modal open={editOpen} onClose={() => setEditOpen(false)}>
          <Box
            className={`absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] ${isMobile ? 'w-[90vw]' : 'w-[400px]'
              } bg-white p-4 rounded-lg`}
            sx={{
              maxHeight: '90vh', // Limite la hauteur du modal
              overflowY: 'auto',  // Ajoute le défilement vertical
            }}
          >
            <div className="flex justify-end">
              <IconButton onClick={() => setEditOpen(false)}>
                <CloseIcon />
              </IconButton>
            </div>
            {selectedUser && (
              <UserEditForm
                userData={selectedUser}
                onSubmit={(data) => {
                  // Gérer la mise à jour de l'utilisateur ici (dispatch une action)
                  setEditOpen(false); // Fermer le modal après la mise à jour
                }}
                onClose={() => setEditOpen(false)}
              />
            )}
          </Box>
        </Modal>

      </div>
    </div>
  );
};

export default UserList;
