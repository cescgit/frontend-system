import { z } from "zod";


// * Data Taxes
const taxesShema = z.object({
    id: z.string(),
    abreviatura: z.string(),
    descripcion: z.string(),
    valor_porcentaje: z.string(),
    valor_cantidad: z.number(),    
    fecha_creacion: z.string(),
  });
  
  export const taxesDataSchema = z.array(
    taxesShema.pick({
      id: true,
      abreviatura: true,
      descripcion: true,
      valor_porcentaje: true,
      valor_cantidad: true,
      fecha_creacion: true,          
    })
  )
  
  export type Taxes = z.infer<typeof taxesShema>;

   // * Form data Brand
const taxesFormShema = z.object({
    id: z.string(),
    abreviatura: z.string(),
    descripcion: z.string(),
    valor_porcentaje: z.string(),
    valor_cantidad: z.number(),
    fecha_creacion: z.date(),
    fecha_modificacion: z.date(),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
  });
  
  export const taxesFormDataSchema = z.array(
    taxesFormShema.pick({
        id: true,
        abreviatura: true,
        descripcion: true,
        valor_porcentaje: true,
        valor_cantidad: true,
        fecha_creacion: true,
        fecha_modificacion: true,
        usuario_creador: true,
        usuario_modificador: true,
    })
  )
  
  export type TaxesData = z.infer<typeof taxesFormShema>;
  export type TaxesFormData = Pick<TaxesData, "id" | "abreviatura" | "descripcion" | "valor_porcentaje" | "valor_cantidad" | "usuario_creador" |  "usuario_modificador" | "fecha_creacion" | "fecha_modificacion" >;
  export type TaxesFormDataAdd = Pick<TaxesData, "abreviatura" | "descripcion" | "valor_porcentaje" | "valor_cantidad" | "usuario_creador" >;
  export type TaxesFormDataInfo = Pick<TaxesData, "id" | "abreviatura" | "descripcion" | "valor_porcentaje" | "valor_cantidad" >;
  export type TaxesFormDataEdit = Pick<TaxesData, "id" | "abreviatura" | "descripcion" | "valor_porcentaje" | "valor_cantidad" | "usuario_modificador" >;
  export type TaxesFormDataDelete = Pick<TaxesData, "id" | "abreviatura" >;

  export interface DataItemTax {
    value: string;
    label: string;
  }