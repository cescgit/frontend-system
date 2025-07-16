import { z } from "zod";


// * Data unit of measure
const weightShema = z.object({
  id: z.string(),
  peso: z.string(),
  abreviatura: z.string(),
  fecha_creacion: z.string(),
  nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional(),
});

export const weightDataSchema = z.array(
  weightShema.pick({
    id: true,
    peso: true,
    abreviatura: true,
    fecha_creacion: true,
    nombre_usuario_creador: true,
    nombre_usuario_modificador: true,
  })
)

export type WeightShema = z.infer<typeof weightShema>;

// * Form data unit of measure
const weightShemaFormShema = z.object({
  id: z.string(),
  peso: z.string(),
  abreviatura: z.string(),
  fecha_creacion: z.string(),
  fecha_modificacion: z.string(),
  usuario_creador: z.string(),
  usuario_modificador: z.string(),
});

export const weightFormDataSchema = z.array(
  weightShemaFormShema.pick({
    id: true,
    peso: true,
    abreviatura: true,
    fecha_creacion: true,
    fecha_modificacion: true,
    usuario_creador: true,
    usuario_modificador: true,
  })
)

export type WeightData = z.infer<typeof weightShemaFormShema>;
export type WeightFormDataInfo = Pick<WeightData, "id" | "peso" | "abreviatura">;
export type WeightFormData = Pick<WeightData, "id" | "peso" | "abreviatura" | "usuario_creador" | "usuario_modificador" | "fecha_creacion" | "fecha_modificacion">;
export type WeightFormDataAdd = Pick<WeightData, "peso" | "abreviatura" | "usuario_creador">;
export type WeightFormDataEdit = Pick<WeightData, "id" | "peso" | "abreviatura" | "usuario_modificador">;
export type WeightFormDataDelete = Pick<WeightData, "id" | "peso">;


export interface DataItemWeight {
  value: string;
  label: string;
}