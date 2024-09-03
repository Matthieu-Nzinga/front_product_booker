import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduits, getAllSondages, postReponse } from "../features/products/products";
import Card from "../components/Card";
import { Box, Button, FormControlLabel, IconButton, Modal, Radio, RadioGroup, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from "react-toastify";
import { getAllUsers } from "../features/users/userSlice";

const Home = () => {
  const { product, sondages } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [saleProduct, setSaleProduct] = useState(null);
  const [selectedSondage, setSelectedSondage] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [response, setResponseState] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSondageSaved, setIsSondageSaved] = useState(false);
  const { user } = useSelector((state) => state.users);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    dispatch(getAllProduits());
    dispatch(getAllSondages());
    dispatch(getAllUsers());
  }, [dispatch]);
  useEffect(() => {
    // Vérifier si le pop-up a déjà été affiché pour le sondage
    const sondagePopupShown = localStorage.getItem("sondagePopupShown");

    // Rechercher un sondage avec pop_up == true s'il n'a pas encore été affiché
    if (!sondagePopupShown) {
      const sondageWithPopup = filteredSondages.find(sondage => sondage.pop_up === true);
      if (sondageWithPopup) {
        setSelectedSondage(sondageWithPopup);
        localStorage.setItem("sondagePopupShown", "true"); // Enregistrer l'état
      }
    }
  }, [sondages]);

  useEffect(() => {
    // Vérifier si le pop-up a déjà été affiché pour le produit en solde
    const saleProductPopupShown = localStorage.getItem("saleProductPopupShown");

    // Rechercher un produit en solde s'il n'a pas encore été affiché
    if (!saleProductPopupShown) {
      const foundSaleProduct = filteredProducts.find((item) => item.enSolde);
      if (foundSaleProduct) {
        setSaleProduct(foundSaleProduct);
        localStorage.setItem("saleProductPopupShown", "true"); // Enregistrer l'état
      }
    }
  }, [product]);

  // Filtrer les produits pour ne garder que ceux dont le statut est true
  const filteredProducts = product.filter((item) => item.statut);

  // Filtrer les sondages pour n'afficher que ceux dont l'utilisateur n'a pas encore répondu
  // et où le sondage est associé à un utilisateur dont le role est Admin et userId est différent
  const filteredSondages = sondages.filter((sondage) => {
    return (
      sondage?.reponses?.every(response => response.userId !== userId) &&
      sondage.user.userId !== userId &&
      sondage.user.role === "Admin" &&
      sondage.statut === true
    );
  });
  
  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
  };

  const handleResponseChange = (event) => {
    setResponseState(event.target.value);
  };

  const handleSave = async () => {
    if (response) {
      setLoading(true); // Activer l'état de chargement

      const booleanResponse = response === "oui";
      const responseObject = {
        userId: userId,
        sondageId: selectedSondage.id, // Correction pour utiliser selectedSondage au lieu de sondage
        reponse: booleanResponse,
      };
      try {
        await dispatch(postReponse(responseObject)); // Attendre que l'action soit terminée
        toast.success("Merci d'avoir participé à ce sondage"); // Afficher le toast
        dispatch(getAllSondages());
        setIsSondageSaved(true); // Marquer le sondage comme sauvegardé

        // Fermer le modal et réinitialiser selectedSondage
        setSelectedSondage(null);

      } catch (error) {
        toast.error("Une erreur est survenue. Veuillez réessayer."); // Afficher un toast en cas d'erreur
      } finally {
        setLoading(false); // Désactiver l'état de chargement
      }
    }
  };

  const handleCloseSondageModal = () => {
    setIsSondageSaved(false); // Réinitialiser l'état après la fermeture
  };

  return (
    <div className="px-4 sm:px-6 md:px-0">
      <ToastContainer />
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

      {/* Pop-up pour le sondage */}
      {selectedSondage && (
        <Modal
          open={!!selectedSondage}
          onClose={handleCloseSondageModal}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 500,
              maxHeight: "80vh",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              overflowY: "auto",
            }}
          >
            <IconButton
              onClick={handleCloseSondageModal}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="h2">
              Détails du sondage
            </Typography>
            <h2>
              <strong>Nom du produit:</strong> {selectedSondage.nom_produit}
            </h2>
            <p><strong>Description:</strong> {selectedSondage.description}</p>
            <p><strong>Message:</strong> {selectedSondage.question}</p>
            <p><strong>Prix:</strong> {selectedSondage.prix}€</p>
            <RadioGroup value={response} onChange={handleResponseChange}>
              <FormControlLabel value="oui" control={<Radio color="primary" />} label="Oui" />
              <FormControlLabel value="non" control={<Radio color="primary" />} label="Non" />
            </RadioGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ marginTop: 2 }}
            >
              Sauvegarder
            </Button>
            <div>
              <strong>Photos:</strong>
              {selectedSondage.urlsPhotos && selectedSondage.urlsPhotos.length > 0 ? (
                <div>
                  <div>
                    {selectedSondage.urlsPhotos.map((url, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        color={"primary"}
                        onClick={() => handlePhotoClick(index)}
                        sx={{ marginRight: 1, marginBottom: 1 }}
                      >
                        Photo {index + 1}
                      </Button>
                    ))}
                  </div>

                  <img
                    src={selectedSondage.urlsPhotos[selectedPhotoIndex]}
                    alt={`Photo ${selectedPhotoIndex + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "300px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                </div>
              ) : (
                <p>Aucune photo disponible</p>
              )}
            </div>
          </Box>
        </Modal>
      )}

      {/* Pop-up pour le produit en solde */}
      {!selectedSondage && (
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
              width: { xs: '90%', sm: 400 }, // Responsive width
              maxHeight: '80vh', // Height limit for scroll
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
              overflowY: 'auto', // Enable vertical scroll if needed
            }}
          >
            <Typography id="sale-product-title" variant="h6" component="h2">
              {saleProduct?.nom_produit} est un produit à la une!
            </Typography>
            <img
              src={saleProduct?.urlsPhotos[0]}
              alt={saleProduct?.nom_produit}
              style={{
                width: "100%",
                height: "auto",
                marginTop: 10,
                borderRadius: 8,
              }}
            />
            <Typography id="sale-product-description" sx={{ mt: 2 }}>
              Prix : {saleProduct?.prix_par_unite} €
            </Typography>
            <Button
              onClick={() => setSaleProduct(null)}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Fermer
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Home;
