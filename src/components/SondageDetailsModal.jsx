import {
  Box,
  Modal,
  IconButton,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { getAllSondages, postReponse } from "../features/products/products";
import { toast } from "react-toastify";

const SondageDetailsModal = ({ sondage, open, onClose }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [response, setResponseState] = useState(""); // Pour gérer la réponse Oui/Non
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const userRole = decodedToken.role;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  if (!sondage) return null;

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
  };

  const handleResponseChange = (event) => {
    const newResponse = event.target.value;
    setResponseState(newResponse);
  };

  const handleSave = async () => {
    if (response) {
      setLoading(true); // Activer l'état de chargement

      const booleanResponse = response === "oui";
      const responseObject = {
        userId: userId,
        sondageId: sondage.id,
        reponse: booleanResponse,
      };
      try {
        await dispatch(postReponse(responseObject)); // Attendre que l'action soit terminée
        dispatch(getAllSondages())
        toast.success("Merci d'avoir participé à ce sondage"); // Afficher le toast
      } catch (error) {
        toast.error("Une erreur est survenue. Veuillez réessayer."); // Afficher un toast en cas d'erreur
      } finally {
        setLoading(false); // Désactiver l'état de chargement
        onClose();
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Display title based on user role */}
        {sondage.user.role === "Client" ? (
          <h2>
            C'est un produit suggéré par {sondage.user.first_name}{" "}
            {sondage.user.name}
          </h2>
        ) : (
          <h2>{sondage.nom_produit}</h2>
        )}

        <p>
          <strong>Description:</strong> {sondage.description}
        </p>
        <p>
          <strong>Question:</strong> {sondage.question}
        </p>
        {/* Radio buttons for roles other than Admin */}
        {userRole !== "Admin" && (
          <RadioGroup value={response} onChange={handleResponseChange}>
            <FormControlLabel
              value="oui"
              control={<Radio color="primary" />}
              label="Oui"
            />
            <FormControlLabel
              value="non"
              control={<Radio color="primary" />}
              label="Non"
            />
          </RadioGroup>
        )}
        {/* Save Button */}
        {userRole !== "Admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading} // Désactiver le bouton pendant le chargement
            sx={{ marginTop: 2 }}
          >
            {loading ? "Enregistrement en cours..." : "Sauvegarder"}
          </Button>
        )}
        <div>
          <strong>Photos:</strong>
          {sondage.urlsPhotos && sondage.urlsPhotos.length > 0 ? (
            <div>
              {/* Buttons to select photos */}
              <div>
                {sondage.urlsPhotos.map((url, index) => (
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

              {/* Display the selected photo */}
              <img
                src={sondage.urlsPhotos[selectedPhotoIndex]}
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
  );
};

export default SondageDetailsModal;
