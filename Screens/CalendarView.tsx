import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { Evento } from "../src/types";
import type { EventClickArg } from "@fullcalendar/core";

import "../Components/Calendar/calendar.css";
import { useEventos } from "../Components/Calendar/useEventos";
import Modal from 'react-modal';
import { corregirFechaZonaHoraria } from "../Components/Calendar/fecha";
import { Button } from "../Components/Calendar/Button";
import { EventCard } from "../Components/Calendar/EventCard";
import { EventModal } from "../Components/Calendar/EventModal";

function CalendarView() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] =
    useState<EventClickArg["event"] | null>(null);
  const eventos = useEventos();
  const navigate = useNavigate();

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const eventosFormateados = eventos.map((evento: Evento) => ({
    title: evento.nombre,
    start: corregirFechaZonaHoraria(evento.fechaInicio),
    end: corregirFechaZonaHoraria(evento.fechaFin),
    extendedProps: {
      descripcion: evento.descripcion,
    },
  }));

  const abrirModal = (info: EventClickArg) => {
    setEventoSeleccionado(info.event);
    setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setEventoSeleccionado(null);
  };

  const containerStyles = {
    padding: "2rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: "relative" as const,
    overflow: "hidden",
  };

  const backgroundEffectStyles = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 118, 117, 0.3) 0%, transparent 50%)
    `,
    zIndex: 0,
  };

  const contentStyles = {
    position: "relative" as const,
    zIndex: 1,
  };

  const headerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    padding: "1.5rem 2rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  };

  const titleStyles = {
    fontSize: "2.5rem",
    fontWeight: 800,
    background: "linear-gradient(45deg, #fff, #e0e7ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "none",
    margin: 0,
  };

  const buttonContainerStyles = {
    display: "flex",
    gap: "0.75rem",
  };

  const calendarContainerStyles = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  };

  const noEventsStyles = {
    color: "#64748b",
    marginBottom: "1.5rem",
    fontSize: "1.1rem",
    textAlign: "center" as const,
    padding: "2rem",
    background: "rgba(248, 250, 252, 0.8)",
    borderRadius: "12px",
    border: "2px dashed rgba(148, 163, 184, 0.4)",
  };

  const customCalendarStyles = `
    .fc {
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }
    
    .fc-theme-standard .fc-scrollgrid {
      border: none;
    }
    
    .fc-theme-standard td, .fc-theme-standard th {
      border-color: rgba(148, 163, 184, 0.2);
    }
    
    .fc-col-header-cell {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border: none;
      padding: 1rem 0.5rem;
      font-weight: 600;
      color: #475569;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .fc-daygrid-day-number, .fc-timegrid-slot-label {
      color: #64748b;
      font-weight: 500;
    }
    
    .fc-button-group .fc-button {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      border-radius: 8px;
      font-weight: 500;
      text-transform: none;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
      margin: 0 2px;
    }
    
    .fc-button-group .fc-button:hover {
      background: linear-gradient(135deg, #5a67d8, #6b46c1);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .fc-button-group .fc-button:focus {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
    }
    
    .fc-button-active {
      background: linear-gradient(135deg, #5a67d8, #6b46c1) !important;
    }
    
    .fc-toolbar-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      text-align: center;
    }
    
    .fc-today {
      background-color: rgba(102, 126, 234, 0.05) !important;
    }
    
    .fc-day-today .fc-daygrid-day-number {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 4px auto;
      font-weight: 600;
    }
    
    .custom-event {
      border: none;
      border-radius: 6px;
      padding: 4px 8px;
      margin: 1px;
      background: linear-gradient(135deg, #ff6b6b, #ffa726);
      color: white;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
      transition: all 0.2s ease;
    }
    
    .custom-event:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
      z-index: 10;
    }
    
    .fc-event-title {
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .fc-timegrid-slot {
      height: 3rem;
    }
    
    .fc-timegrid-slot-minor {
      border-top: 1px dashed rgba(148, 163, 184, 0.2);
    }
    
    .fc-scrollgrid-sync-table {
      border-radius: 12px;
      overflow: hidden;
    }
    
    .fc-scroller::-webkit-scrollbar {
      width: 6px;
    }
    
    .fc-scroller::-webkit-scrollbar-track {
      background: rgba(148, 163, 184, 0.1);
      border-radius: 3px;
    }
    
    .fc-scroller::-webkit-scrollbar-thumb {
      background: rgba(102, 126, 234, 0.3);
      border-radius: 3px;
    }
    
    .fc-scroller::-webkit-scrollbar-thumb:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  `;

  return (
    <>
      <style>{customCalendarStyles}</style>
      <div style={containerStyles}>
        <div style={backgroundEffectStyles}></div>
        
        <div style={contentStyles}>
          <header style={headerStyles}>
            <h2 style={titleStyles}>
              🗓️ Panel de Agendamientos
            </h2>
            <div style={buttonContainerStyles}>
              <Button 
                onClick={() => navigate("/")}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  padding: "0.75rem 1.5rem",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(0px)";
                }}
              >
                🔙 Volver al chat
              </Button>
              <Button
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.75rem 1.5rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
                }}
              >
                ➕ Agregar nuevo
              </Button>
            </div>
          </header>

          <div style={calendarContainerStyles}>
            {eventos.length === 0 && (
              <div style={noEventsStyles}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
                <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 500 }}>
                  No hay eventos cargados desde la base de datos.
                </p>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.95rem", color: "#94a3b8" }}>
                  Agrega tu primer evento para comenzar a organizar tu calendario.
                </p>
              </div>
            )}

            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              locale={esLocale}
              height="auto"
              nowIndicator
              events={eventosFormateados}
              eventClick={abrirModal}
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
              eventClassNames={() => "custom-event"}
              eventContent={(arg) => <EventCard arg={arg} />}
              dayMaxEvents={3}
              moreLinkText="más eventos"
              eventDisplay="block"
              displayEventTime={true}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              weekends={true}
              selectMirror={true}
              dayHeaderFormat={{
                weekday: 'short',
                day: 'numeric'
              }}
            />
          </div>

          <EventModal
            isOpen={modalIsOpen}
            onRequestClose={cerrarModal}
            event={eventoSeleccionado}
          />
        </div>
      </div>
    </>
  );
}

export default CalendarView;