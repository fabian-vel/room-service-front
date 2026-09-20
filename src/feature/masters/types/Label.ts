export interface Label {
    etiqId: number;
    etiqLlaveMst: string;
    etiqNombre: string;
    etiqDescripcion?: string;
    etiqEstado: string;
}

export type LabelFormData = Pick<Label, "etiqLlaveMst" | "etiqNombre"> &
    Partial<Pick<Label, "etiqDescripcion">>;
