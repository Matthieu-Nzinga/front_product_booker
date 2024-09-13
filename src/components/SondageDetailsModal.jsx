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
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { getAllSondages, hidePopuSondage, postReponse, showPopuSondage } from "../features/products/products";
import { toast } from "react-toastify";

const SondageDetailsModal = ({ sondage, open, onClose, users }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [response, setResponseState] = useState(""); // Pour gérer la réponse Oui/Non
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const userRole = decodedToken.role;  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userResponses, setUserResponses] = useState({ for: [], against: [] });

  useEffect(() => {
    if (sondage && users) {
      const usersFor = [];
      const usersAgainst = [];

      sondage.reponses.forEach((response) => {
        const user = users.find((user) => user.id === response.userId);
        if (response.reponse) {
          usersFor.push(user);
        } else {
          usersAgainst.push(user);
        }
      });

      setUserResponses({ for: usersFor, against: usersAgainst });

    }
  }, [sondage, users]);
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
        sondageId: sondage.id,
        reponse: booleanResponse,
      };
      try {
        await dispatch(postReponse(responseObject)); // Attendre que l'action soit terminée
        dispatch(getAllSondages());
        toast.success("Merci d'avoir participé à ce sondage"); // Afficher le toast
      } catch (error) {
        toast.error("Une erreur est survenue. Veuillez réessayer."); // Afficher un toast en cas d'erreur
      } finally {
        setLoading(false); // Désactiver l'état de chargement
        onClose();
      }
    }
  };

  if (!sondage) return null;

  const totalResponses = sondage.reponses?.length || 0;
  const countFor = userResponses.for.length;
  const countAgainst = userResponses.against.length;

  const handleShowPopup = async () => {
    setLoading(true); // Active le chargement
    try {
      await dispatch(showPopuSondage(sondage.id));
      toast.success("Activation réussie");
      dispatch(getAllSondages());
    } catch (error) {
      toast.error("Échec d'activation");
    } finally {
      setLoading(false); // Désactive le chargement après l'opération
    }
  };
  const handleHidePopup = async () => {
    setLoading(true); // Active le chargement
    try {
      await dispatch(hidePopuSondage(sondage.id));
      toast.success(" Désactvation  réussie");
      dispatch(getAllSondages());
    } catch (error) {
      toast.error("Échec de modification");
    } finally {
      setLoading(false); // Désactive le chargement après l'opération
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
          maxHeight: "80vh", // Hauteur maximale de la modal pour éviter de dépasser la vue
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: "auto", // Activer le défilement vertical si le contenu dépasse
        }}
      >
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
        {/* Affichage du nombre de réponses et de la répartition */}
        { userRole == "Admin" && (sondage.reponses && sondage.reponses.length > 0 && (
          <div>
            <p>
              Pour ce produit, il y a {totalResponses} personne(s) qui ont répondu
              : {countFor} <strong>oui</strong> et {countAgainst} <strong>non</strong>.
            </p>
            <p>
              <strong>Pour:</strong>
              <ul>
                {userResponses.for.map((user, index) => (
                  <li key={index}>{user.first_name} {user.name}</li>
                ))}
              </ul>
            </p>
            <p>
              <strong>Contre:</strong>
              <ul>
                {userResponses.against.map((user, index) => (
                  <li key={index}>{user.first_name} {user.name}</li>
                ))}
              </ul>
            </p>
          </div>
        ))}
        {sondage.user.role === "Client" ? (
          <h2>
            C'est un produit suggéré par {sondage.user.first_name} {sondage.user.name}
          </h2>
        ) : (
          <h2><strong>Nom du produit:</strong> {sondage.nom_produit}</h2>
        )}
        {
          sondage.user.role === "Client" && (
            <h2><strong>Nom du produit:</strong> {sondage.nom_produit}</h2>
          )
         }
        <p><strong>Description:</strong> {sondage.description}</p>
        <p><strong>Message:</strong> {sondage.question}</p>
        <p><strong>Prix:</strong> {sondage.prix}€</p>

        {userRole !== "Admin" && (
          <RadioGroup value={response} onChange={handleResponseChange}>
            <FormControlLabel value="oui" control={<Radio color="primary" />} label="Oui" />
            <FormControlLabel value="non" control={<Radio color="primary" />} label="Non" />
          </RadioGroup>
        )}

        {userRole !== "Admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? "Envoi en cours..." : "Envoyer votre reponse"}
          </Button>
        )}

        <div>
          <strong>Photos:</strong>
          {sondage.urlsPhotos && sondage.urlsPhotos.length > 0 ? (
            <div>
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
          {decodedToken.role === "Admin" && sondage.user.role === "Admin" && (
            sondage.pop_up ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleHidePopup}
                disabled={loading}
                sx={{ marginTop: 2 }}
              >
                {loading ? "En cours..." : "Désactiver la pop up côté client"}
              </Button>
            ) : 
              <Button
                variant="contained"
                color="primary"
                onClick={handleShowPopup}
                disabled={loading}
                sx={{ marginTop: 2 }}
              >
                {loading ? "En cours..." : "Activer la pop up côté client"}
              </Button>
          )}
        </div>
      </Box>
    </Modal>

  );
};

export default SondageDetailsModal;
