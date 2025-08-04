import { DateTime } from "luxon";
export function corregirFechaZonaHoraria(fecha: string | Date): Date {
  const fechaISO = typeof fecha === "string" ? fecha : fecha.toISOString();
  return DateTime.fromISO(fechaISO, { zone: "utc" })
    .setZone("America/Guayaquil")
    .toJSDate();
}