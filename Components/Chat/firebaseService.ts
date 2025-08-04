import { ref, set } from "firebase/database";
import { db } from "../../firebase/Config";
import type { EventoPendiente } from './types';


export const guardarEvento = async (evento: EventoPendiente) => {
    const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const eventoRef = ref(db, "eventos/" + id);
    await set(eventoRef, {
        nombre: evento.nombre,
        descripcion: evento.descripcion,
        fechaInicio: evento.fechaInicio.toISOString().split("T")[0],
        horaInicio: evento.horaInicio,
        fechaFin: evento.fechaFin ? evento.fechaFin.toISOString().split("T")[0] : "Vacío",
        horaFin: evento.fechaFin ? evento.horaFin : "Vacío",
        timestamp: evento.fechaInicio.getTime(),
        creadoEn: new Date().toISOString(),
    });
};
