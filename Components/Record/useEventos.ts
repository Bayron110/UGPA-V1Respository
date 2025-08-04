// hooks/useEventos.ts
import { useEffect, useState } from "react";
import { ref, onValue, remove, update, off } from "firebase/database";
import type{ Evento } from "./types";
import { db } from "../../firebase/Config";

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const eventosRef = ref(db, "eventos");

    // Escucha en tiempo real
    onValue(eventosRef, (snapshot) => {
      const datos = snapshot.val();

      if (datos) {
        const eventosList: Evento[] = Object.entries(datos)
          .map(([id, value]) => {
            const e = value as Evento;
            return {
              id,
              nombre: e.nombre || "Vacío",
              descripcion: e.descripcion || "Vacío",
              fechaInicio: e.fechaInicio || "",
              horaInicio: e.horaInicio || "",
              fechaFin: e.fechaFin || "",
              horaFin: e.horaFin || "",
              timestamp: e.timestamp ?? Date.now(),
              creadoEn: e.creadoEn || "",
            };
          })
          .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));

        setEventos(eventosList);
      } else {
        setEventos([]);
      }
      setCargando(false);
    });

    // Cleanup: quitar el listener cuando el componente se desmonta
    return () => {
      off(eventosRef);
    };
  }, []);

  const eliminarEvento = (id: string) => {
    remove(ref(db, `eventos/${id}`));
  };

  const actualizarEvento = (id: string, cambios: Partial<Evento>) => {
    return update(ref(db, `eventos/${id}`), cambios);
  };

  const limpiarTodos = () => {
    remove(ref(db, "eventos"));
  };

  return {
    eventos,
    cargando,
    eliminarEvento,
    actualizarEvento,
    limpiarTodos,
  };
}
