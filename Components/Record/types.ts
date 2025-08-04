export interface Evento {
    id?: string;
    nombre: string;
    descripcion?: string;
    fechaInicio?: string;
    horaInicio?: string;
    fechaFin?: string;
    horaFin?: string;
    timestamp?: number;
    creadoEn?: string;
}
