import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const validatedProduct = {
        id: product.id,
        title: product.title || "Unknown Title",
        author: product.author || "Unknown",
        price: product.price || 0,
        thumbnail: product.thumbnail || "/default-image.png",
        quantity: product.quantity || 1,
      };
      const existingProduct = state.cart.find((item) => item.id === validatedProduct.id);

      if (existingProduct) {
        existingProduct.quantity += validatedProduct.quantity;
      } else {
        state.cart.push(validatedProduct);
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    },
    updateCart: (state, action) => {
      const { id, quantity } = action.payload;
    
      if (quantity < 1) {
        state.cart = state.cart.filter((item) => item.id !== id);
      } else {
        const productIndex = state.cart.findIndex((item) => item.id === id);
        if (productIndex > -1) {
          state.cart[productIndex].quantity = quantity;
        } else {
          state.cart.push({ id, quantity });
        }
      }
    },    
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, updateCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
