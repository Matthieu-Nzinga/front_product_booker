import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { getAllSondages, postSondage } from "../features/products/products";
import { toast } from "react-toastify";

const SondageForm = ({ handleClose, title }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const dispatch = useDispatch();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (imageUrls.length >= 5) {
      toast.error("Vous ne pouvez télécharger que jusqu'à 5 images.");
      return;
    }

    setSelectedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "myImage");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/deuutxkyz/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await response.json();
      setImageUrls((prevUrls) => [...prevUrls, cloudinaryData.secure_url]);
      setSelectedFileName("");
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
      toast.error("Erreur lors du téléchargement de l'image");
    }
  };

  const handleDeleteImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formDataWithImages = {
      ...data,
      urlsPhotos: imageUrls,
      userId,
    };

    try {
      await dispatch(postSondage(formDataWithImages)).unwrap();
       if (decodedToken.role === "Client") {
         toast.success("Merci de nous avoir suggéré ce produit. Nous reviendrons vers vous rapidement.");
       } else {
         toast.success("Sondage créé avec succès");
       }
      dispatch(getAllSondages())
      handleClose(); // Ferme le modal après soumission
    } catch (error) {
      toast.error("Erreur lors de la création du sondage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <TextField
        fullWidth
        label="Nom du produit"
        variant="outlined"
        margin="normal"
        {...register("nom_produit", {
          required: "Le nom du produit est requis",
        })}
        error={!!errors.nom_produit}
        helperText={errors.nom_produit ? errors.nom_produit.message : ""}
      />
      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        margin="normal"
        {...register("description", { required: "La Description est requise" })}
        error={!!errors.description}
        helperText={errors.description ? errors.description.message : ""}
      />
      <TextField
        fullWidth
        label="Message"
        variant="outlined"
        margin="normal"
        {...register("question", { required: "La Question est requise" })}
        error={!!errors.question}
        helperText={errors.question ? errors.question.message : ""}
      />
      <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        label="A quel prix aimeriez-vous acheter ce produit?"
        type="number"
        {...register("prix", {
          required: "Prix est requis",
          valueAsNumber: true,
          validate: (value) => {
            const parsedValue = parseFloat(value);
            return (
              !isNaN(parsedValue) ||
              "Le prix doit être un nombre décimal valide"
            );
          },
          setValueAs: (value) => parseFloat(value),
        })}
        error={!!errors.prix_par_unite}
        helperText={errors.prix_par_unite ? errors.prix_par_unite.message : ""}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
          width: "100%",
        }}
      >
        <span>{selectedFileName || "Aucune image sélectionnée"}</span>
        <IconButton component="label">
          <input
            type="file"
            accept="image/png"
            hidden
            onChange={handleFileChange}
          />
          <PhotoCameraIcon />
        </IconButton>
        <Button
          type="button"
          onClick={() => document.querySelector('input[type="file"]').click()}
          variant="outlined"
        >
          Ajouter une autre image
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {imageUrls.map((url, index) => (
            <Box
              key={index}
              sx={{ position: "relative", display: "inline-block" }}
            >
              <img
                src={url}
                alt={`Preview ${index}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <IconButton
                onClick={() => handleDeleteImage(index)}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  color: "red",
                  backgroundColor: "white",
                  padding: "2px",
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enregistrement en cours" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default SondageForm;
