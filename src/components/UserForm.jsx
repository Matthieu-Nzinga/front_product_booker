import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, MenuItem, IconButton, InputAdornment } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getAllUsers, postUser } from "../features/users/userSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const UserForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added state to track loading
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch
  } = useForm({
    defaultValues: {
      sexe: '',
      role: '',
      account_number: '',
      password: '',
      confirm_password: ''
    },
  });

  React.useEffect(() => {
    if (getValues("sexe") === undefined) {
      setValue("sexe", "");
    }
    if (getValues("role") === undefined) {
      setValue("role", "");
    }
    if (getValues("account_number") === undefined) {
      setValue("account_number", "");
    }
  }, [getValues, setValue]);

  const handleFormSubmit = async (data) => {
    setLoading(true); // Set loading to true when submission starts
    try {
      await dispatch(postUser({ ...data, password: data.password })).unwrap();
      toast.success("Utilisateur créé avec succès");
      dispatch(getAllUsers());
      if (onClose) onClose();
      reset();
    } catch (error) {
      toast.error("Échec de la création de l'utilisateur");
    } finally {
      setLoading(false); // Reset loading to false when submission finishes
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Watch password and confirm_password fields for real-time validation
  const password = watch("password");
  const confirmPassword = watch("confirm_password");
  const passwordsMatch = password === confirmPassword;

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
        label="Rôle"
        defaultValue=""
        {...register("role", { required: "Rôle est requis" })}
        error={!!errors.role}
        helperText={errors.role?.message}
        fullWidth
      >
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="Client">Client</MenuItem>
      </TextField>
      <TextField
        label="Mot de passe"
        type={showPassword ? "text" : "password"}
        {...register("password", { required: "Mot de passe est requis" })}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirmer le mot de passe"
        type={showConfirmPassword ? "text" : "password"}
        {...register("confirm_password", {
          required: "Confirmation du mot de passe est requise",
          validate: value => value === password || "Les mots de passe ne correspondent pas",
        })}
        error={!!errors.confirm_password}
        helperText={errors.confirm_password?.message}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowConfirmPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading} // Disable button when loading
      >
        {loading ? "Ajout de l'utilisateur en cours..." : "Créer un utilisateur"}
      </Button>
    </Box>
  );
};

export default UserForm;
