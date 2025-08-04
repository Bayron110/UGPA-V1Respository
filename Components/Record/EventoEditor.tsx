// components/EventoEditor.tsx
import { useState, useEffect } from "react";
import type{ Evento } from "./types";

interface Props {
    evento: Evento;
    onGuardar: (cambios: Partial<Evento>) => void;
    onCancelar: () => void;
}

const EventoEditor: React.FC<Props> = ({ evento, onGuardar, onCancelar }) => {
    const [form, setForm] = useState<Partial<Evento>>({});

    useEffect(() => {
        setForm({
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            fechaInicio: evento.fechaInicio,
            horaInicio: evento.horaInicio,
            fechaFin: evento.fechaFin,
            horaFin: evento.horaFin,
            creadoEn: evento.creadoEn,
        });
    }, [evento]);

    const handleChange = (field: keyof Evento, value: string) => {
        setForm((f) => ({ ...f, [field]: value }));
    };

    return (
        <div style={{ display: "grid", gap: "6px" }}>
            <input
                placeholder="Nombre"
                value={form.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
                style={{ width: "100%" }}
            />
            <input
                placeholder="Descripción"
                value={form.descripcion || ""}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                style={{ width: "100%" }}
            />
            <label>
                Fecha Inicio:
                <input
                    type="date"
                    value={form.fechaInicio || ""}
                    onChange={(e) => handleChange("fechaInicio", e.target.value)}
                    style={{ width: "100%" }}
                />
            </label>
            <label>
                Hora Inicio:
                <input
                    type="time"
                    value={form.horaInicio || ""}
                    onChange={(e) => handleChange("horaInicio", e.target.value)}
                    style={{ width: "100%" }}
                />
            </label>
            <label>
                Fecha Fin:
                <input
                    type="date"
                    value={form.fechaFin || ""}
                    onChange={(e) => handleChange("fechaFin", e.target.value)}
                    style={{ width: "100%" }}
                />
            </label>
            <label>
                Hora Fin:
                <input
                    type="time"
                    value={form.horaFin || ""}
                    onChange={(e) => handleChange("horaFin", e.target.value)}
                    style={{ width: "100%" }}
                />
            </label>
            <label>
                Creado en:
                <input
                    type="datetime-local"
                    value={
                        form.creadoEn
                            ? new Date(form.creadoEn).toISOString().slice(0, 16)
                            : ""
                    }
                    onChange={(e) => handleChange("creadoEn", e.target.value)}
                    style={{ width: "100%" }}
                />
            </label>
            <div>
                <button
                    onClick={() => onGuardar(form)}
                    style={{
                        marginRight: "0.5rem",
                        backgroundColor: "#00f2ff",
                        color: "#000",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "5px",
                        border: "none",
                    }}
                >
                    💾 Guardar
                </button>
                <button
                    onClick={onCancelar}
                    style={{
                        backgroundColor: "#999",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "5px",
                        border: "none",
                    }}
                >
                    ❌ Cancelar
                </button>
            </div>
        </div>
    );
};

export default EventoEditor;
