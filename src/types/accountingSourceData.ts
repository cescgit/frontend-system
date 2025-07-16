import { z } from "zod";


// * Data accounting source
const accountingSourceShema = z.object({
    id: z.string(),
    codigo: z.string(),
    descripcion: z.string(),    
    fecha_creacion: z.string()
});

export const accountingSourceDataSchema = z.array(
    accountingSourceShema.pick({
        id: true,
        codigo: true,
        descripcion: true,        
        fecha_creacion: true
    })
)

export type accountingSource = z.infer<typeof accountingSourceShema>;

// * Form data accounting source
const accountingSourceFormShema = z.object({
    id: z.string(),
    codigo: z.string(),
    descripcion: z.string(),    
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),    
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
});

export const accountingSourceFormDataSchema = z.array(
    accountingSourceFormShema.pick({
        id: true,
        codigo: true,
        descripcion: true,        
        fecha_creacion: true,
        fecha_modificacion: true,        
        usuario_creador: true,
        usuario_modificador: true
    })
)

export type AccountingSourceData = z.infer<typeof accountingSourceFormShema>;
export type AccountingSourceFormData = Pick<AccountingSourceData,
    "id" |
    "codigo" |
    "descripcion" |    
    "fecha_creacion" |
    "fecha_modificacion" |    
    "usuario_creador" |
    "usuario_modificador"
    >;

export type AccountingSourceFormDataAdd = Pick<AccountingSourceData,
    "codigo" |
    "descripcion" |    
    "fecha_creacion" |      
    "usuario_creador"    
>;

export type AccountingSourceFormDataInfo = Pick<AccountingSourceData,
    "id" |
    "codigo" |
    "descripcion"    
>;
export type AccountingSourceFormDataEdit = Pick<AccountingSourceData,
    "id" |
    "codigo" |
    "descripcion" |       
    "usuario_modificador"
>;

export interface DataItemAccountingSource {
    value: string;
    label: string;
}