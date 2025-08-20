import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { corregirFechaZonaHoraria } from "./fecha";

export interface Evento {
    nombre: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
}

export interface EventoFirebase {
    nombre: string;
    descripcion: string;
    fechaInicio: string; // Formato: "2025-08-19"
    fechaFin: string;    // Formato: "2025-08-19"
    horaInicio: string;  // Formato: "14:30"
    horaFin: string;     // Formato: "16:00"
    timestamp: number;
}

/**
 * Combina fecha y hora en formato ISO para crear una fecha completa
 */
function combinarFechaHora(fecha: string, hora: string): string {
    // Si la fecha ya incluye hora (formato ISO completo), la usamos directamente
    if (fecha.includes('T')) {
        return fecha;
    }
    
    // Limpiar la fecha (remover espacios, etc.)
    const fechaLimpia = fecha.trim();
    const horaLimpia = hora.trim();
    
    // Asegurar formato correcto de hora (HH:MM:SS)
    let horaFormateada = horaLimpia;
    if (horaLimpia.split(':').length === 2) {
        horaFormateada = `${horaLimpia}:00`;
    } else if (horaLimpia.split(':').length === 1) {
        horaFormateada = `${horaLimpia}:00:00`;
    }
    
    // Combinar en formato ISO: YYYY-MM-DDTHH:MM:SS
    return `${fechaLimpia}T${horaFormateada}`;
}

export function useEventos(): Evento[] {
    const [eventos, setEventos] = useState<Evento[]>([]);

    useEffect(() => {
        const db = getDatabase();
        const eventosRef = ref(db, "eventos");

        const unsubscribe = onValue(eventosRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                console.log("No hay eventos en Firebase");
                return setEventos([]);
            }

            console.log("📊 Datos de Firebase:", data);

            try {
                const eventosParseados: Evento[] = Object.entries(data).map(([key, eventoRaw]) => {
                    const evento = eventoRaw as EventoFirebase;
                    
                    console.log(`🔍 Procesando evento ${key}:`, {
                        nombre: evento.nombre,
                        fechaInicio: evento.fechaInicio,
                        horaInicio: evento.horaInicio,
                        fechaFin: evento.fechaFin,
                        horaFin: evento.horaFin
                    });

                    // Combinar fecha y hora
                    const fechaHoraInicio = combinarFechaHora(evento.fechaInicio, evento.horaInicio);
                    const fechaHoraFin = combinarFechaHora(evento.fechaFin, evento.horaFin);

                    console.log(`📅 Fechas combinadas:`, {
                        inicio: fechaHoraInicio,
                        fin: fechaHoraFin
                    });

                    // Corregir zonas horarias
                    const fechaInicio = corregirFechaZonaHoraria(fechaHoraInicio);
                    const fechaFin = corregirFechaZonaHoraria(fechaHoraFin);

                    console.log(`✅ Fechas finales:`, {
                        inicio: fechaInicio.toISOString(),
                        fin: fechaFin.toISOString(),
                        duracion: `${Math.round((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60))} minutos`
                    });

                    // Validar que las fechas sean correctas
                    if (fechaInicio >= fechaFin) {
                        console.warn(`⚠️ Evento "${evento.nombre}": La fecha de inicio es posterior o igual a la de fin`);
                    }

                    return {
                        nombre: evento.nombre,
                        descripcion: evento.descripcion || '',
                        fechaInicio,
                        fechaFin,
                    };
                });

                console.log(`🎯 Total eventos procesados: ${eventosParseados.length}`, eventosParseados);
                setEventos(eventosParseados);

            } catch (error) {
                console.error("❌ Error procesando eventos:", error);
                setEventos([]);
            }
        }, (error) => {
            console.error("❌ Error conectando a Firebase:", error);
        });

        return () => unsubscribe();
    }, []);

    return eventos;
}