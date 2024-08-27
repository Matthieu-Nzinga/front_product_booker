

import React from "react";
import { useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import StockManagement from "./pages/StockManagement";
import Users from "./pages/Users";
import Parameters from "./pages/Parameters";
import LayoutClient from "./pages/LayoutClient";
import Home from "./pages/Home";
import Basket from "./pages/Basket";
import MyReservations from "./pages/MyReservations";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import DetailsProduct from "./pages/DetailsProduct";
import Commands from "./pages/Commands";


const unAuthRoutes = [
  {
    path: "/",
    element: <Login />,
  },
];

const adminRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "Commandes",
        element: <Commands />,
      },
      {
        path: "stock",
        element: <StockManagement />,
      },
      {
        path: "utilisateurs",
        element: <Users />,
      },
      {
        path: "parameters",
        element: <Parameters />,
      },
    ],
  },
];

const clientRoutes = [
  {
    path: "/",
    element: <LayoutClient />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "reservations",
        element: <MyReservations />,
      },
      {
        path: "panier",
        element: <Basket />,
      },
      {
        path: "product/:id", // Ajout de la route pour afficher les détails d'un produit
        element: <DetailsProduct />,
      },
    ],
  },
];

function App() {
  const token = useSelector((state) => state.auth.token);

  
  let role = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    role = decodedToken.role; 
  }

  let routes = unAuthRoutes;

  if (token) {
    routes = role === "Admin" ? adminRoutes : clientRoutes;
  }

  const router = createBrowserRouter(routes);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
