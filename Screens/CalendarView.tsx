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

  return (
    <div
      style={{
        padding: "2rem",
        background: "linear-gradient(to bottom, #0f0f23, #121227)",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#00f2ff",
            textShadow: "0 0 5px rgba(0, 242, 255, 0.6)",
          }}
        >
          🗓️ Panel de Agendamientos
        </h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button onClick={() => navigate("/")}>🔙 Volver al chat</Button>
          <Button>➕ Agregar nuevo</Button>
        </div>
      </header>

      <div
        style={{
          backgroundColor: "#1c1c3a",
          borderRadius: "14px",
          padding: "1.5rem",
          boxShadow: "0 0 20px rgba(0, 242, 255, 0.15)",
        }}
      >
        {eventos.length === 0 && (
          <p style={{ color: "#ccc", marginBottom: "1rem" }}>
            No hay eventos cargados desde la base de datos.
          </p>
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
        />
      </div>

      <EventModal
        isOpen={modalIsOpen}
        onRequestClose={cerrarModal}
        event={eventoSeleccionado}

      />
    </div>
  );
}

export default CalendarView;
