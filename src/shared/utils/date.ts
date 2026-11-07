export function formatHour(fecha: string | null | undefined): string {
    return new Date(fecha ?? '').toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatDate(fecha: string | null | undefined): string {
    return new Date(fecha ?? '').toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
