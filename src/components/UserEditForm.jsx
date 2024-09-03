import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Button, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, updateUser } from "../features/users/userSlice";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; 

const UserEditForm = ({ userData, onClose }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);
    const currentUser = user?.find(user => user.id === userData.id);
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    const isClient = decodedToken?.role === "Client";
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            ...currentUser || userData,
            password: '',
            confirmPassword: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const password = watch("password");

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleFormSubmit = async (data) => {
        setLoading(true);
        const { confirmPassword, ...filteredData } = data;
        try {
            await dispatch(updateUser({ formData: filteredData })).unwrap();
            toast.success("L'utilisateur a été modifié avec succès !");
            onClose();  // Ferme le modal en cas de succès
        } catch (error) {
            toast.error("La mise à jour a échoué.");
        } finally {
            setLoading(false);
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
                {...register("first_name", {
                    required: "Prénom est requis",
                    minLength: { value: 4, message: "Le prénom doit comporter au moins 4 caractères" }
                })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                fullWidth
                disabled={isClient}
            />
            <TextField
                label="Nom"
                {...register("name", {
                    required: "Nom est requis",
                    minLength: { value: 4, message: "Le nom doit comporter au moins 4 caractères" }
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                disabled={isClient}
            />
            <TextField
                label="Email"
                type="email"
                {...register("email", { required: "Email est requis" })}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                disabled={isClient}
            />
            <TextField
                label="Téléphone"
                {...register("phone", { required: "Téléphone est requis" })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                fullWidth
                disabled={isClient}
            />
            <TextField
                label="Numéro de compte"
                {...register("account_number", { required: "Numéro de compte est requis" })}
                error={!!errors.account_number}
                helperText={errors.account_number?.message}
                fullWidth
                disabled={isClient}
            />
            <TextField
                select
                label="Rôle"
                defaultValue={currentUser?.role || userData.role || ""}
                {...register("role", { required: "Rôle est requis" })}
                error={!!errors.role}
                helperText={errors.role?.message}
                fullWidth
                disabled={isClient}
            >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Client">Client</MenuItem>
            </TextField>
            <TextField
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                    required: "Mot de passe est requis",
                    minLength: { value: 5, message: "Le mot de passe doit comporter au moins 5 caractères" }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
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
                {...register("confirmPassword", {
                    required: "Confirmation du mot de passe est requise",
                    validate: value => value === password || "Les mots de passe ne correspondent pas"
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                disabled={loading} // Désactiver le bouton lors de la soumission
            >
                {loading ? "Mise à jour en cours..." : "Mettre à jour l'utilisateur"}
            </Button>
        </Box>
    );
};

export default UserEditForm;
