import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";



const SondageForm = ({ handleClose }) => {
    const [imageUrls, setImageUrls] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

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
      formData.append('file', file);
      formData.append('upload_preset', 'myImage');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/deuutxkyz/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const cloudinaryData = await response.json();
      setImageUrls(prevUrls => [...prevUrls, cloudinaryData.secure_url]);
      setSelectedFileName('');
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
    }
  };

  const handleDeleteImage = (index) => {
    setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  

  const onSubmit = (data) => {
    const formDataWithImages = {
        ...data,
        urlsPhotos: imageUrls, 
      };
    console.log(data); // Vous pouvez traiter les données du formulaire ici
    handleClose(); // Ferme le modal après soumission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Créer un sondage</h2>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <TextField
        fullWidth
        label="Nom du produit"
        variant="outlined"
        margin="normal"
        {...register("nom_produit", { required: "Le nom du produit est requis" })}
        error={!!errors.nom_produit}
        helperText={errors.nom_produit ? errors.nom_produit.message : ""}
      />
      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        margin="normal"
        {...register("description", { required: "Le Description est requis" })}
        error={!!errors.description}
        helperText={errors.description ? errors.description.message : ""}
      />
      <TextField
        fullWidth
        label="Question"
        variant="outlined"
        margin="normal"
        {...register("question", { required: "La Question est requis" })}
        error={!!errors.question}
        helperText={errors.question ? errors.question.message : ""}
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
        <span>
          {selectedFileName || "Aucune image sélectionnée"}
        </span>
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

        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap" }}>
          {imageUrls.map((url, index) => (
            <Box key={index} sx={{ position: "relative", display: "inline-block" }}>
              <img
                src={url}
                alt={`Preview ${index}`}
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
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
        >
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default SondageForm;
