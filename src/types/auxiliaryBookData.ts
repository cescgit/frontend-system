import { z } from "zod";


// * Data auxiliary books
const auxiliaryBookShema = z.object({
    id: z.string(),
    codigo: z.string(),
    descripcion: z.string(),    
    fecha_creacion: z.string()
});

export const auxiliaryBookDataSchema = z.array(
    auxiliaryBookShema.pick({
        id: true,
        codigo: true,
        descripcion: true,        
        fecha_creacion: true
    })
)

export type AuxiliaryBook = z.infer<typeof auxiliaryBookShema>;

// * Form data auxiliary book
const auxiliaryBookFormShema = z.object({
    id: z.string(),
    codigo: z.string(),
    descripcion: z.string(),    
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),    
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
});

export const AuxiliaryBookFormDataSchema = z.array(
    auxiliaryBookFormShema.pick({
        id: true,
        codigo: true,
        descripcion: true,        
        fecha_creacion: true,
        fecha_modificacion: true,        
        usuario_creador: true,
        usuario_modificador: true
    })
)

export type AuxiliaryBookData = z.infer<typeof auxiliaryBookFormShema>;
export type AuxiliaryBookFormData = Pick<AuxiliaryBookData,
    "id" |
    "codigo" |
    "descripcion" |    
    "fecha_creacion" |
    "fecha_modificacion" |    
    "usuario_creador" |
    "usuario_modificador"
    >;

export type AuxiliaryBookFormDataAdd = Pick<AuxiliaryBookData,
    "codigo" |
    "descripcion" |    
    "fecha_creacion" |      
    "usuario_creador"    
>;

export type AuxiliaryBookFormDataInfo = Pick<AuxiliaryBookData,
    "id" |
    "codigo" |
    "descripcion"    
>;
export type AuxiliaryBookFormDataEdit = Pick<AuxiliaryBookData,
    "id" |
    "codigo" |
    "descripcion" |       
    "usuario_modificador"
>;
// export auxiliary bookingAccountFormDataDelete = Pick<AuxiliaryBookData,
//     "id" |
//     "numero_cuenta" |
//     "descripcion"
//     >;

export interface DataItemAuxiliaryBook {
    value: string;
    label: string;
}