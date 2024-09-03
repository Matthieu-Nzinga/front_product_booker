import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetPassword } from "../features/auth/authSlice";
import { useState } from "react";

const ResetPasswordForm = () => {

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
            toast.error("Veuillez entrer une adresse e-mail valide.");
            return;
        }

        loginData.password = data.password;

        setLoading(true);
        try {
            const response = await dispatch(resetPassword(loginData)).unwrap();
            
            toast.success("Mot de passe réinitialisé avec succès. Veuillez vérifier votre email pour voir le nouveau mot de passe.");
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
                <span className="text-xs sm:text-sm md:text-base flex justify-between items-center mt-2">
                    Mot de passe oublié ?
                </span>
                <p className="text-customGray font-normal text-xs sm:text-sm md:text-base text-center mb-4">
                   Veuillez saisir votre adresse e-mail 
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

                    <button
                        type="submit"
                        className="bg-customBlue text-white rounded-xl py-2 text-xs sm:text-sm md:text-base"
                        disabled={loading}
                    >
                        {loading ? "Envoi en cours..." : "Envoyer"}
                    </button>
                    <span className="text-xs sm:text-sm md:text-base flex justify-between items-center mt-2">
                        Avez-vous déjà un compte ?{" "}
                        <Link to="/" className="text-customBlue font-semibold">Connectez-vous ici</Link>
                    </span>
                </form>
            </div>
        </div>

    );
}

export default ResetPasswordForm