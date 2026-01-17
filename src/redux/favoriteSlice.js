import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
    name: "favorite",
    initialState: {
        favorites: [],
    },
    reducers: {
        toggleFavorite: (state, action) => {
            const propertyId = action.payload;
            const exists = state.favorites.includes(propertyId);
            if (exists) {
                state.favorites = state.favorites.filter((id) => id !== propertyId);
            } else {
                state.favorites.push(propertyId);
            }
        },
    },
});

export const { toggleFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
