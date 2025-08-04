// components/ExportarYLimpiar.tsx
import * as XLSX from "xlsx";
import type{ Evento } from "./types";

interface Props {
    eventos: Evento[];
    limpiar: () => void;
}

const ExportarYLimpiar: React.FC<Props> = ({ eventos, limpiar }) => {
    const manejarClick = () => {
        if (eventos.length === 0) return;
        const confirmado = window.confirm(
            "⚠️ Una vez que se exporte los datos a Excel se borrarán de la base de datos.\n¿Seguro que quieres continuar?"
        );
        if (!confirmado) return;

        const fechaActual = new Date();
        const mes = fechaActual
            .toLocaleString("es-ES", { month: "long" })
            .toLowerCase();
        const año = fechaActual.getFullYear();
        const nombreArchivo = `UGPA_eventos_${mes}_${año}.xlsx`;

        const hoja = XLSX.utils.json_to_sheet(
            eventos.map((e) => ({
                Evento: e.nombre,
                Descripción: e.descripcion,
                "Fecha y Hora Inicio":
                    e.fechaInicio && e.horaInicio
                        ? `${e.fechaInicio} ${e.horaInicio}`
                        : "Vacío",
                "Fecha y Hora Fin":
                    e.fechaFin && e.horaFin
                        ? `${e.fechaFin} ${e.horaFin}`
                        : "Vacío",
                "Creado en": e.creadoEn
                    ? new Date(e.creadoEn).toLocaleString()
                    : "N/A",
            }))
        );

        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Historial");
        XLSX.writeFile(libro, nombreArchivo);

        limpiar();
    };

    return (
        <button
            onClick={manejarClick}
            style={{
                marginBottom: "1rem",
                padding: "0.6rem 1.2rem",
                backgroundColor: "#00f2ff",
                color: "#000",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
            }}
        >
            📤 Exportar a Excel y Limpiar
        </button>
    );
};

export default ExportarYLimpiar;
