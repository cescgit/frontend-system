import { z } from "zod";


// * Data customer balance
const customerBalanceShema = z.object({
    id: z.string(),
    codigo_cliente: z.string(),
    nombre_cliente: z.string(),
    credito: z.string(),
    debito: z.string(),
    balance: z.string(),
    estado: z.number().nullable(),
    estado_credito: z.number().nullable(),
    id_cliente: z.string(),
    fecha_emision: z.string(),
});

export const customerBalanceDataSchema = z.array(
    customerBalanceShema.pick({
        id: true,
        codigo_cliente: true,
        nombre_cliente: true,
        credito: true,
        debito: true,
        balance: true,
        estado: true,
        estado_credito: true,
        id_cliente: true,
        fecha_emision: true,
    })
)

export type customerBalance = z.infer<typeof customerBalanceShema>;

// * Form data customer balance
const customerBalanceFormShema = z.object({
    id: z.string(),
    codigo_cliente: z.string().nullable(),
    nombre_cliente: z.string(),
    credito: z.string(),
    debito: z.string(),
    balance: z.string(),
    estado: z.number().nullable(),
    estado_credito: z.number().nullable(),
    id_cliente: z.string(),
    fecha_emision: z.string(),
    fecha_vencimiento: z.string().nullable(),
});

export const customerBalanceFormDataSchema = z.array(
    customerBalanceFormShema.pick({
        id: true,
        codigo_cliente: true,
        nombre_cliente: true,
        credito: true,
        debito: true,
        balance: true,
        estado: true,
        estado_credito: true,
        id_cliente: true,
        fecha_emision: true,
        fecha_vencimiento: true
    })
)

export type CustomerBalanceData = z.infer<typeof customerBalanceFormShema>;

export type CustomerBalanceFormData = Pick<CustomerBalanceData,
    "id" |
    "codigo_cliente" | 
    "nombre_cliente" | 
    "credito" | 
    "debito" | 
    "balance" | 
    "estado" | 
    "estado_credito" | 
    "fecha_emision" | 
    "fecha_vencimiento"
>;

export type CustomerBalanceFormDataInfo = Pick<CustomerBalanceData, 
"id" | 
"codigo_cliente" | 
"nombre_cliente" | 
"credito" | 
"debito" | 
"balance" | 
"estado" | 
"estado_credito" | 
"fecha_emision" | 
"fecha_vencimiento"
>;

export type CustomerBalanceFormDataEdit = Pick<CustomerBalanceData, 
"id" | 
"codigo_cliente" | 
"nombre_cliente" | 
"credito"
>;


// * Form data customer balance by id customer
const customerBalanceFormShemaCustomer = z.object({
    id: z.string(),
    descripcion: z.string(),
    numero_venta: z.string().nullable().optional(),
    fecha_emision: z.string(),
    fecha_vencimiento: z.string().nullable().optional(),
    debito: z.string().nullable().optional(),
    credito: z.string(),
    balance: z.string(),
    id_cliente: z.string(),
    usuario_creador: z.string(),
    id_balance_cliente: z.string(),
    estado: z.number().nullable(),
    descripcion_anulacion: z.string().nullable().optional()
});

export const customerBalanceFormDataSchemaCustomer = z.array(
    customerBalanceFormShemaCustomer.pick({
        id: true,
        descripcion: true,
        numero_venta: true,
        fecha_emision: true,
        fecha_vencimiento: true,
        debito: true,
        credito: true,
        balance: true,
        id_cliente: true,
        id_balance_cliente: true,
        estado: true,
        descripcion_anulacion: true
    })
)

export type CustomerBalanceDataCustomer = z.infer<typeof customerBalanceFormShemaCustomer>;
export type CustomerBalanceFormDataCustomer = Pick<CustomerBalanceDataCustomer,
    "id" |
    "descripcion" |
    "numero_venta" |
    "fecha_vencimiento" |
    "debito" |
    "credito" |
    "balance" |
    "id_cliente" |
    "id_balance_cliente" |
    "estado"
>;

export type CustomerBalanceFormDetails = Pick<CustomerBalanceDataCustomer,
    "id" |
    "descripcion" |
    "fecha_vencimiento" |
    "fecha_emision" |
    "debito" |
    "credito" |
    "balance" |
    "id_cliente" |
    "id_balance_cliente" |
    "usuario_creador" |
    "estado" |
    "descripcion_anulacion"
>;

export type CustomerBalanceFormDataCustomerAdd = Pick<CustomerBalanceDataCustomer,
    "descripcion" |
    "debito" |
    "id_cliente" |
    "usuario_creador"
>;

export type CustomerBalanceFormDataCustomerCancel = Pick<CustomerBalanceDataCustomer,
    "descripcion_anulacion" |
    "estado" |
    "usuario_creador"
>;

export interface DataItemCustomerBalance {
    value: string;
    label: string;
}