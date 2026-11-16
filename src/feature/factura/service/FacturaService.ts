import {axiosInstance} from "@/api/axios.ts";

export interface AccesoFactura {
    haacId: number;
    haacHabitacion: string;
    haacClienteNombre: string;
    haacClienteDoc: string | null;
    haacFechaInicio: string;
    haacFechaFin: string;
    totalPendiente: number;
    pedidosSinEntregar: number;
}

export interface PedidoFactura {
    pediId: number;
    pediFechaCreacion: string;
    pediTotal: number;
    // null: pendiente de cobro
    pagoId: number | null;
    espeNombre: string;
    espeLlaveMst: string;
    detalle: {
        meitNombre: string;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
        observacion: string | null;
    }[];
}

export interface PagoFactura {
    pagoId: number;
    pagoTotal: number;
    pagoMetodo: string;
    pagoObservacion: string | null;
    pagoFechaCreacion: string;
    emplNombre: string;
}

export interface Factura {
    acceso: AccesoFactura;
    pedidos: PedidoFactura[];
    pagos: PagoFactura[];
}

export interface PagoFormData {
    pagoMetodo: string;
    pagoObservacion: string | null;
}

// los mismos métodos que valida el API
export const METODOS_PAGO = [
    {value: "EFECTIVO", label: "Efectivo"},
    {value: "TARJETA", label: "Tarjeta"},
    {value: "TRANSFERENCIA", label: "Transferencia"},
];

export const nombreMetodo = (metodo: string) => METODOS_PAGO.find(m => m.value === metodo)?.label ?? metodo;

export const dinero = (valor: number) => `$${valor.toLocaleString("es-CO")}`;

export const fechaHora = (fecha: string) =>
    new Date(fecha).toLocaleString("es-CO", {dateStyle: "short", timeStyle: "short"});

const BASE = "/facturas";

// sin habitación devuelve los accesos con saldo pendiente
export const buscarAccesos = async (habitacion: string, signal?: AbortSignal): Promise<AccesoFactura[]> => {
    const response = await axiosInstance.get(BASE, {params: {habitacion: habitacion || undefined}, signal});
    return response.data.data;
};

export const getFactura = async (haacId: number, signal?: AbortSignal): Promise<Factura> => {
    const response = await axiosInstance.get(`${BASE}/${haacId}`, {signal});
    return response.data.data;
};

export const registrarPago = async (haacId: number, data: PagoFormData): Promise<number> => {
    const response = await axiosInstance.post(`${BASE}/${haacId}/pagos`, data);
    return response.data.data;
};
