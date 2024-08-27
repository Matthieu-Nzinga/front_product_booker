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
      toast.error("Échec de la connexion, veuillez vérifier vos identifiants");
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
        <div className='text-center mb-6 flex flex-col items-center'>
          {/* Utiliser l'image pour le logo */}
          <img src={logoImg} alt="Logo" className='mb-4 h-24 w-auto' /> {/* Augmentez la hauteur selon vos besoins */}
          <h1 className='font-black text-2xl md:text-3xl mb-2'>
            <span className='text-customBlue'>
              TRADING EXPRESSIONS DISTRIBUTION
            </span>
          </h1>
          <h1 className='font-semibold text-xl md:text-2xl'>
            <span>
              Réservez vos produits en toute sécurité
            </span>
          </h1>
        </div>
        <h2 className="font-black text-xl md:text-2xl text-center mb-2">Bienvenue !</h2>
        <p className="text-customGray font-normal text-sm md:text-base text-center mb-4">Connectez-vous pour avoir accès à l’application</p>
        <form
          onSubmit={handleSubmit((data) => handleClick(data))}
          className="flex flex-col gap-4 w-full"
        >
          <input
            type="text"
            {...register("contact", {
              required: "L'e-mail est requis.",
              validate: validateEmailOrPhone
            })}
            className="border rounded-xl outline-none px-4 py-2 w-full"
            placeholder="Email"
          />
          {errors.contact && <p className="text-red-700 text-xs md:text-sm">{errors.contact.message}</p>}

          <input
            type="password"
            {...register("password", { required: "Le mot de passe est requis." })}
            className="border rounded-xl outline-none px-4 py-2 w-full"
            placeholder="Mot de passe"
          />
          {errors.password && <p className="text-red-700 text-xs md:text-sm">{errors.password.message}</p>}

          <span className="text-xs md:text-sm flex justify-between items-center mt-2">
            Mot de passe oublié ?{" "}
            <Link className="text-customBlue font-semibold">Réinitialisez</Link>
          </span>

          <button
            type="submit"
            className="bg-customBlue text-white rounded-xl py-2"
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
