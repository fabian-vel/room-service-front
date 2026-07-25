import { create } from 'zustand';

interface AuthState {
    token: string | null;
    nombre: string | null;
    rol: string | null;
    isAuthenticated: boolean;
    saveToken: (token: string, nombre: string, rol: string) => void;
    clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    nombre: localStorage.getItem('nombre'),
    rol: localStorage.getItem('rol'),
    isAuthenticated: !!localStorage.getItem('token'),

    saveToken: (token, nombre, rol) => {
        localStorage.setItem('token', token);
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('rol', rol);
        set({token, nombre, rol, isAuthenticated: true});
    },

    clearToken: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        localStorage.removeItem('rol');
        set({token: null, nombre: null, rol: null, isAuthenticated: false});
    },
}));
