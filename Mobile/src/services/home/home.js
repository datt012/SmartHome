import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

export const homeApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://10.0.2.2:3000/api/",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().loginInfo.token;
            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes:['Home'],
    endpoints: (builder) => ({
        getHomes: builder.query({
            query:() => ({
                url:"/homes",
                method:"GET",
            }),
            providesTags: ['Home'],
        }),
        getHomeById: builder.query({
            query:(id) =>({
                url:`homes/${id}`,
            })
        }),
        addHome :builder.mutation({
            query:(body) =>({
                url:"/homes",
                method:"POST",
                body:body,
            }),
            invalidatesTags: ['Home'],
        }),
        deleteHome: builder.mutation({
            query:(id) =>({
                url:`homes/${id}`,
                method:"DELETE",
            }),
            invalidatesTags: ['Home'],
        })
    }),
    reducerPath: "home",
});
export const {useGetHomesQuery,useGetHomeByIdQuery,useAddHomeMutation,useDeleteHomeMutation} = homeApi;
