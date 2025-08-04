import React from "react";
import Modal from "react-modal";
import type { EventApi } from "@fullcalendar/core";
import { Button } from "./Button";

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
    event: EventApi | null;
}

interface ExtendedProps {
    descripcion?: string;
    fechaInicio?: string;
    horaInicio?: string;
    fechaFin?: string;
    horaFin?: string;
    [key: string]: unknown;
}

const obtenerPropsExtendidos = (event: EventApi | null): ExtendedProps => {
    if (!event) return {};
    const ext = event.extendedProps;
    if (typeof ext === "object" && ext !== null) {
        return ext as ExtendedProps;
    }
    return {};
};

export const EventModal: React.FC<Props> = ({
    isOpen,
    onRequestClose,
    event,
}) => {
    const {
        descripcion,
        fechaInicio,
        horaInicio,
        fechaFin,
        horaFin,
        ...otrosCampos
    } = obtenerPropsExtendidos(event);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detalles del Evento"
            ariaHideApp={false}
            style={{
                content: {
                    background: "#1e1e38",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "2rem",
                    width: "420px",
                    maxWidth: "90%",
                    margin: "auto",
                    boxShadow: "0 0 20px rgba(0, 242, 255, 0.5)",
                    position: "relative",
                },
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.75)",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Nombre completo del evento */}
                <h2 style={{ margin: 0, fontSize: "1.75rem", color: "#00f2ff" }}>
                    📌 {event?.title || "Evento sin título"}
                </h2>

                <div style={{ fontSize: "1rem", lineHeight: 1.5 }}>
                    {/* Descripción */}
                    {descripcion && (
                        <p>
                            <strong>📝 Descripción:</strong> {descripcion}
                        </p>
                    )}

                    {/* Fecha y hora de inicio */}
                    {(fechaInicio || horaInicio) && (
                        <p>
                            <strong>🕒 Inicio:</strong>{" "}
                            {fechaInicio ?? ""}
                            {horaInicio ? ` a las ${horaInicio}` : ""}
                        </p>
                    )}

                    {/* Fecha y hora de fin */}
                    {(fechaFin || horaFin) && (
                        <p>
                            <strong>⏱️ Fin:</strong>{" "}
                            {fechaFin ?? ""}
                            {horaFin ? ` a las ${horaFin}` : ""}
                        </p>
                    )}

                    {/* Mostrar otros campos extendidos si hay */}
                    {Object.entries(otrosCampos).map(([clave, valor]) =>
                        valor ? (
                            <p key={clave}>
                                <strong>{clave.charAt(0).toUpperCase() + clave.slice(1)}:</strong>{" "}
                                {String(valor)}
                            </p>
                        ) : null
                    )}
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "2rem",
                    }}
                >
                    <Button
                        onClick={onRequestClose}
                        aria-label="Cerrar modal"
                        style={{
                            backgroundColor: "#00f2ff",
                            color: "#1e1e38",
                            fontWeight: "bold",
                            padding: "0.5rem 1rem",
                        }}
                    >
                        ✖️ Cerrar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
