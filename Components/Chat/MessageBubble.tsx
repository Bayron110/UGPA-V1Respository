// src/components/Chat/MessageBubble.tsx
import React from "react";
import type{ Mensaje } from "./types";

interface Props {
    mensaje: Mensaje;
}

const MessageBubble: React.FC<Props> = ({ mensaje }) => {
    const isUsuario = mensaje.emisor === "usuario";
    return (
        <div
            style={{
                textAlign: isUsuario ? "right" : "left",
                marginBottom: "0.5rem",
            }}
        >
            <span
                style={{
                    display: "inline-block",
                    padding: "0.6rem 1rem",
                    borderRadius: "15px",
                    backgroundColor: isUsuario ? "#00f2ff" : "#333",
                    color: isUsuario ? "#000" : "#fff",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                }}
            >
                {mensaje.contenido}
            </span>
        </div>
    );
};

export default MessageBubble;
