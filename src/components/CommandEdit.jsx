import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllCommands, updateCommand } from '../features/products/products';

const CommandEdit = ({ command, onClose }) => {
    const { commands } = useSelector((state) => state.products) || [];
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [localCommand, setLocalCommand] = useState(command);

    const handleUpdate = async () => {
        setIsLoading(true); // Début de la mise à jour, état de chargement activé

        const produits = localCommand.reservations.map((reservation) => ({
            produitId: reservation.produit?.id,
            quantite_commande: reservation.quantite_commande,
            prix_vente: parseFloat((reservation.quantite_commande * reservation.produit?.prix_par_unite).toFixed(2)),
        }));

        const updatedData = {
            id: localCommand.id, // ID de la commande
            total_commande: parseFloat(formattedTotal), // Convertir le total général en float
            produits, // Tableau des produits avec les détails
        };

        try {
            // Dispatch l'action pour mettre à jour la commande
            await dispatch(updateCommand(updatedData));

            // Afficher un toast de succès
            toast.success('La commande a été modifiée avec succès !');
            dispatch(getAllCommands())
            onClose(); // Fermer le formulaire après la mise à jour réussie
        } catch (error) {
            // Afficher un toast d'erreur
            toast.error('Une erreur est survenue lors de la modification de la commande.');
        } finally {
            setIsLoading(false); // Réinitialisation de l'état de chargement
        }
    };

    const handleQuantiteChange = (reservationId, newQuantite) => {
        if (newQuantite < 1) return; // Éviter les quantités négatives ou nulles

        // Mettre à jour la quantité dans l'état local
        const updatedReservations = localCommand.reservations.map(reservation =>
            reservation.id === reservationId
                ? { ...reservation, quantite_commande: newQuantite }
                : reservation
        );

        const updatedCommand = {
            ...localCommand,
            reservations: updatedReservations,
            total_commande: updatedReservations.reduce(
                (total, reservation) => total + (reservation.quantite_commande * reservation.produit?.prix_par_unite || 0),
                0
            )
        };

        setLocalCommand(updatedCommand);
    };

    const handleInputChange = (reservationId, event) => {
        const newQuantite = parseInt(event.target.value, 10);
        if (!isNaN(newQuantite)) {
            handleQuantiteChange(reservationId, newQuantite);
        }
    };

    // Formater le total_commande pour afficher deux chiffres après la virgule
    const formattedTotal = localCommand.total_commande ? localCommand.total_commande.toFixed(2) : '0.00';

    return (
        <div className="min-h-screen">
            <div className="flex flex-col gap-6">
                {localCommand.reservations?.map((reservation, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 rounded-md shadow-md"
                    >
                        <img
                            src={reservation.produit?.urlsPhotos[0]}
                            alt={`Produit ${reservation.produit?.nom_produit}`}
                            className="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded-md"
                        />
                        <div className="flex flex-col flex-grow sm:mx-4 mt-4 sm:mt-0">
                            <h2 className="text-xl font-bold">{reservation.produit?.nom_produit}</h2>
                            <p className="text-sm text-gray-600">Prix unitaire: {reservation.produit?.prix_par_unite}€</p>
                            <p className='mt-2'>Quantité</p>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="number"
                                    value={reservation.quantite_commande}
                                    min="1"
                                    onChange={(event) => handleInputChange(reservation.id, event)}
                                    className="w-20 text-center border rounded-md py-1 px-2"
                                    disabled={localCommand.status === 'En cours' || localCommand.status === 'Livré'}
                                />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Prix total: {(reservation.quantite_commande * reservation.produit?.prix_par_unite).toFixed(2)}€
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 flex flex-col justify-between items-center text-gray-600 text-base font-black">
                <div className="flex items-center w-full justify-between mb-5">
                    TOTAL GENERAL
                    <span className="text-black text-2xl ml-2">{formattedTotal}€</span>
                </div>
                <button
                    className={`mt-6 sm:mt-0 w-full md:w-[50%] text-white rounded-md mb-5 py-3 px-6 ${localCommand.status === 'En cours' || localCommand.status === 'Livré'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : isLoading ? 'bg-gray-500' : 'bg-customBlue'
                        }`}
                    onClick={handleUpdate}
                    disabled={localCommand.status === 'En cours' || localCommand.status === 'Livré' || isLoading}
                >
                    {isLoading ? 'Modification en cours...' : 'Modifier la commande'}
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CommandEdit;
