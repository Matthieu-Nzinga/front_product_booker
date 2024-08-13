import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, IconButton, MenuItem } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getAllUsers, postUser } from "../features/users/userSlice";

const UserForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      await dispatch(postUser(data)).unwrap();

      toast.success("Utilisateur crée avec succès");
      dispatch(getAllUsers());
      if (onClose) onClose();
    } catch (error) {
      toast.error("Échec de la création de l'utilisateur");
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Prénom"
        {...register("first_name", { required: "Prénom est requis" })}
        error={!!errors.first_name}
        helperText={errors.first_name?.message}
        fullWidth
      />
      <TextField
        label="Nom"
        {...register("name", { required: "Nom est requis" })}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
      />
      <TextField
        label="Email"
        type="email"
        {...register("email", { required: "Email est requis" })}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />
      <TextField
        label="Téléphone"
        {...register("phone", { required: "Téléphone est requis" })}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
      />

      <TextField
        select
        label="Sexe"
        {...register("sexe", { required: "Sexe est requis" })}
        error={!!errors.sexe}
        helperText={errors.sexe?.message}
        fullWidth
      >
        <MenuItem value="Femme">Femme</MenuItem>
        <MenuItem value="Homme">Homme</MenuItem>
      </TextField>

      <TextField
        select
        label="Rôle"
        {...register("role", { required: "Rôle est requis" })}
        error={!!errors.role}
        helperText={errors.role?.message}
        fullWidth
      >
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="Client">Client</MenuItem>
      </TextField>

      <Button type="submit" variant="contained" color="primary">
        Créer un utilisateur
      </Button>
    </Box>
  );
};

export default UserForm;
