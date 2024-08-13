import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduits } from "../features/products/products";
import Card from "../components/Card";

const Home = () => {
  const { product } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduits());
  }, [dispatch]);

  return (
    <div className="px-4 sm:px-6 lg:px-[10%] xl:px-[15%]">
      <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl my-5 sm:my-7">
        Les <span className="text-customBlue">Produits</span> disponibles
      </h1>
      <div className="flex flex-wrap justify-between">
        {product.map((item, key) => (
          <div key={key} className="w-full sm:w-[48%] md:w-[32%] mb-5">
            <Card image={item.urlphotoproduit} title={item.nom_produit} price={item.prix_par_unite} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
