import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllCommands, putCommand, updateCommand } from '../features/products/products';

const CommandEdit = ({ command, onClose }) => {
    const { commands } = useSelector((state) => state.products) || [];
    const dispatch = useDispatch();
    const [isUpdating, setIsUpdating] = useState(false); // Etat de chargement pour la mise à jour
    const [isCancelling, setIsCancelling] = useState(false); // Etat de chargement pour l'annulation
    const [localCommand, setLocalCommand] = useState(command);

    const handleUpdate = async () => {
        setIsUpdating(true); // Début de la mise à jour

        const produits = localCommand.reservations.map((reservation) => ({
            produitId: reservation.produit?.id,
            quantite_commande: reservation.quantite_commande,
            prix_vente: parseFloat((reservation.quantite_commande * reservation.produit?.prix_par_unite).toFixed(2)),
        }));

        const updatedData = {
            id: localCommand.id,
            total_commande: parseFloat(formattedTotal),
            produits,
        };

        try {
            await dispatch(updateCommand(updatedData));
            toast.success('La commande a été modifiée avec succès !');
            dispatch(getAllCommands());
            onClose();
        } catch (error) {
            toast.error('Une erreur est survenue lors de la modification de la commande.');
        } finally {
            setIsUpdating(false); // Fin de la mise à jour
        }
    };

    const handleQuantiteChange = (reservationId, newQuantite) => {
        if (newQuantite < 1) return;

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
            ),
        };

        setLocalCommand(updatedCommand);
    };

    const handleInputChange = (reservationId, event) => {
        const newQuantite = parseInt(event.target.value, 10);
        if (!isNaN(newQuantite)) {
            handleQuantiteChange(reservationId, newQuantite);
        }
    };

    const handleCancelCommand = async () => {
        setIsCancelling(true); // Début de l'annulation
        try {
            await dispatch(putCommand({ id: localCommand.id, status: "Annulé" }));
            dispatch(getAllCommands());
            toast.success("Commande annulée avec succès.");
            onClose();
        } catch (error) {
            toast.error("Erreur lors de l'annulation de la commande.");
        } finally {
            setIsCancelling(false); // Fin de l'annulation
        }
    };

    const formattedTotal = localCommand.total_commande ? localCommand.total_commande.toFixed(2) : '0.00';

    const isUpdateDisabled = localCommand.status === 'En cours' || localCommand.status === 'Livré' || isUpdating;
    const isCancelDisabled = localCommand.status === 'En cours' || localCommand.status === 'Livré' || isCancelling;

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
                                    disabled={isUpdateDisabled || isCancelling}
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
                    className={`mt-6 w-full md:w-[50%] text-white rounded-md mb-5 py-3 px-6 ${isUpdateDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-customBlue'
                        }`}
                    onClick={handleUpdate}
                    disabled={isUpdateDisabled}
                >
                    {isUpdating ? 'Modification en cours...' : 'Modifier la commande'}
                </button>
                <button
                    className={`mt-6 w-full md:w-[50%] text-white rounded-md mb-5 py-3 px-6 ${isCancelDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500'
                        }`}
                    onClick={handleCancelCommand}
                    disabled={isCancelDisabled}
                >
                    {isCancelling ? 'Annulation en cours...' : 'Annuler la commande'}
                </button>
            </div>
           
        </div>
    );
};

export default CommandEdit;
