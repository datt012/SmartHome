import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";


export const userApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://10.0.2.2:3000/api/",
        prepareHeaders: (headers, {getState}) => {
            const token = getState().loginInfo.token;
            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes:['User'],
    endpoints: (builder) => ({
        getUser: builder.query({
            query:() => ({
                url:`/account`,
                method:"GET",
            }),
            providesTags: ['User'],
        }),
        postUser: builder.mutation({
            query:(body) =>({
                url:'account',
                method:"POST",
                body:body,
            }),
            invalidatesTags: ['User'],
        }),
        changePassword: builder.mutation({
            query:(body) =>({
                url:'account/change-password',
                method:"POST",
                body:body,
            }),
            invalidatesTags: ['User'],
        })
    }),
    reducerPath: "user",
});
export const {useGetUserQuery,usePostUserMutation,useChangePasswordMutation} = userApi;