import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

export const sensorApi = createApi({
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
    tagTypes:['Sensor'],
    endpoints: (builder) => ({
        getSensors: builder.query({
            query:({controllerId}) => ({
                url:`/sensors?controllerId=${controllerId}`,
                method:"GET",
            }),
            providesTags: ['Sensor'],
        }),
        addSensor :builder.mutation({
            query:({body,controllerId}) =>({
                url:`/sensors?controllerId=${controllerId}`,
                method:"POST",
                body:body,
            }),
            invalidatesTags: ['Sensor'],
        }),
        deleteSensor: builder.mutation({
            query:({id,controllerId}) =>({
                url:`/sensors/${id}?controllerId=${controllerId}`,
                method:"DELETE",
            }),
            invalidatesTags: ['Sensor'],
        }),
        putSensor: builder.mutation({
            query:(body) =>({
                url:"/sensors",
                method:"POST",
                body:body,
            }),
            invalidatesTags: ['Sensor'],
        })
    }),
    reducerPath: "sensor",
});
export const {useGetSensorsQuery,useDeleteSensorMutation,useAddSensorMutation} = sensorApi;
