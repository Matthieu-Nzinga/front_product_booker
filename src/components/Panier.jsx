import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantiteProduit, removeProduitDuPanier, resetPanier } from "../features/panier/panierSlice";
import { jwtDecode } from "jwt-decode";
import { postCommand } from "../features/products/products";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Panier = () => {
  const dispatch = useDispatch();
  const panier = useSelector((state) => state.panier.produits);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleQuantiteChange = (id, quantite) => {
    if (quantite >= 1) {
      dispatch(updateQuantiteProduit({ id, quantite }));
    }
  };

  const handleRemoveProduit = (id) => {
    dispatch(removeProduitDuPanier(id));
  };

  const handleReservation = async () => {
    setIsLoading(true);
    try {
      const totalCommande = panier.reduce(
        (acc, produit) => acc + produit.quantite * produit.prix_par_unite,
        0
      );

      const totalCommandeFloat = parseFloat(totalCommande.toFixed(2)); // Converti en float avec deux décimales

      const produits = panier.map((produit) => ({
        produitId: produit.id,
        prix_vente: produit.quantite * produit.prix_par_unite,
        quantite_commande: produit.quantite,
      }));

      const body = {
        userId: userId,
        produits: produits,
        total_commande: totalCommandeFloat, // Total converti en float avec deux décimales
      };

      await dispatch(postCommand(body)).unwrap();
      toast.success("Réservation réussie !");
      dispatch(resetPanier());
      navigate("/reservations");

    } catch (error) {
      toast.error("Échec de la réservation. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalCommande = panier.reduce(
    (acc, produit) => acc + produit.quantite * produit.prix_par_unite,
    0
  ).toFixed(2); // Affichage avec deux décimales

  const isPanierVide = panier.length === 0;

  return (
    <div className="min-h-screen ">
      <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl my-5 sm:my-7">
        Mon panier ({panier.length})
      </h1>
      <div className="flex flex-col gap-6">
        {panier.map((produit, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 rounded-md shadow-md"
          >
            <img
              src={produit.urlsPhotos[0]}
              alt={`Produit ${produit.nom_produit}`}
              className="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded-md"
            />
            <div className="flex flex-col flex-grow sm:mx-4 mt-4 sm:mt-0">
              <h2 className="text-xl font-bold">{produit.nom_produit}</h2>
              <p className="text-sm text-gray-600">Prix unitaire: {produit.prix_par_unite.toFixed(2)}€</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    handleQuantiteChange(produit.id, produit.quantite - 1)
                  }
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  -
                </button>
                <span className="text-sm text-gray-600">
                  Quantité: {produit.quantite}
                </span>
                <button
                  onClick={() =>
                    handleQuantiteChange(produit.id, produit.quantite + 1)
                  }
                  className="px-2 py-1 bg-green-500 text-white rounded-md"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Prix total: {(produit.quantite * produit.prix_par_unite).toFixed(2)}€
              </p>
            </div>
            <button
              onClick={() => handleRemoveProduit(produit.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md mt-4 sm:mt-0"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col justify-between items-center text-gray-600 text-base font-black">
        <div className="flex items-center w-full justify-between mb-5">
          TOTAL GENERAL
          <span className="text-black text-2xl ml-2">{totalCommande}€</span>
        </div>
        <button
          className={`mt-6 sm:mt-0 bg-customBlue w-full md:w-[50%] text-white rounded-md mb-5 py-3 px-6 ${isLoading ? 'cursor-not-allowed' : ''} ${isPanierVide ? 'opacity-50 bg-gray-500' : ''}`}
          onClick={handleReservation}
          disabled={isLoading || isPanierVide}
        >
          {isLoading ? "Validation en cours..." : "VALIDER VOTRE COMMANDE"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Panier;
