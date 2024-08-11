import React from "react";
import { useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Controls from "./pages/Controls";
import Products from "./pages/Products";
import StockManagement from "./pages/StockManagement";
import Users from "./pages/Users";
import Parameters from "./pages/Parameters";

const unAuthRoutes = [
  {
    path: "/",
    element: <Login />,
  },
];

const authRoutes = [
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
        element: <Controls />,
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

function App() {
  <ToastContainer />;
  const token = useSelector((state) => state.auth.token);

  const routes = token ? authRoutes : unAuthRoutes;
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
