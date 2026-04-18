import { newRealStateAPI } from "@/redux/createAPI";

const blogApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        getBlogs: build.query({
            query: ({ skip = 0, limit = 4 } = {}) => `/api/blogs?skip=${skip}&limit=${limit}`,
            transformResponse: (response) => {
                if (Array.isArray(response)) return response;
                if (Array.isArray(response?.data)) return response.data;
                if (Array.isArray(response?.results)) return response.results;
                if (Array.isArray(response?.items)) return response.items;
                return [];
            },
        }),
    }),
});

export const { useGetBlogsQuery } = blogApi;
