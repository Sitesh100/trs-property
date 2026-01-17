import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import favoriteReducer from './favoriteSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { realStateAPI } from './createAPI';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'favorite']
};

const rootReducer = combineReducers({
    [realStateAPI.reducerPath]: realStateAPI.reducer,
    auth: authReducer,
    favorite: favoriteReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(realStateAPI.middleware),
});

export const persistor = persistStore(store);
