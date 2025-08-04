import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, style, ...rest }) => {
    return (
        <button
            {...rest}
            style={{
                padding: "0.6rem 1.2rem",
                backgroundColor: "#00f2ff",
                color: "#000",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 8px #00f2ff",
                transition: "transform 0.2s ease",
                ...style,
            }}
        >
            {children}
        </button>
    );
};
