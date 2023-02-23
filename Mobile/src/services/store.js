import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "./auth/auth";
import {homeApi} from "./home/home"
import {setupListeners} from "@reduxjs/toolkit/query";
import authReducer from "./auth/authSlice";
import {roomApi} from "./room/room";
import {userApi} from "./user/user";
import {deviceApi} from "./device/device";
import {controllerApi} from "./controller/controller";
import {sensorApi} from "./sensor/sensor";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [homeApi.reducerPath]: homeApi.reducer,
        [roomApi.reducerPath]: roomApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [deviceApi.reducerPath]: deviceApi.reducer,
        [controllerApi.reducerPath]: controllerApi.reducer,
        [sensorApi.reducerPath]:sensorApi.reducer,
        loginInfo:authReducer,
    },
    middleware: (gDM) => gDM().concat(
        authApi.middleware,
        homeApi.middleware,
        roomApi.middleware,
        userApi.middleware,
        deviceApi.middleware,
        controllerApi.middleware,
        sensorApi.middleware),

    devTools:true,
});
setupListeners(store.dispatch)
