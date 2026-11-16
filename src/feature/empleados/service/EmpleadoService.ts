import {axiosInstance} from "@/api/axios.ts";

export interface Empleado {
    emplId: number;
    emplUsuario: string;
    emplNombre: string;
    emplRol: string;
}

// al editar, el usuario no cambia y sin contraseña se conserva la actual
export interface EmpleadoFormData {
    emplUsuario: string;
    emplNombre: string;
    emplRol: string;
    emplPassword: string | null;
}

// los mismos roles que la matriz del API
export const ROLES = [
    {value: "ADMIN", label: "Administrador"},
    {value: "AUX_ADMIN", label: "Auxiliar administrativo"},
    {value: "RECEPCION", label: "Recepción"},
    {value: "COCINA", label: "Cocina"},
    {value: "MESERO", label: "Mesero"},
];

export const nombreRol = (rol: string) => ROLES.find(r => r.value === rol)?.label ?? rol;

const BASE = "/empleados";

export const getEmpleados = async (signal?: AbortSignal): Promise<Empleado[]> => {
    const response = await axiosInstance.get(BASE, {signal});
    return response.data.data;
};

export const createEmpleado = async (data: EmpleadoFormData): Promise<number> => {
    const response = await axiosInstance.post(BASE, data);
    return response.data.data;
};

export const updateEmpleado = async (id: number, data: EmpleadoFormData): Promise<void> => {
    await axiosInstance.put(`${BASE}/${id}`, data);
};

export const deleteEmpleado = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE}/${id}`);
};
