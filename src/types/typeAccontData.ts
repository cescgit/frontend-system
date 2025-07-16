import { z } from "zod";


// * Data type account
const typeAccountShema = z.object({
    id: z.string(),
    nombre: z.string(),
    descripcion: z.string(),    
    fecha_creacion: z.string()
});

export const typeAccountDataSchema = z.array(
    typeAccountShema.pick({
        id: true,
        nombre: true,
        descripcion: true,        
        fecha_creacion: true
    })
)

export type TypeAccount = z.infer<typeof typeAccountShema>;

// * Form data type account
const typeAccountFormShema = z.object({
    id: z.string(),
    nombre: z.string(),
    descripcion: z.string(),    
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),    
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
});

export const typeAccountFormDataSchema = z.array(
    typeAccountFormShema.pick({
        id: true,
        nombre: true,
        descripcion: true,        
        fecha_creacion: true,
        fecha_modificacion: true,        
        usuario_creador: true,
        usuario_modificador: true
    })
)

export type TypeAccountData = z.infer<typeof typeAccountFormShema>;
export type TypeAccountFormData = Pick<TypeAccountData,
    "id" |
    "nombre" |
    "descripcion" |    
    "fecha_creacion" |
    "fecha_modificacion" |    
    "usuario_creador" |
    "usuario_modificador"
    >;

export type TypeAccountFormDataAdd = Pick<TypeAccountData,
    "nombre" |
    "descripcion" |    
    "fecha_creacion" |      
    "usuario_creador"    
>;

export type TypeAccountFormDataInfo = Pick<TypeAccountData,
    "id" |
    "nombre" |
    "descripcion"    
>;
export type TypeAccountFormDataEdit = Pick<TypeAccountData,
    "id" |
    "nombre" |
    "descripcion" |       
    "usuario_modificador"
>;
// export type AccountingAccountFormDataDelete = Pick<TypeAccountData,
//     "id" |
//     "numero_cuenta" |
//     "descripcion"
//     >;

export interface DataItemTypeAccount {
    value: string;
    label: string;
}