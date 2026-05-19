// ============================================================
// AppCasa · Modelos de dominio
// ============================================================

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

export interface CatalogoValor {
  codigo: string;
  label: string;
}

// ---

export interface Hogar extends BaseEntity {
  nombre: string;
  descripcion?: string;
  codigo: string;
  idEstado: number;
}

// ---

export interface Usuario extends BaseEntity {
  nombre: string;
  apellidos?: string;
  email: string;
  avatarUrl?: string;
  tema: 'CLARO' | 'OSCURO';
  locale: string;
  idEstado: number;
}

// ---

export type TipoMiembro =
  | 'PERSONA'
  | 'PERRO'
  | 'GATO'
  | 'TORTUGA'
  | 'AVE'
  | 'OTRO';

export interface MiembroHogar extends BaseEntity {
  idHogar: string;
  idTipoMiembro: number;
  tipoMiembro?: TipoMiembro;
  nombre: string;
  fechaNacimiento?: string;
  avatarUrl?: string;
  notas?: string;
  // Mascota
  raza?: string;
  color?: string;
  pesoKg?: number;
  microchip?: string;
  esterilizado?: boolean;
  // Persona
  idUsuario?: string;
  idEstado: number;
}

// ---

export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type Periodicidad =
  | 'DIARIA'
  | 'SEMANAL'
  | 'MENSUAL'
  | 'ANUAL'
  | 'CUSTOM';

export interface Tarea extends BaseEntity {
  hogarCodigo: string;
  titulo: string;
  descripcion?: string;
  prioridad: CatalogoValor;
  categoria?: string;
  fechaLimite?: string;
  fechaCompletada?: string;
  esPeriodica: boolean;
  periodicidad?: CatalogoValor;
  reglaRecurrencia?: string;
  esPersonal: boolean;
  adjuntoUrl?: string;
  estado: CatalogoValor;
  asignaciones?: TareaAsignacion[];
}

export interface TareaAsignacion extends BaseEntity {
  miembroId: string;
  nombreMiembro?: string;
  miembro?: MiembroHogar;
  aceptada?: boolean;
}

// ---

export type TipoRecordatorio =
  | 'PUNTUAL'
  | 'DIARIO'
  | 'SEMANAL'
  | 'MENSUAL'
  | 'ANUAL'
  | 'CUSTOM';

export interface Recordatorio extends BaseEntity {
  idHogar: string;
  titulo: string;
  descripcion?: string;
  idTipoRecordatorio: number;
  tipoRecordatorio?: TipoRecordatorio;
  fechaHora: string;
  reglaRecurrencia?: string;
  anticipacionMinutos: number;
  activo: boolean;
  idTarea?: string;
  idMiembro?: string;
  idEvento?: string;
  idEstado: number;
}

// ---

export type TipoEvento =
  | 'CUMPLEANOS'
  | 'VACUNA'
  | 'VETERINARIO'
  | 'CITA_MEDICA'
  | 'ANIVERSARIO'
  | 'OTRO';

export interface Evento extends BaseEntity {
  idHogar: string;
  idTipoEvento: number;
  tipoEvento?: TipoEvento;
  titulo: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  todoElDia: boolean;
  esAnual: boolean;
  idMiembro?: string;
  miembro?: MiembroHogar;
  idEstado: number;
}

// ---

export type TipoLista =
  | 'COMPRA'
  | 'FARMACIA'
  | 'VETERINARIO'
  | 'VIAJE'
  | 'OTRO';

export interface Lista extends BaseEntity {
  idHogar: string;
  nombre: string;
  tipo: TipoLista;
  icono?: string;
  color?: string;
  idEstado: number;
  items?: ListaItem[];
}

export interface ListaItem extends BaseEntity {
  idLista: string;
  descripcion: string;
  cantidad?: number;
  unidad?: string;
  completado: boolean;
  orden: number;
}

// ---

export interface Herramienta extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  ruta?: string;
  version: number;
  activa: boolean;
  esCore: boolean;
  orden: number;
}

// ---

export interface DashboardResumen {
  tareasPendientes: number;
  tareasHoy: Tarea[];
  proximosRecordatorios: Recordatorio[];
  cumpleanosProximos: Evento[];
  miembros: MiembroHogar[];
}
