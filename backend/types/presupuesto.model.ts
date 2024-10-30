// presupuesto.model.ts
export interface Presupuesto {
    id?: number;
    nombre_presupuesto: string;
    descripcion_presupuesto?: string;
    cliente_id: number;
    empresa_id: number;
    jefe_proyecto_id?: number | null; // Puede ser null
    fecha: Date;
    created_at?: Date;
    updated_at?: Date;
  }
