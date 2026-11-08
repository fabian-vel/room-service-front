import {create} from 'zustand';

export type Sonido = 'nuevo-pedido' | 'pedido-cancelado';

const INTERVALO_SONIDO_MS = 3000;
const ultimoSonido: Partial<Record<Sonido, number>> = {};

interface SoundState {
    activo: boolean;
    // el navegador no deja reproducir audio hasta que el usuario haga clic en la página
    bloqueado: boolean;
    alternar: () => void;
    reproducir: (sonido: Sonido) => void;
}

export const useSoundStore = create<SoundState>((set, get) => ({
    activo: localStorage.getItem('sonido') !== 'off',
    // tras recargar la página no hay clic todavía: se avisa desde el inicio, no al perder el primer pedido
    bloqueado: !(navigator.userActivation?.hasBeenActive ?? true),

    alternar: () => {
        // si estaba bloqueado, este clic ya habilita el audio: se deja activo
        const activo = get().bloqueado || !get().activo;
        localStorage.setItem('sonido', activo ? 'on' : 'off');
        set({activo, bloqueado: false});
    },

    reproducir: (sonido) => {
        if (!get().activo) return;
        // cada tipo suena como máximo una vez cada INTERVALO_SONIDO_MS, para que no se encimen
        const ahora = Date.now();
        if (ahora - (ultimoSonido[sonido] ?? 0) < INTERVALO_SONIDO_MS) return;
        ultimoSonido[sonido] = ahora;
        new Audio(`/sounds/${sonido}.mp3`).play()
            .then(() => set({bloqueado: false}))
            .catch((e) => {
                console.warn('No se pudo reproducir el sonido:', e);
                set({bloqueado: true});
            });
    },
}));

// cualquier clic o tecla en la página habilita el audio
const desbloquear = () => useSoundStore.setState({bloqueado: false});
window.addEventListener('pointerdown', desbloquear, {once: true});
window.addEventListener('keydown', desbloquear, {once: true});
