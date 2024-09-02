import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userLogin } from "../features/auth/authSlice";

// Importer l'image du logo depuis le dossier public
import logoImg from '../../public/logo.png'; // Mettez à jour le chemin si nécessaire

const LoginForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleClick = async (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    let loginData = {};
    if (emailRegex.test(data.contact)) {
      loginData.email = data.contact;
    } else if (phoneRegex.test(data.contact)) {
      loginData.phone = data.contact;
    } else {
      toast.error("Veuillez entrer une adresse e-mail ou un numéro de téléphone valide.");
      return;
    }

    loginData.password = data.password;

    setLoading(true);
    try {
      const response = await dispatch(userLogin(loginData)).unwrap();

      if (!response) {  // Vérifie la réponse pour gérer d'éventuelles erreurs
        throw new Error('Échec de la connexion');
      }

      reset();
    } catch (error) {
      toast.error(error.message);
      reset();
    } finally {
      setLoading(false);
    }
  };


  const validateEmailOrPhone = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;
    return emailRegex.test(value) || phoneRegex.test(value) || "Veuillez entrer une adresse e-mail ou un numéro de téléphone valide.";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <ToastContainer />
        <div className="text-center mb-6 flex flex-col items-center">
          {/* Utilisation de l'image pour le logo */}
          <img src={logoImg} alt="Logo" className="mb-4 h-20 w-auto sm:h-24" />
          <h1 className="font-black text-xl sm:text-2xl md:text-3xl mb-2">
            <span className="text-customBlue">TRADING EXPRESSIONS DISTRIBUTION</span>
          </h1>
          <h1 className="font-semibold text-lg sm:text-xl md:text-2xl">
            <span>Réservez vos produits en toute sécurité</span>
          </h1>
        </div>
        <h2 className="font-black text-lg sm:text-xl md:text-2xl text-center mb-2">Bienvenue !</h2>
        <p className="text-customGray font-normal text-xs sm:text-sm md:text-base text-center mb-4">
          Connectez-vous pour avoir accès à l’application
        </p>
        <form
          onSubmit={handleSubmit((data) => handleClick(data))}
          className="flex flex-col gap-4 w-full"
        >
          <input
            type="text"
            {...register("contact", {
              required: "L'e-mail est requis.",
              validate: validateEmailOrPhone,
            })}
            className="border rounded-xl outline-none px-4 py-2 w-full text-xs sm:text-sm md:text-base"
            placeholder="Email"
          />
          {errors.contact && (
            <p className="text-red-700 text-xs sm:text-sm md:text-base">{errors.contact.message}</p>
          )}

          <input
            type="password"
            {...register("password", { required: "Le mot de passe est requis." })}
            className="border rounded-xl outline-none px-4 py-2 w-full text-xs sm:text-sm md:text-base"
            placeholder="Mot de passe"
          />
          {errors.password && (
            <p className="text-red-700 text-xs sm:text-sm md:text-base">{errors.password.message}</p>
          )}

          <span className="text-xs sm:text-sm md:text-base flex justify-between items-center mt-2">
            Mot de passe oublié ?{" "}
            <Link className="text-customBlue font-semibold">Réinitialisez</Link>
          </span>

          <button
            type="submit"
            className="bg-customBlue text-white rounded-xl py-2 text-xs sm:text-sm md:text-base"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>

  );
};

export default LoginForm;
