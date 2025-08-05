import { DateTime } from "luxon";

export function corregirFechaZonaHoraria(
    fecha: string | Date,
    ajustarHoraManual?: string
): Date {
    let dt: DateTime;

    if (typeof fecha === "string") {
        const tieneOffset = /([zZ]|[+-]\d{2}(:?\d{2})?)$/.test(fecha);
        if (tieneOffset) {
            dt = DateTime.fromISO(fecha, { setZone: true }).setZone("America/Guayaquil");
        } else {
            dt = DateTime.fromISO(fecha);
            if (!dt.isValid) {
                dt = DateTime.fromJSDate(new Date(fecha));
            }
            dt = dt.setZone("America/Guayaquil", { keepLocalTime: true });
        }
    } else {
        dt = DateTime.fromJSDate(fecha).setZone("America/Guayaquil");
    }

    if (ajustarHoraManual) {
        const [h, m] = ajustarHoraManual.split(":").map(Number);
        dt = dt.set({ hour: h, minute: m });
    }

    return dt.toJSDate();
}
