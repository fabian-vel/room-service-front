import {Volume2, VolumeX} from "lucide-react";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {useSoundStore} from "@/shared/store/soundStore.ts";
import {cn} from "@/shared/shadcn/lib/utils.ts";

export function SoundToggleComponent() {
    const {activo, bloqueado, alternar} = useSoundStore();
    const sonando = activo && !bloqueado;

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={alternar}
            title={sonando ? "Silenciar avisos de pedidos" : "Activar avisos de pedidos"}
            className={cn(bloqueado && "animate-pulse border-yellow-600 text-yellow-700")}
        >
            {sonando ? <Volume2/> : <VolumeX/>}
            {bloqueado ? "Activar sonido" : sonando ? "Sonido activo" : "Sonido apagado"}
        </Button>
    );
}
