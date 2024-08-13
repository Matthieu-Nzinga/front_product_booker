import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";
import { useMediaQuery } from '@mui/material';
import UserForm from "./UserForm";
import { getAllUsers } from "../features/users/userSlice";

const columns = (isMobile) => [
  { field: "firstname", headerName: "Prénom", width: isMobile ? 100 : 140 },
  { field: "name", headerName: "Nom", width: isMobile ? 100 : 140 },
  { field: "email", headerName: "Email", width: isMobile ? 100 : 280 },
  { field: "phone", headerName: "Telephone", width: isMobile ? 100 : 150 },
  { field: "sexe", headerName: "Sexe", width: isMobile ? 100 : 100 },
  { field: "role", headerName: "Rôle", width: isMobile ? 100 : 100 },
  { field: "actions", headerName: "Actions", width: isMobile ? 100 : 200, renderCell: () => <button className="">Action</button> },
];

const UserList = () => {
    const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const rows = user.map((u, index) => ({
    id: u.id || `row-${index + 1}`,
    firstname: u.first_name,
    name: u.name,
    email: u.email,
    phone: u.phone,
    sexe: u.sexe,
    role: u.role
  }));

  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="px-8 mt-28 flex flex-col gap-5 md:ml-0 ">
       <ToastContainer />
      <h2 className='font-black text-3xl block md:hidden'>Les utilisateur</h2>
      <Table columns={columns} rows={rows} isMobile={isMobile}/>
      <div className="flex justify-end">
        <button
          className="text-center font-semibold text-base bg-customBlue px-[107px] text-white py-2 rounded"
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
  )
}

export default UserList