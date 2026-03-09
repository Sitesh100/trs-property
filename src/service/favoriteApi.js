import { realStateAPI, newRealStateAPI } from "@/redux/createAPI";

// ========================================
// 📝 OLD API (COMMENTED OUT)
// ========================================
const favoriteApiOld = realStateAPI.injectEndpoints({
    endpoints: (build) => ({
        getFavoritesOld: build.query({
            query: () => `property/list_user_favorites/`,
            providesTags: ['favorite']
        }),
        toogleFavoritesOld: build.mutation({
            query: ({ property }) => {
                return {
                    url: `property/add_to_favorite/`,
                    method: "POST",
                    body: { property },
                }
            },
            invalidatesTags: ['favorite', 'getProperty', 'getCustomerProperty']
        }),
    }),
});

// ========================================
// 📝 NEW API - Customer Favorites
// ========================================
const favoriteApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        // GET /api/customer/favourites - Get all favorites
        getFavorites: build.query({
            query: () => `/api/customer/favourites`,
            providesTags: ['favorites'],
        }),
        
        // POST /api/customer/favourites/{property_id} - Add/Remove favorite (toggle)
        toggleFavorite: build.mutation({
            query: (propertyId) => ({
                url: `/api/customer/favourites/${propertyId}`,
                method: "POST",
            }),
            invalidatesTags: ['favorites', 'properties', 'myProperties'],
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useToggleFavoriteMutation,
} = favoriteApi;

