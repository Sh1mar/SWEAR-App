import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/auth'
import dashboardReducer from './dashboard/dashboard'

export const makeStore = () => {
    console.log("Creating Redux Store");
    // This function is called on the server side to create a new store instance
  return configureStore({
    reducer: {
        auth : authReducer,
        dashboard : dashboardReducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']