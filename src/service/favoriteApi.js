import { realStateAPI } from "@/redux/createAPI";

const favoriteApi = realStateAPI.injectEndpoints({
    endpoints: (build) => ({
        getFavorites: build.query({
            query: () => `property/list_user_favorites/`,
            providesTags: ['favorite']
        }),
        toogleFavorites: build.mutation({
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

export const {
    useGetFavoritesQuery,
    useToogleFavoritesMutation,
} = favoriteApi;

