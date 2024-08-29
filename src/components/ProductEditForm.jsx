import React, { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getAllProduits, updateProduct } from "../features/products/products";
import { toast } from "react-toastify";

const ProductEditForm = ({ product, category, onClose }) => {
  // Initialisez la catégorie par défaut avec l'ID
  const defaultCategoryId =
    category?.find((cat) => cat.id === product.categoryId)?.id || "";
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // État pour gérer la soumission
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
    setIsSubmitting(true); // Activer l'état de soumission
    try {
      const uploadToCloudinary = async (file) => {
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

        if (!response.ok) {
          throw new Error("Échec du téléchargement sur Cloudinary");
        }

        const cloudinaryData = await response.json();
        return cloudinaryData.secure_url;
      };

      const uploadedUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileBlob = await fetch(file).then((res) => res.blob());
          return await uploadToCloudinary(fileBlob);
        })
      );

      const parsedQuantity = parseInt(data.quantite_en_stock, 10);
      const parsedPrice = parseFloat(data.prix_par_unite);

      const formData = {
        ...data,
        quantite_en_stock: isNaN(parsedQuantity) ? 0 : parsedQuantity,
        prix_par_unite: isNaN(parsedPrice) ? 0 : parsedPrice,
        urlsPhotos: uploadedUrls,
      };
      const productId = product.id;

      await dispatch(updateProduct({ formData, productId }));
      dispatch(getAllProduits());

      toast.success("Produit modifié avec succès");
      onClose();
    } catch (error) {
      toast.error("Échec de la modification du produit");
    } finally {
      setIsSubmitting(false); // Désactiver l'état de soumission après l'opération
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
            {category?.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.nom}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

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

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting} // Désactive le bouton si en cours de soumission
      >
        {isSubmitting ? "Modification en cours..." : "Enregistrer les modifications"}
      </Button>
      <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
        Annuler
      </Button>
    </Box>
  );
};

export default ProductEditForm;
