export interface Taller {
  id: number;
  nombre: string;
  categoria: string;
  instructor: string;
  precio: number;
  cupoTotal: number;
  cupoDisponible: number;
  fechaInicio: string;
}

export type EstadoInscripcion = 'Activa' | 'Retirada';

export interface Inscripcion {
  id?: number;
  tallerId: number;
  tallerNombre: string;
  estudiante: string;
  ci: string;
  email: string;
  fecha: string;
  estado: EstadoInscripcion;
  fechaRetiro?: string;
}

export type NuevaInscripcion = Pick<Inscripcion, 'tallerId' | 'estudiante' | 'ci' | 'email'>;
