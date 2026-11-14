import {create} from 'zustand';

// preferencias del tablero de pedidos del día; se guardan en el navegador de cada pantalla
export const LIMITES_TARJETAS = ['5', '10', '15', '20', 'todos'] as const;
export type LimiteTarjetas = typeof LIMITES_TARJETAS[number];

const LIMITE_POR_DEFECTO: LimiteTarjetas = '10';

const leerLimite = (): LimiteTarjetas => {
    const guardado = localStorage.getItem('limite-tarjetas');
    return LIMITES_TARJETAS.find(l => l === guardado) ?? LIMITE_POR_DEFECTO;
};

interface BoardState {
    limiteTarjetas: LimiteTarjetas;
    cambiarLimite: (limite: LimiteTarjetas) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    limiteTarjetas: leerLimite(),

    cambiarLimite: (limiteTarjetas) => {
        localStorage.setItem('limite-tarjetas', limiteTarjetas);
        set({limiteTarjetas});
    },
}));
