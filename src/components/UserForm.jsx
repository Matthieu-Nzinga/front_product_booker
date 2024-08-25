import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getAllUsers, postUser } from "../features/users/userSlice";

const UserForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      sexe: '', // Valeur par défaut
      role: '', // Valeur par défaut
      account_number: '' // Valeur par défaut pour le numéro de compte
    },
  });

  React.useEffect(() => {
    if (getValues("sexe") === undefined) {
      setValue("sexe", ""); // Valeur par défaut
    }
    if (getValues("role") === undefined) {
      setValue("role", ""); // Valeur par défaut
    }
    if (getValues("account_number") === undefined) {
      setValue("account_number", ""); // Valeur par défaut
    }
  }, [getValues, setValue]);

  const handleFormSubmit = async (data) => {
  
    try {
      await dispatch(postUser(data)).unwrap();
      toast.success("Utilisateur créé avec succès");
      dispatch(getAllUsers());
      if (onClose) onClose();
      reset();
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
        label="Numéro de compte"
        {...register("account_number", { required: "Numéro de compte est requis" })}
        error={!!errors.account_number}
        helperText={errors.account_number?.message}
        fullWidth
      />
      <TextField
        select
        label="Sexe"
        defaultValue="" // Valeur par défaut
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
        defaultValue="" // Valeur par défaut
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
