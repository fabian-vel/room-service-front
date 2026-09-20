export interface Category {
    mecaId: number;
    mecaLlaveMst: string;
    mecaNombre: string;
    mecaDescripcion?: string;
    mecaImagenUrl?: string;
    mecaParentId?: number;
    mecaEstado: string;
}

export type CategoryFormData = Pick<Category, "mecaLlaveMst" | "mecaNombre"> &
    Partial<Pick<Category, "mecaDescripcion" | "mecaImagenUrl" | "mecaParentId">>;
