// src/utils/googleCalendar.ts

export function abrirGoogleCalendar(evento: string, fechaInicio: Date, fechaFin: Date) {
  const formatoFecha = (date: Date) => {
    // Convierte a formato YYYYMMDDTHHmmssZ (UTC sin guiones ni dos puntos)
    return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
  };

  const start = formatoFecha(fechaInicio);
  const end = formatoFecha(fechaFin);

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", evento);
  url.searchParams.set("dates", `${start}/${end}`);
  url.searchParams.set("details", "Evento agendado desde mi app");
  // url.searchParams.set("location", "Mi ubicación"); // Opcional

  window.open(url.toString(), "_blank");
}
