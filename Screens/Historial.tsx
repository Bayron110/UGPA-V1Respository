import { useEventos } from '../Components/Record/useEventos';
import ExportarYLimpiar from '../Components/Record/ExportaryLimpiar';
import EventoItem from '../Components/Record/EventoItem';

function Historial() {
  const {
    eventos,
    cargando,
    eliminarEvento,
    actualizarEvento,
    limpiarTodos,
  } = useEventos();

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#0f0f1e",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h2 style={{ color: "#00f2ff", marginBottom: "1rem" }}>
        📜 Historial de Eventos
      </h2>

      <ExportarYLimpiar eventos={eventos} limpiar={limpiarTodos} />

      {cargando ? (
        <p>⏳ Cargando eventos...</p>
      ) : eventos.length === 0 ? (
        <p>🕸️ No hay eventos registrados aún.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {eventos.map((evento) => (
            <EventoItem
              key={evento.id}
              evento={evento}
              onEliminar={eliminarEvento}
              onActualizar={(id, cambios) =>
                actualizarEvento(id, cambios).then(() => {
                  // opcional: feedback
                })
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Historial;