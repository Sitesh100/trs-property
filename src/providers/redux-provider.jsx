'use client'
import { persistor, store } from '@/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { clearAuthCookies, setAuthCookies } from '@/utils/authCookies';

function AuthCookieSync() {
    const { token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            setAuthCookies({
                token,
                role: user?.role || user?.user_role || 'customer',
            });
            return;
        }

        clearAuthCookies();
    }, [token, user]);

    return null;
}

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthCookieSync />
                {children}
            </PersistGate>
        </Provider>
    );
}
