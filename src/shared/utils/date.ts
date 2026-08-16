export function formatHour(fecha: string | null | undefined): string {
    return new Date(fecha ?? '').toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
