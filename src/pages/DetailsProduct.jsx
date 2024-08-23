import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduits } from "../features/products/products";
import { ajouterAuPanier } from "../features/panier/panierSlice";
import { TextField } from "@mui/material";

const DetailsProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.product);

  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProduits());
    }
  }, [dispatch, products]);

  const product = products.find((item) => item.id === id);

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  const handleAjouterAuPanier = () => {
    const produitPanier = {
      ...product,
      quantite: parseInt(quantite),
    };
    dispatch(ajouterAuPanier(produitPanier));
    navigate("/");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start min-h-screen pt-10 w-full px-4">
      <div className="lg:w-1/2 w-full bg-custom-gradient p-6 lg:p-10 rounded-3xl flex flex-col gap-6 border border-customBlue">
        <div className="flex gap-2 overflow-x-auto mt-4">
          {product.urlsPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(index)}
              className={`text-base font-semibold rounded-full px-4 py-2 transition-colors duration-300 ${
                selectedPhoto === index
                  ? "bg-blue-800 text-white"
                  : "bg-customBlue text-white"
              }`}
            >
              Photo {index + 1}
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-4 bg-white py-6 rounded-xl">
          <img
            src={product.urlsPhotos[selectedPhoto]}
            alt={`Produit ${product.nom_produit} - Photo ${selectedPhoto + 1}`}
            className="w-full h-auto max-h-[40vh] object-contain"
          />
        </div>
      </div>
      <div className="lg:w-1/2 w-full flex flex-col justify-between mt-6 lg:mt-0 lg:pl-10">
        <h1 className="text-4xl lg:text-5xl font-black capitalize">
          {product.nom_produit}
        </h1>
        <p className="text-[#6B6B6B] text-base font-light mt-2">
          {product.description}
        </p>
        <h1 className="text-2xl lg:text-[32px] font-black text-center mt-4">
          {product.prix_par_unite}€
        </h1>
        <div className="w-full flex flex-col gap-4 mt-6">
          <TextField
            label="Quantité à Commander"
            type="number"
            fullWidth
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
          />
          <button
            onClick={handleAjouterAuPanier}
            className="text-base text-white font-semibold bg-customBlue rounded-md px-6 py-3 w-full mb-5"
          >
            AJOUTER AU PANIER
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsProduct;
