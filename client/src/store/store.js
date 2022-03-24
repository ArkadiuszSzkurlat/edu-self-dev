import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
// To zmienić
import dashboardReducer from "./dashboardSlice";
import callReducer from "./callSlice";

export default configureStore({
  reducer: {
    dashboard: dashboardReducer,
    call: callReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
