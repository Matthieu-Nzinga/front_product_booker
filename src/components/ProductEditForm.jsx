import React, { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getAllProduits, updateProduct } from "../features/products/products";
import { toast } from "react-toastify";

const ProductEditForm = ({ product, categories, onClose }) => {
  // Initialisez la catégorie par défaut avec l'ID
  const defaultCategoryId =
    categories?.find((cat) => cat.id === product.categoryId)?.id || "";
  const [selectedFiles, setSelectedFiles] = useState([]);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      nom_produit: product?.nom_produit || "",
      prix_par_unite: product?.prix_par_unite || "",
      quantite_en_stock: product?.quantite_en_stock || "",
      description: product?.description || "",
      categoryId: defaultCategoryId,
      urlsPhotos: product?.urlsPhotos || [],
    },
  });

  useEffect(() => {
    // Ne pas créer d'URL pour les images existantes (elles sont déjà des URLs)
    setSelectedFiles([]);
    if (product?.urlsPhotos) {
      setSelectedFiles(product.urlsPhotos);
    }
  }, [product?.urlsPhotos]);
  const onSubmit = async (data) => {
    try {
      // Fonction pour télécharger une seule image sur Cloudinary
      const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "myImage"); // Assurez-vous que 'myImage' est bien votre preset

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/deuutxkyz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Échec du téléchargement sur Cloudinary");
        }

        const cloudinaryData = await response.json();
        return cloudinaryData.secure_url;
      };

      // Téléchargez tous les fichiers sélectionnés et récupérez les URLs
      const uploadedUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileBlob = await fetch(file).then((res) => res.blob());
          return await uploadToCloudinary(fileBlob);
        })
      );

      const parsedQuantity = parseInt(data.quantite_en_stock, 10);

      // Inclure les URLs téléchargées dans urlsPhotos et ajouter l'ID du produit
      const formData = {
        ...data,
        quantite_en_stock: isNaN(parsedQuantity) ? 0 : parsedQuantity,
        urlsPhotos: uploadedUrls,
      };
      const productId = product.id;
      // Envoi des données modifiées
      await dispatch(updateProduct({ formData, productId }));

      // Affichage du message de succès et rafraîchissement des données
      toast.success("Produit modifié avec succès");
      dispatch(getAllProduits());
      onClose();
    } catch (error) {
      // Affichage du message d'erreur en cas d'échec
      console.error("Erreur lors du traitement des images :", error);
      toast.error("Échec de la modification du produit");
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedFiles.length > 5) {
      alert("Vous pouvez sélectionner jusqu'à 5 images au total.");
      return;
    }
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...fileUrls]);
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    // Supprimer de la liste des URLs de photos dans le formulaire
    const currentUrls = getValues("urlsPhotos");
    const updatedUrls = currentUrls.filter((_, i) => i !== index);
    setValue("urlsPhotos", updatedUrls);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <Controller
        className="mt-5"
        name="nom_produit"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nom du produit"
            variant="outlined"
            fullWidth
            required
            error={!!errors.nom_produit}
            helperText={errors.nom_produit ? "Le nom est requis" : ""}
          />
        )}
      />
      <Controller
        name="prix_par_unite"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Prix par unité"
            variant="outlined"
            fullWidth
            required
            type="number"
            inputProps={{ step: 0.01 }}
            error={!!errors.prix_par_unite}
            helperText={errors.prix_par_unite ? "Le prix est requis" : ""}
          />
        )}
      />
      <Controller
        name="quantite_en_stock"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Quantité en stock"
            variant="outlined"
            fullWidth
            required
            type="number"
            error={!!errors.quantite_en_stock}
            helperText={
              errors.quantite_en_stock ? "La quantité est requise" : ""
            }
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description ? "La description est requise" : ""}
          />
        )}
      />
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Catégorie"
            variant="outlined"
            fullWidth
            required
            error={!!errors.categoryId}
            helperText={errors.categoryId ? "La catégorie est requise" : ""}
          >
            {categories?.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.nom}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {/* Affichage des photos sélectionnées */}
      {selectedFiles?.map((file, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src={file}
            alt={`Sélection ${index + 1}`}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleRemoveImage(index)}
          >
            Supprimer
          </Button>
        </Box>
      ))}

      <Button variant="outlined" component="label">
        Sélectionner des images
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </Button>

      <Button type="submit" variant="contained" color="primary">
        Enregistrer les modifications
      </Button>
      <Button variant="outlined" onClick={onClose}>
        Annuler
      </Button>
    </Box>
  );
};

export default ProductEditForm;
