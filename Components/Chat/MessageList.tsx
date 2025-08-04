
import React from "react";
import type { Mensaje } from "./types";
import MessageBubble from "./MessageBubble";

interface Props {
    mensajes: Mensaje[];
    containerRef: React.RefObject<HTMLDivElement | null>;
}


const MessageList: React.FC<Props> = ({ mensajes, containerRef }) => {
    return (
        <div
            ref={containerRef}
            style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "1.5rem",
                padding: "1rem",
                border: "1px solid #333",
                borderRadius: "10px",
                maxHeight: "60vh",
            }}
        >
            {mensajes.map((msg, idx) => (
                <MessageBubble key={idx} mensaje={msg} />
            ))}
        </div>
    );
};

export default MessageList;
