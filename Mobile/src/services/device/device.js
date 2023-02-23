import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

export const deviceApi = createApi({
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
    tagTypes:['Device'],
    endpoints: (builder) => ({
        getDevices: builder.query({
            query:({controllerId}) => ({
                url:`/devices?controllerId=${controllerId}`,
                method:"GET",
            }),
            providesTags: ['Device'],
        }),
        getDeviceById: builder.query({
            query:(deviceId) =>({
                url:`devices/${deviceId}`,
                method:"GET",
            }),
            providesTags: ['Device'],
        }),
        addDevice :builder.mutation({
            query:({body,controllerId}) =>({
                url:`/devices?controllerId=${controllerId}`,
                method:"POST",
                body:body,
            }),
            invalidatesTags: ['Device'],
        }),
        deleteDevice: builder.mutation({
            query:({id,controllerId}) =>({
                url:`devices/${id}?controllerId=${controllerId}`,
                method:"DELETE",
            }),
            invalidatesTags: ['Device'],
        }),
        putDevice: builder.mutation({
            query:(body) =>({
                url:"/devices",
                method:"POST",
                body:body,
            }),
            invalidatesTags: ['Device'],
        })
    }),
    reducerPath: "device",
});
export const {useGetDevicesQuery,useGetDeviceByIdQuery,usePutDeviceMutation,useDeleteDeviceMutation,useAddDeviceMutation} = deviceApi;
