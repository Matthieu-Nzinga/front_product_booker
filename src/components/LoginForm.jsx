import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userLogin } from "../features/auth/authSlice";

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
      await dispatch(userLogin(loginData)).unwrap();
      reset();
    } catch (error) {
      toast.error("Échec de la connexion, veuillez vérifier vos identifiants");
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
    <div className=" flex flex-col justify-center gap-4 items-center w-full">
      <ToastContainer />
      <h2 className="font-black text-[32px] text-center ">Bienvenue !</h2>
      <p className="text-customGray font-normal text-base text-center">Connectez-vous pour avoir accès à l’application</p>
      <form
        onSubmit={handleSubmit((data) => handleClick(data))}
        className="flex flex-col justify-center gap-4 w-full px-4 md:px-28"
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
        {errors.contact && <p className="text-red-700">{errors.contact.message}</p>}

        <input
          type="password"
          {...register("password", { required: "Le mot de passe est requis." })}
          className="border rounded-xl outline-none px-4 py-2 w-full"
          placeholder="Mot de passe"
        />
        {errors.password && <p className="text-red-700">{errors.password.message}</p>}
        
        <span className="text-sm mt-[-10px] flex gap-1">
          Mot de passe oublié ? {" "}
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
  );
};

export default LoginForm;
