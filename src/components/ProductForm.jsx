import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getAllProduits, postProduit } from "../features/products/products"; // Assure-toi que le chemin est correct

const ProductForm = ({ onClose }) => {
  const [selectedFileName, setSelectedFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);

      // Upload the image to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'myImage'); // Assure-toi que 'myImage' est bien ton preset

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/deuutxkyz/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        const cloudinaryData = await response.json();
        setImageUrl(cloudinaryData.secure_url);
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image :", error);
      }
    } else {
      setSelectedFileName('');
      setImageUrl('');
    }
  };

  const handleFormSubmit = async (data) => {
    const formDataWithImage = {
      ...data,
      urlphotoproduit: imageUrl, // Assure-toi que le nom de la clé est correct
    };

    try {
      await dispatch(postProduit(formDataWithImage)).unwrap();
      
      toast.success("Produit ajouté avec succès");
      dispatch(getAllProduits()); 
      if (onClose) onClose(); // Ferme le modal si onClose est fourni
    } catch (error) {
      toast.error("Échec de la création du produit");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Nom"
        {...register("nom_produit", { required: "Nom est requis" })}
        error={!!errors.nom_produit}
        helperText={errors.nom_produit?.message}
        fullWidth
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
          width: "100%",
        }}
      >
        <span style={{ flexGrow: 1 }}>
          {selectedFileName || "Image (.png)"}
        </span>
        <IconButton component="label">
          <input
            type="file"
            {...register("image", { required: "Image est requise" })}
            accept="image/png"
            hidden
            onChange={handleFileChange}
          />
          <PhotoCameraIcon />
        </IconButton>
      </Box>
      {errors.image && <p className="text-red-700">{errors.image.message}</p>}
      
      <TextField
        label="Prix"
        type="text"
        {...register("prix_par_unite", {
          required: "Prix est requis",
          validate: (value) => {
            const parsedValue = parseFloat(value);
            return !isNaN(parsedValue) || "Le prix doit être un nombre décimal valide";
          },
          setValueAs: (value) => parseFloat(value) // Convertit la valeur en float avant de la stocker
        })}
        error={!!errors.prix_par_unite}
        helperText={errors.prix_par_unite ? errors.prix_par_unite.message : ""}
      />

      <TextField
        label="Quantité"
        type="number"
        {...register("quantite_en_stock", {
          required: "Quantité est requise",
          valueAsNumber: true,
          validate: (value) => {
            const isInteger = Number.isInteger(value);
            return isInteger || "La quantité doit être un entier";
          }
        })}
        error={!!errors.quantite_en_stock}
        helperText={errors.quantite_en_stock ? errors.quantite_en_stock.message : ""}
      />

      <TextField
        label="Description"
        {...register("description", { required: "Description est requise" })}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        multiline
        rows={3}
      />
      <Button type="submit" variant="contained" color="primary">
        AJOUTER LE PRODUIT
      </Button>
    </Box>
  );
};

export default ProductForm;
