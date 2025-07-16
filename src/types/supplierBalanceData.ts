import { z } from "zod";


// * Data supplier balance
const supplierBalanceShema = z.object({
  id: z.string(),
  codigo_proveedor: z.string(),
  nombre_proveedor: z.string(),
  credito: z.string(),
  debito: z.string(),
  balance: z.string(),
  estado: z.number().nullable(),
  estado_credito: z.number().nullable(),
  id_proveedor: z.string(),
  fecha_emision: z.string(),
});

export const supplierBalanceDataSchema = z.array(
  supplierBalanceShema.pick({
    id: true,
    codigo_proveedor: true,
    nombre_proveedor: true,
    credito: true,
    debito: true,
    balance: true,
    estado: true,
    estado_credito: true,
    id_proveedor: true,
    fecha_emision: true,
  })
)

export type supplierBalance = z.infer<typeof supplierBalanceShema>;

// * Form data supplier balance
const supplierBalanceFormShema = z.object({
  id: z.string(),
  codigo_proveedor: z.string().nullable(),
  nombre_proveedor: z.string(),
  credito: z.string(),
  debito: z.string(),
  balance: z.string(),
  estado: z.number().nullable(),
  estado_credito: z.number().nullable(),
  id_proveedor: z.string(),
  fecha_emision: z.string(),
  fecha_vencimiento: z.string().nullable(),
});

export const supplierBalanceFormDataSchema = z.array(
  supplierBalanceFormShema.pick({
    id: true,
    codigo_proveedor: true,
    nombre_proveedor: true,
    credito: true,
    debito: true,
    balance: true,
    estado: true,
    estado_credito: true,
    id_proveedor: true,
    fecha_emision: true,
    fecha_vencimiento: true
  })
)

export type SupplierBalanceData = z.infer<typeof supplierBalanceFormShema>;
export type SupplierBalanceFormData = Pick<SupplierBalanceData, "id" | "codigo_proveedor" | "nombre_proveedor" | "credito" | "debito" | "balance" | "estado" | "estado_credito" | "fecha_emision" | "fecha_vencimiento">;

export type SupplierBalanceFormDataInfo = Pick<SupplierBalanceData, "id" | "codigo_proveedor" | "nombre_proveedor" | "credito" | "debito" | "balance" | "estado" | "estado_credito" | "fecha_emision" | "fecha_vencimiento">;
export type SupplierBalanceFormDataEdit = Pick<SupplierBalanceData, "id" | "codigo_proveedor" | "nombre_proveedor" | "credito">;


// * Form data supplier balance by id supplier
const supplierBalanceFormShemaSupplier = z.object({
  id: z.string(),
  descripcion: z.string(),
  numero_compra: z.string().nullable().optional(),
  fecha_emision: z.string(),
  fecha_vencimiento: z.string().nullable().optional(),
  debito: z.string().nullable().optional(),
  credito: z.string(),
  balance: z.string(),
  id_proveedor: z.string(),
  usuario_creador: z.string(),
  id_balance_proveedor: z.string(),
  estado: z.number().nullable(),
  descripcion_anulacion: z.string().nullable().optional()
});

export const supplierBalanceFormDataSchemaSupplier = z.array(
  supplierBalanceFormShemaSupplier.pick({
    id: true,
    descripcion: true,    
    numero_compra: true,
    fecha_emision: true,
    fecha_vencimiento: true,
    debito: true,
    credito: true,
    balance: true,
    id_proveedor: true,
    id_balance_proveedor: true,
    estado: true,
    descripcion_anulacion: true
  })
)

export type SupplierBalanceDataSupplier = z.infer<typeof supplierBalanceFormShemaSupplier>;
export type SupplierBalanceFormDataSupplier = Pick<SupplierBalanceDataSupplier,
  "id" |
  "descripcion" |
  "numero_compra" |
  "fecha_vencimiento" |
  "debito" |
  "credito" |
  "balance" |
  "id_proveedor" |
  "id_balance_proveedor" |
  "estado"
>;

export type SupplierBalanceFormDetails = Pick<SupplierBalanceDataSupplier,
  "id" |
  "descripcion" |  
  "fecha_vencimiento" |
  "fecha_emision" |
  "debito" |
  "credito" |
  "balance" |
  "id_proveedor" |
  "id_balance_proveedor" |
  "usuario_creador" |
  "estado" |
  "descripcion_anulacion"
>;

export type SupplierBalanceFormDataSupplierAdd = Pick<SupplierBalanceDataSupplier,
  "descripcion" |
  "debito" |
  "id_proveedor" |
  "usuario_creador"
>;

export type SupplierBalanceFormDataSupplierCancel = Pick<SupplierBalanceDataSupplier,
  "descripcion_anulacion" |
  "estado" |
  "usuario_creador"
>;

export interface DataItemSupplierBalance {
  value: string;
  label: string;
}