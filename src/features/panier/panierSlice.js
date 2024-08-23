import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  produits: [],
};

const panierSlice = createSlice({
  name: 'panier',
  initialState,
  reducers: {
    ajouterAuPanier: (state, action) => {
      state.produits.push(action.payload);
    },
    updateQuantiteProduit: (state, action) => {
      const { id, quantite } = action.payload;
      const produit = state.produits.find((prod) => prod.id === id);
      if (produit) {
        produit.quantite = quantite;
      }
    },
    removeProduitDuPanier: (state, action) => {
      state.produits = state.produits.filter((prod) => prod.id !== action.payload);
    },
    resetPanier: (state) => {
      state.produits = [];
    },
  },
});

export const { ajouterAuPanier, updateQuantiteProduit, removeProduitDuPanier,resetPanier } = panierSlice.actions;
export default panierSlice.reducer;
