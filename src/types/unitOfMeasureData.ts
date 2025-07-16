import { z } from "zod";


// * Data unit of measure
const unitOfMeasureShema = z.object({
    id: z.string(),
    unidad_medida: z.string(),
    abreviatura: z.string(),
    fecha_creacion: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional(),
  });
  
  export const unitOfMeasureDataSchema = z.array(
    unitOfMeasureShema.pick({
      id: true,
      unidad_medida: true,
      abreviatura: true,    
      fecha_creacion: true,   
      nombre_usuario_creador: true,
    nombre_usuario_modificador: true,
    })
  )
  
  export type UnitOfMeasureShema = z.infer<typeof unitOfMeasureShema>;

   // * Form data unit of measure
const unitOfMeasureShemaFormShema = z.object({
    id: z.string(),
    unidad_medida: z.string(),
    abreviatura: z.string(),
    fecha_creacion: z.date(),
    fecha_modificacion: z.date(),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
  });
  
  export const unitOfMeasureFormDataSchema = z.array(
    unitOfMeasureShemaFormShema.pick({
        id: true,
        unidad_medida: true,
        abreviatura: true,
        fecha_creacion: true,
        fecha_modificacion: true,
        usuario_creador: true,
        usuario_modificador: true,
    })
  )
  
  export type UnitOfMeasureData = z.infer<typeof unitOfMeasureShemaFormShema>;
  export type UnitOfMeasureFormDataInfo = Pick<UnitOfMeasureData, "id" | "unidad_medida" | "abreviatura" >;
  export type UnitOfMeasureFormData = Pick<UnitOfMeasureData, "id" | "unidad_medida" | "abreviatura" |  "usuario_creador" |  "usuario_modificador" | "fecha_creacion" | "fecha_modificacion" >;
  export type UnitOfMeasureFormDataAdd = Pick<UnitOfMeasureData, "unidad_medida" | "abreviatura" |  "usuario_creador" >;
  export type UnitOfMeasureFormDataEdit = Pick<UnitOfMeasureData, "id" | "unidad_medida" | "abreviatura" | "usuario_modificador" >;
  export type UnitOfMeasureFormDataDelete = Pick<UnitOfMeasureData, "id" | "unidad_medida" >;


  export interface DataItemUnitOfMeasure {
    value: string;
    label: string;
  }