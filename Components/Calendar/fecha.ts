import { DateTime } from "luxon";

/**
 * Corrige la zona horaria de una fecha a America/Guayaquil
 * @param fecha Fecha en formato ISO string o Date object
 * @param zonaOrigen Zona horaria de origen (por defecto America/Guayaquil)
 * @returns Date object corregido para la zona de Guayaquil
 */
export function corregirFechaZonaHoraria(
    fecha: string | Date,
    zonaOrigen: string = "America/Guayaquil"
): Date {
    console.log(`🔧 Corrigiendo fecha: ${fecha}`);
    
    let dt: DateTime;

    try {
        if (typeof fecha === "string") {
            // Verificar si la cadena tiene información de zona horaria
            const tieneOffset = /([zZ]|[+-]\d{2}(:?\d{2})?)$/.test(fecha);
            
            if (tieneOffset) {
                // La fecha ya tiene zona horaria definida
                dt = DateTime.fromISO(fecha);
                console.log(`📍 Fecha con zona horaria: ${dt.toString()}`);
            } else {
                // La fecha no tiene zona horaria, interpretarla como zona local
                dt = DateTime.fromISO(fecha, { zone: zonaOrigen });
                console.log(`🌍 Fecha interpretada en ${zonaOrigen}: ${dt.toString()}`);
            }

            // Si fromISO falla, intentar con el constructor Date nativo
            if (!dt.isValid) {
                console.log(`⚠️ fromISO falló, intentando con Date nativo`);
                const jsDate = new Date(fecha);
                dt = DateTime.fromJSDate(jsDate, { zone: zonaOrigen });
            }
        } else {
            // Es un objeto Date
            dt = DateTime.fromJSDate(fecha, { zone: zonaOrigen });
            console.log(`📅 Date object procesado: ${dt.toString()}`);
        }

        // Validar que la conversión sea exitosa
        if (!dt.isValid) {
            console.error(`❌ Error parseando fecha: ${fecha}`, dt.invalidExplanation);
            // Retornar fecha actual como fallback
            return new Date();
        }

        // Convertir a zona horaria de Guayaquil manteniendo el momento exacto
        const fechaGuayaquil = dt.setZone("America/Guayaquil");
        const fechaFinal = fechaGuayaquil.toJSDate();
        
        console.log(`✅ Fecha final en Guayaquil: ${fechaFinal.toISOString()} (Local: ${fechaFinal.toLocaleString('es-ES', {timeZone: 'America/Guayaquil'})})`);
        
        return fechaFinal;

    } catch (error) {
        console.error(`❌ Error inesperado procesando fecha: ${fecha}`, error);
        return new Date(); // Fallback
    }
}