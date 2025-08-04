// src/components/Chat/useChat.ts
import { useState, useEffect, useRef } from "react";
import type { Mensaje, EventoPendiente } from "./types";
import { guardarEvento } from "./firebaseService";

export const useChat = () => {
    const [texto, setTexto] = useState<string>("");
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [eventosPendientes, setEventosPendientes] = useState<EventoPendiente[]>([]);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [mensajes]);

    const agregarMensaje = (msg: Mensaje) =>
        setMensajes((prev) => [...prev, msg]);

    const usarBackendPython = async (texto: string) => {
        try {
            const res = await fetch("http://localhost:8000/extraer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto }),
            });

            const datos = await res.json();

            const fechaInicioString = `${datos.fechaInicio}T${datos.horaInicio}`;
            const fechaFinString =
                datos.fechaFin !== "Desconocida" && datos.horaFin !== "Desconocida"
                    ? `${datos.fechaFin}T${datos.horaFin}`
                    : null;

            const fechaInicio = new Date(fechaInicioString);
            const fechaFin = fechaFinString ? new Date(fechaFinString) : null;

            if (isNaN(fechaInicio.getTime())) {
                agregarMensaje({
                    emisor: "sistema",
                    contenido: "❌ No pude interpretar la fecha de inicio correctamente.",
                });
                return;
            }

            const evento: EventoPendiente = {
                nombre: datos.evento || "Evento sin nombre",
                descripcion: datos.descripcion || datos.evento,
                fechaInicio,
                fechaFin,
                horaInicio: datos.horaInicio,
                horaFin: datos.horaFin,
            };

            setEventosPendientes([evento]);

            const mensajeConfirmacion: Mensaje = {
                emisor: "sistema",
                contenido: `📝 Evento: ${evento.nombre}\n📄 Descripción: ${evento.descripcion}\n📅 Inicio: ${evento.fechaInicio.toLocaleString()}\n📅 Fin: ${evento.fechaFin?.toLocaleString() || "Vacío"}\n\n¿Deseas agendar este evento? Responde con "sí" o "no".`,
            };

            agregarMensaje(mensajeConfirmacion);
        } catch (err) {
            console.error("Error al contactar el backend:", err);
            agregarMensaje({
                emisor: "sistema",
                contenido: "❌ Error al procesar el texto con el backend.",
            });
        }
    };

    const manejarEnvio = async () => {
        if (!texto.trim()) return;

        agregarMensaje({ emisor: "usuario", contenido: texto });
        const textoLower = texto.trim().toLowerCase();

        if (eventosPendientes.length > 0) {
            if (textoLower === "sí" || textoLower === "si") {
                for (const evento of eventosPendientes) {
                    await guardarEvento(evento);
                }
                agregarMensaje({
                    emisor: "sistema",
                    contenido: `✅ ${eventosPendientes.length} evento(s) agendado(s) correctamente.`,
                });
                setEventosPendientes([]);
            } else if (textoLower === "no") {
                agregarMensaje({ emisor: "sistema", contenido: "❌ Agendamiento cancelado." });
                setEventosPendientes([]);
            } else {
                agregarMensaje({
                    emisor: "sistema",
                    contenido: "❓ Responde con 'sí' o 'no' para confirmar el agendamiento.",
                });
            }
            setTexto("");
            return;
        }

        await usarBackendPython(texto);
        setTexto("");
    };

    return {
        texto,
        setTexto,
        mensajes,
        manejarEnvio,
        chatContainerRef,
    };
};
