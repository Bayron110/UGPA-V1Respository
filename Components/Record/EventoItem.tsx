// components/EventoItem.tsx
import { useState } from "react";
import type { Evento } from "./types";
import EventoEditor from "./EventoEditor";

interface Props {
    evento: Evento;
    onEliminar: (id: string) => void;
    onActualizar: (id: string, cambios: Partial<Evento>) => void;
}

const EventoItem: React.FC<Props> = ({ evento, onEliminar, onActualizar }) => {
    const [editando, setEditando] = useState(false);

    return (
        <li
            style={{
                marginBottom: "1rem",
                padding: "1rem",
                backgroundColor: "#1b1b2e",
                borderRadius: "10px",
                borderLeft: "4px solid #00f2ff",
            }}
        >
            {editando ? (
                <EventoEditor
                    evento={evento}
                    onGuardar={(cambios) => {
                        if (evento.id) onActualizar(evento.id, cambios);
                        setEditando(false);
                    }}
                    onCancelar={() => setEditando(false)}
                />
            ) : (
                <>
                    <p>
                        <strong>📌 Evento:</strong> {evento.nombre}
                    </p>
                    <p>
                        <strong>📝 Descripción:</strong> {evento.descripcion}
                    </p>
                    <p>
                        <strong>📆 Inicio:</strong> {evento.fechaInicio} {evento.horaInicio}
                    </p>
                    <p>
                        <strong>📆 Fin:</strong> {evento.fechaFin || "Vacío"} {evento.horaFin || "Vacío"}
                    </p>
                    {evento.creadoEn && evento.creadoEn !== "" && (
                        <p>
                            <strong>🕓 Creado en:</strong> {new Date(evento.creadoEn).toLocaleString()}
                        </p>
                    )}
                    <div style={{ marginTop: "0.5rem" }}>
                        <button
                            onClick={() => setEditando(true)}
                            style={{
                                marginRight: "0.5rem",
                                backgroundColor: "#ffc107",
                                color: "#000",
                                padding: "0.4rem 0.8rem",
                                borderRadius: "5px",
                                border: "none",
                            }}
                        >
                            ✏️ Editar
                        </button>
                        {evento.id && (
                            <button
                                onClick={() => {
                                    const confirmado = window.confirm(
                                        "¿Estás seguro de eliminar este evento?"
                                    );
                                    if (confirmado) onEliminar(evento.id!);
                                }}
                                style={{
                                    backgroundColor: "#dc3545",
                                    color: "#fff",
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "5px",
                                    border: "none",
                                }}
                            >
                                🗑️ Eliminar
                            </button>
                        )}
                    </div>
                </>
            )}
        </li>
    );
};

export default EventoItem;
