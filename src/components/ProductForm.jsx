import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { postProduit, getAllProduits } from "../features/products/products"; 

const ProductForm = ({ onClose, category }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

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

  const handleFormSubmit = async (data) => {
    const formDataWithImages = {
      ...data,
      urlsPhotos: imageUrls, 
    };

    try {
      await dispatch(postProduit(formDataWithImages)).unwrap();
      toast.success("Produit ajouté avec succès");
      dispatch(getAllProduits()); 
      if (onClose) onClose(); 
    } catch (error) {
      toast.error("Échec de la création du produit");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 2,
        maxHeight: '80vh',
        overflowY: 'auto',
        padding: '16px'
      }}
    >
      <TextField
        label="Nom"
        {...register("nom_produit", { required: "Nom est requis" })}
        error={!!errors.nom_produit}
        helperText={errors.nom_produit?.message}
        fullWidth
      />
      
      <FormControl fullWidth>
        <InputLabel id="category-label">Type de produit</InputLabel>
        <Select
          labelId="category-label"
          label="Type de produit"
          {...register("categoryId", { required: "Catégorie est requise" })}
          defaultValue=""
        >
          {category?.map((cat) => (
            <MenuItem key={cat?.id} value={cat?.id}>
              {cat?.nom}
            </MenuItem>
          ))}
        </Select>
        {errors.categorie_id && <p className="text-red-700">{errors.categorie_id.message}</p>}
      </FormControl>

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
            <img
              key={index}
              src={url}
              alt={`Preview ${index}`}
              style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
            />
          ))}
        </Box>
      </Box>
      
      <TextField
        label="Prix"
        type="text"
        {...register("prix_par_unite", {
          required: "Prix est requis",
          validate: (value) => {
            const parsedValue = parseFloat(value);
            return !isNaN(parsedValue) || "Le prix doit être un nombre décimal valide";
          },
          setValueAs: (value) => parseFloat(value)
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

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="submit" variant="contained" color="primary">
          AJOUTER LE PRODUIT
        </Button>
        <Button type="button" onClick={onClose} variant="outlined">
          Fermer
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
