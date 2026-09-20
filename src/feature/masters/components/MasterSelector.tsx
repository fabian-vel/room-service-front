import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/shared/shadcn/components/ui/select.tsx";

const MASTERS = [
    {value: "categories", label: "Categorias"},
    {value: "labels", label: "Etiquetas"},
    {value: "constants", label: "Constantes"},
] as const;

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export function MasterSelector({value, onChange}: Readonly<Props>) {
    return (
        <Select items={MASTERS} value={value} onValueChange={v => onChange(v as string)}>
            <SelectTrigger className="w-48">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {MASTERS.map(m => (
                        <SelectItem key={m.value} value={m.value}>
                            {m.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
