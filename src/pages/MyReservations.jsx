import React, { useEffect } from 'react'
import { getAllCommands } from '../features/products/products';
import { useDispatch, useSelector } from 'react-redux';
import Table from "../components/Table";
import { useMediaQuery } from '@mui/material';
import { format } from 'date-fns';
import { jwtDecode } from "jwt-decode";



const statusColors = {
  "En attente": "#F4BD13", 
  "Livré": "green", 
};

const columns = (isMobile) => [
  { field: "date", headerName: "Date", width: isMobile ? 100 : 150 },
  { field: "nombreProduits", headerName: "Nombre de produits", width: isMobile ? 100 : 150 },
  { field: "prixTotal", headerName: "Prix total", width: isMobile ? 100 : 150 },
  { 
    field: "statut", 
    headerName: "Statut", 
    width: isMobile ? 100 : 150,
    // Ajout de styles conditionnels pour la colonne "statut"
    renderCell: (params) => (
      <div style={{ color: statusColors[params.value] || 'black' }}>
        {params.value}
      </div>
    ),
  },
];

const MyReservations = () => {

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const { commands } = useSelector((state) => state.products) || [];
  const dispatch = useDispatch();


  
  useEffect(() => {
     dispatch(getAllCommands())
  },[])

  const filteredCommands = Array.isArray(commands) 
    ? commands.filter(command => command.userId === userId) 
    : [];


  // Trier les commandes : d'abord par statut ("En attente" en premier), puis par date (plus récent au plus ancien)
  const sortedCommands = filteredCommands.sort((a, b) => {
    if (a.status === 'En attente' && b.status !== 'En attente') return -1;
    if (a.status !== 'En attente' && b.status === 'En attente') return 1;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const rows = sortedCommands.map((command, index) => ({
    id: command.id || `row-${index + 1}`,
    date: command.createdAt ? format(new Date(command.createdAt), 'dd/MM/yyyy') : 'N/A',
    nombreProduits: (command.reservations && command.reservations.length)|| 0,// Nombre total de produits dans la commande
    prixTotal: command.total_commande + " €", // Prix total de la commande
    statut: command.status || 'N/A', // Statut de la commande
  }));

  const isMobile = useMediaQuery('(max-width: 640px)');

  
  return (
    <div className='p-5'>
        <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl my-5 sm:my-7">
        Mes réservations
      </h1>
      <Table columns={columns} rows={rows} isMobile={isMobile}/>
      
      
    </div>
  )
}

export default MyReservations