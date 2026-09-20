export interface Constant {
    consId: number;
    consLlave: string;
    consValor: string;
    consDescripcion?: string;
    consEstado: string;
}

export type ConstantFormData = Pick<Constant, "consLlave" | "consValor"> &
    Partial<Pick<Constant, "consDescripcion">>;
