import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from "@/shared/shadcn/components/ui/select.tsx";
import {LIMITES_TARJETAS, type LimiteTarjetas, useBoardStore} from "@/shared/store/boardStore.ts";

const OPCIONES = LIMITES_TARJETAS.map(value => ({
    value,
    label: value === 'todos' ? 'Todas las tarjetas' : `${value} tarjetas`,
}));

export function CardLimitSelectComponent() {
    const {limiteTarjetas, cambiarLimite} = useBoardStore();

    return (
        <Select
            items={OPCIONES}
            value={limiteTarjetas}
            onValueChange={value => cambiarLimite(value as LimiteTarjetas)}
        >
            <SelectTrigger size="sm" className="w-44" title="Tarjetas visibles por columna">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {OPCIONES.map(opcion => (
                        <SelectItem key={opcion.value} value={opcion.value}>
                            {opcion.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
