import React from "react";
import Modal from "react-modal";
import type { EventApi } from "@fullcalendar/core";

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
    ubicacion?: string;
    organizador?: string;
    categoria?: string;
    prioridad?: 'alta' | 'media' | 'baja';
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

const formatearFecha = (fecha: Date | string | undefined): string => {
    if (!fecha) return '';
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

const formatearHora = (fecha: Date | string | undefined): string => {
    if (!fecha) return '';
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
};

const obtenerIconoPrioridad = (prioridad?: string) => {
    switch (prioridad) {
        case 'alta': return { icon: '🔴', color: '#ef4444', label: 'Alta' };
        case 'media': return { icon: '🟡', color: '#f59e0b', label: 'Media' };
        case 'baja': return { icon: '🟢', color: '#10b981', label: 'Baja' };
        default: return null;
    }
};

const obtenerIconoCategoria = (categoria?: string) => {
    const categorias: Record<string, string> = {
        'trabajo': '💼',
        'personal': '👤',
        'salud': '🏥',
        'educacion': '📚',
        'social': '👥',
        'deporte': '⚽',
        'viaje': '✈️',
        'reunion': '🤝'
    };
    return categorias[categoria?.toLowerCase() || ''] || '📅';
};

export const EventModal: React.FC<Props> = ({
    isOpen,
    onRequestClose,
    event,
}) => {
    const {
        descripcion,
        ubicacion,
        organizador,
        categoria,
        prioridad,
        ...otrosCampos
    } = obtenerPropsExtendidos(event);

    const fechaInicio = event?.start ? formatearFecha(event.start) : '';
    const horaInicio = event?.start ? formatearHora(event.start) : '';
    const fechaFin = event?.end ? formatearFecha(event.end) : '';
    const horaFin = event?.end ? formatearHora(event.end) : '';

    const prioridadInfo = obtenerIconoPrioridad(prioridad);
    const iconoCategoria = obtenerIconoCategoria(categoria);

    const duracionEnMinutos = event?.start && event?.end 
        ? Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))
        : null;

    const ahora = new Date();
    const eventoPorCaducar = event?.end && event.end.getTime() - ahora.getTime() <= 24 * 60 * 60 * 1000 && event.end.getTime() > ahora.getTime();
    const eventoVencido = event?.end && event.end.getTime() < ahora.getTime();

    const formatearDuracion = (minutos: number): string => {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        if (horas > 0) {
            return mins > 0 ? `${horas}h ${mins}m` : `${horas}h`;
        }
        return `${mins}m`;
    };

    const modalStyles = {
        content: {
            background: 'transparent',
            border: 'none',
            padding: '0',
            width: '520px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            margin: 'auto',
            overflow: 'hidden',
            position: 'relative' as const,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detalles del Evento"
            ariaHideApp={false}
            style={modalStyles}
        >
            <div className={`event-modal ${eventoPorCaducar ? "por-caducar" : eventoVencido ? "vencido" : "activo"}`}>
                {/* Header */}
                <div className="event-modal-header">
                    {eventoPorCaducar && (
                        <div className="alerta caducar">
                            <span>⚠️</span>
                            El evento está a punto de caducar
                        </div>
                    )}
                    {eventoVencido && (
                        <div className="alerta vencido">
                            <span>❌</span>
                            Este evento ya ha finalizado
                        </div>
                    )}

                    <div className="header-main">
                        <h2>{iconoCategoria} {event?.title || "Evento sin título"}</h2>
                        <button className="close-btn" onClick={onRequestClose}>✕</button>
                    </div>

                    <div className="tags">
                        {categoria && (
                            <span className="tag">{iconoCategoria} {categoria}</span>
                        )}
                        {prioridadInfo && (
                            <span className="tag">{prioridadInfo.icon} Prioridad {prioridadInfo.label}</span>
                        )}
                        {duracionEnMinutos && (
                            <span className="tag">⏱️ {formatearDuracion(duracionEnMinutos)}</span>
                        )}
                    </div>
                </div>

                {/* Contenido */}
                <div className="event-modal-content">
                    {descripcion && (
                        <div className="info-item">
                            <span>📝</span>
                            <div>
                                <div className="label">Descripción</div>
                                <div className="value">{descripcion}</div>
                            </div>
                        </div>
                    )}

                    {(fechaInicio || horaInicio) && (
                        <div className="info-item">
                            <span>🕒</span>
                            <div>
                                <div className="label">Fecha y Hora</div>
                                <div className="value">
                                    <div><strong>Inicio:</strong> {fechaInicio} {horaInicio && `a las ${horaInicio}`}</div>
                                    {(fechaFin || horaFin) && (
                                        <div><strong>Fin:</strong> {fechaFin} {horaFin && `a las ${horaFin}`}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {ubicacion && (
                        <div className="info-item">
                            <span>📍</span>
                            <div>
                                <div className="label">Ubicación</div>
                                <div className="value">{ubicacion}</div>
                            </div>
                        </div>
                    )}

                    {organizador && (
                        <div className="info-item">
                            <span>👤</span>
                            <div>
                                <div className="label">Organizador</div>
                                <div className="value">{organizador}</div>
                            </div>
                        </div>
                    )}

                    {Object.entries(otrosCampos)
                        .filter(([_, valor]) => valor && !['descripcion', 'ubicacion', 'organizador', 'categoria', 'prioridad'].includes(_))
                        .map(([clave, valor]) => (
                            <div key={clave} className="info-item">
                                <span>ℹ️</span>
                                <div>
                                    <div className="label">{clave.charAt(0).toUpperCase() + clave.slice(1).replace(/([A-Z])/g, ' $1')}</div>
                                    <div className="value">{String(valor)}</div>
                                </div>
                            </div>
                        ))
                    }

                    <div className="footer">
                        <button className="footer-btn" onClick={onRequestClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
