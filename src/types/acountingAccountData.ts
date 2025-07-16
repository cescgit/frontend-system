import { z } from "zod";


// * Data accountAccounting
const accountingAccountShema = z.object({
    id: z.string(),
    numero_cuenta: z.string(),
    descripcion: z.string(),
    nivel_cuenta: z.string(),
    ruc: z.number(),
    centro_costo: z.number(),
    balance: z.string(),
    id_tipo_cuenta: z.string(),
    tipo_cuenta: z.string(),
    fecha_creacion: z.string()
});

export const accountingAccountDataSchema = z.array(
    accountingAccountShema.pick({
        id: true,
        numero_cuenta: true,
        descripcion: true,
        nivel_cuenta: true,
        ruc: true,
        centro_costo: true,
        balance: true,
        id_tipo_cuenta: true,
        tipo_cuenta: true,
        fecha_creacion: true
    })
)

export type AccountingAccount = z.infer<typeof accountingAccountShema>;

// * Form data account accounting
const accountingAccountFormShema = z.object({
    id: z.string(),
    numero_cuenta: z.string(),
    descripcion: z.string(),
    nivel_cuenta: z.string(),
    ruc: z.number(),
    centro_costo: z.number(),
    balance: z.string(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    id_tipo_cuenta: z.string(),
    tipo_cuenta: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
});

export const accountingAccountFormDataSchema = z.array(
    accountingAccountFormShema.pick({
        id: true,
        numero_cuenta: true,
        descripcion: true,
        nivel_cuenta: true,
        ruc: true,
        centro_costo: true,
        balance: true,
        fecha_creacion: true,
        fecha_modificacion: true,
        id_tipo_cuenta: true,
        tipo_cuenta: true,
        usuario_creador: true,
        usuario_modificador: true
    })
)

export type AccountingAccountData = z.infer<typeof accountingAccountFormShema>;
export type AccountingAccountFormData = Pick<AccountingAccountData,
    "id" |
    "numero_cuenta" |
    "descripcion" |
    "nivel_cuenta" |
    "ruc" |
    "centro_costo" |
    "balance" |
    "fecha_creacion" |
    "fecha_modificacion" |
    "id_tipo_cuenta" |
    "tipo_cuenta" |
    "usuario_creador" |
    "usuario_modificador">;

export type AccountingAccountFormDataAdd = Pick<AccountingAccountData,
    "numero_cuenta" |
    "descripcion" |
    "nivel_cuenta" |
    "ruc" |
    "centro_costo" |
    "balance" |
    "id_tipo_cuenta" |
    "usuario_creador"
>;

export type AccountingAccountFormDataInfo = Pick<AccountingAccountData,
    "id" |
    "numero_cuenta" |
    "descripcion" |
    "nivel_cuenta" |
    "ruc" |
    "centro_costo" |
    "id_tipo_cuenta" |
    "balance"
>;
export type AccountingAccountFormDataEdit = Pick<AccountingAccountData,
    "id" |
    "numero_cuenta" |
    "descripcion" |    
    "nivel_cuenta" |
    "ruc" |
    "centro_costo" |
    "balance" |
    "id_tipo_cuenta" |
    "usuario_modificador"
>;
export type AccountingAccountFormDataDelete = Pick<AccountingAccountData,
    "id" |
    "numero_cuenta" |
    "descripcion"
    >;

export interface DataItemAccountingAccount {
    value: string;
    label: string;
}