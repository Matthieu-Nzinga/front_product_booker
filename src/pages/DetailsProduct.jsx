import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduits } from "../features/products/products";

const DetailsProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.product);

  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    // Dispatch action to fetch products if not already loaded
    if (products.length === 0) {
      dispatch(getAllProduits());
    }
  }, [dispatch, products]);

  // Find the product when products are available
  const product = products.find((item) => item.id === id);

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen pt-10">
      <div className="max-w-lg bg-custom-gradient p-10 rounded-3xl flex flex-col gap-6 border border-customBlue">
        <h1 className="text-3xl font-black text-center">{product.nom_produit}</h1>
        <p className="text-lg text-center">{product.description}</p>

        <div className="flex gap-2 overflow-x-auto mt-4">
          {product.urlsPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(index)}
              className={`text-base font-semibold rounded-full px-6 py-2 transition-colors duration-300 ${selectedPhoto === index ? "bg-blue-800 text-white" : "bg-customBlue text-white"}`}
            >
              Photo {index + 1}
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <img
            src={product.urlsPhotos[selectedPhoto]}
            alt={`Produit ${product.nom_produit} - Photo ${selectedPhoto + 1}`}
            className="w-full h-auto max-h-[50vh] object-contain rounded-xl"
          />
        </div>

        <div className="flex justify-between items-center mt-5">
          <h1 className="text-2xl font-semibold">{product.prix_par_unite}€</h1>
          <button className="text-base text-white font-semibold bg-customBlue rounded-full px-6 py-1">
            Réserver le produit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsProduct;
