// src/components/Chat/InputBar.tsx
import React from "react";

interface Props {
  texto: string;
  setTexto: (t: string) => void;
  manejarEnvio: () => void;
}

const InputBar: React.FC<Props> = ({ texto, setTexto, manejarEnvio }) => {
  return (
    <div style={{ display: "flex" }}>
      <input
        type="text"
        placeholder="Escribe tu mensaje aquí..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && manejarEnvio()}
        style={{
          flex: 1,
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          outline: "none",
        }}
      />
      <button
        onClick={manejarEnvio}
        style={{
          marginLeft: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#00f2ff",
          color: "#000",
          fontWeight: "bold",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Enviar
      </button>
    </div>
  );
};

export default InputBar;
