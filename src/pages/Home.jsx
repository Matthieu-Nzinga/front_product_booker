import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduits } from "../features/products/products";
import Card from "../components/Card";

const Home = () => {
  const { product } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduits());
  }, [dispatch]);

  // Filtrer les produits pour ne garder que ceux dont le statut est true
  const filteredProducts = product.filter(item => item.statut);

  return (
    <div className="px-4 sm:px-6">
      <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl my-5 sm:my-7">
        Les <span className="text-customBlue">Produits</span> disponibles
      </h1>
      <div className="flex flex-wrap justify-between">
        {filteredProducts.map((item, key) => (
          <div key={key} className="w-full sm:w-[48%] md:w-[32%] mb-5">
            <Card 
              images={item.urlsPhotos} 
              title={item.nom_produit} 
              id={item.id} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
