import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduits } from "../features/products/products";
import Card from "../components/Card";
import { Box, Button, Modal, Typography } from "@mui/material";

const Home = () => {
  const { product } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [saleProduct, setSaleProduct] = useState(null);

  useEffect(() => {
    dispatch(getAllProduits());
  }, [dispatch]);

  useEffect(() => {
    // Rechercher un produit en solde
    const foundSaleProduct = product.find((item) => item.enSolde);
    if (foundSaleProduct) {
      setSaleProduct(foundSaleProduct);

      // Masquer le pop-up après 3 secondes
      const timer = setTimeout(() => {
        setSaleProduct(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [product]);

  // Filtrer les produits pour ne garder que ceux dont le statut est true
  const filteredProducts = product.filter((item) => item.statut);

  return (
    <div className="px-4 sm:px-6 md:px-0">
      <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl my-5 sm:my-7">
        Les <span className="text-customBlue">Produits</span> disponibles
      </h1>
      <div className="flex flex-wrap gap-4">
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

      {/* Pop-up pour le produit en solde */}
      <Modal
        open={!!saleProduct}
        onClose={() => setSaleProduct(null)}
        aria-labelledby="sale-product-title"
        aria-describedby="sale-product-description"
      >
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          {saleProduct && (
            <>
              <Typography id="sale-product-title" variant="h6" component="h2">
                {saleProduct.nom_produit} est un produit à la une!
              </Typography>
              <img
                src={saleProduct.urlsPhotos[0]}
                alt={saleProduct.nom_produit}
                style={{
                  width: "100%",
                  height: "auto",
                  marginTop: 10,
                  borderRadius: 8,
                }}
              />
              <Typography id="sale-product-description" sx={{ mt: 2 }}>
                Prix : {saleProduct.prix_par_unite} €
              </Typography>
              <Button
                onClick={() => setSaleProduct(null)}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Fermer
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
