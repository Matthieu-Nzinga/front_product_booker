import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduits} from "../features/products/products";
import Card from "../components/Card";

const Home = () => {
  const { product } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduits());
  }, [dispatch]);
  return (
    <div className="px-[15%]">
      <h1 className="font-black text-5xl my-7">
        Les <span className="text-customBlue">Produits</span> disponibles
      </h1>
      <div className="flex flex-wrap gap-10">
        {product.map((item, key) =>(
          <Card key={key} image={item.urlphotoproduit} title={item.nom_produit} price={item.prix_par_unite}/>
        ))}
      </div>
    </div>
  );
};

export default Home;
