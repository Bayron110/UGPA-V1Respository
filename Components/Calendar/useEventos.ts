import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { corregirFechaZonaHoraria } from './DateCoreccion';


export interface Evento {
    nombre: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
}

export interface EventoFirebase {
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    horaInicio: string;
    horaFin: string;
    timestamp: number;
}

export function useEventos(): Evento[] {
    const [eventos, setEventos] = useState<Evento[]>([]);

    useEffect(() => {
        const db = getDatabase();
        const eventosRef = ref(db, "eventos");

        const unsubscribe = onValue(eventosRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return setEventos([]);

            const eventosParseados: Evento[] = Object.values(data).map((eventoRaw) => {
                const evento = eventoRaw as EventoFirebase;

                const fechaInicio = corregirFechaZonaHoraria(
                    evento.fechaInicio,
                    evento.horaInicio
                );

                const fechaFin = corregirFechaZonaHoraria(
                    evento.fechaFin,
                    evento.horaFin
                );

                return {
                    nombre: evento.nombre,
                    descripcion: evento.descripcion,
                    fechaInicio,
                    fechaFin,
                };
            });

            setEventos(eventosParseados);
        });

        return () => unsubscribe();
    }, []);

    return eventos;
}
