import React from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../Components/Chat/useChat";
import MessageList from "../Components/Chat/MessageList";
import InputBar from "../Components/Chat/InputBar";

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { texto, setTexto, mensajes, manejarEnvio, chatContainerRef } = useChat();

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#0f0f1e",
        minHeight: "100vh",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <h2 style={{ color: "#00f2ff" }}>Agendamiento Automático</h2>
      <button
        onClick={() => navigate("/calendario")}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          backgroundColor: "#00f2ff",
          border: "none",
          borderRadius: "8px",
          padding: "0.5rem 1rem",
          fontSize: "0.9rem",
          cursor: "pointer",
          color: "#000",
          boxShadow: "0 0 10px #00f2ff",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.backgroundColor = "#00d4e0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#00f2ff";
        }}
      >
        🕒 Historial
      </button>

      <MessageList mensajes={mensajes} containerRef={chatContainerRef} />
      <InputBar texto={texto} setTexto={setTexto} manejarEnvio={manejarEnvio} />
    </div>
  );
};

export default Chat;