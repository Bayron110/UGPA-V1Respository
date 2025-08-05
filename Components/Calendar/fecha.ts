import { DateTime } from "luxon";

/**
 * Normaliza una fecha a la hora correcta en America/Guayaquil.
 * @param fecha Cadena ISO o Date. Si la cadena no lleva offset, se interpreta según `zonaOrigen`.
 * @param zonaOrigen Zona de la que parte la fecha cuando no hay offset en la cadena. Por defecto "America/Guayaquil".
 */
export function corregirFechaZonaHoraria(
  fecha: string | Date,
  zonaOrigen: string = "America/Guayaquil"
): Date {
  let dt: DateTime;

  if (typeof fecha === "string") {

    const tieneOffset = /([zZ]|[+-]\d{2}(:?\d{2})?)$/.test(fecha);

    if (tieneOffset) {
      
      dt = DateTime.fromISO(fecha);
    } else {
    
      dt = DateTime.fromISO(fecha, { zone: zonaOrigen });
    }

    if (!dt.isValid) {
    
      dt = DateTime.fromJSDate(new Date(fecha), { zone: zonaOrigen });
    }
  } else {
    dt = DateTime.fromJSDate(fecha, { zone: zonaOrigen });
  }

  return dt.setZone("America/Guayaquil").toJSDate();
}
