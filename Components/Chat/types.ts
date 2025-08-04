
export interface Mensaje {
    emisor: "usuario" | "sistema";
    contenido: string;
}

export interface EventoPendiente {
    nombre: string;
    descripcion: string;
    fechaInicio: Date ;
    fechaFin: Date | null;
    horaInicio: string;
    horaFin: string;
}
