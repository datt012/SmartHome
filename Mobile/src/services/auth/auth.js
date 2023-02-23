import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";


export const authApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://10.0.2.2:3000/api/"
    }),
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: ((body) => ({
                url: "/authenticate",
                method: "POST",
                body: body,
            })),
        }),
        signUp: builder.mutation({
            query: ((body) => ({
                url:"/register",
                method:"POST",
                body:body,
            })),
        })
    }),

    reducerPath:"auth",
});
export const {useSignInMutation,useSignUpMutation} = authApi