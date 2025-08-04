import React from "react";
import type { EventContentArg } from "@fullcalendar/core";

export const EventCard: React.FC<{ arg: EventContentArg }> = ({ arg }) => {
    const { event, view } = arg;

    if (view.type === "timeGridDay") {
        return (
            <div
                style={{
                    backgroundColor: "#00f2ff",
                    color: "#000",
                    borderRadius: "10px",
                    padding: "0.8rem",
                    boxShadow: "0 0 8px rgba(0, 242, 255, 0.4)",
                    fontWeight: "bold",
                }}
            >
                <div>{event.title}</div>
                <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                    🕒{" "}
                    {event.start?.toLocaleTimeString("es-ES", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    })}
                </div>
            </div>
        );
    }

    return null; 
};
