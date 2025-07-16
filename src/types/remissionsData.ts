import { z } from "zod";

// * Details remission
const detailsRemissionShema = z.object({
    id_producto: z.string(),
    id_inventario: z.string(),
    nombre_producto: z.string(),
    cantidad: z.number(),
})

// * Data remissions
const remissionShema = z.object({
    id: z.string(),
    codigo: z.string(),
    detalle_remision: z.array(detailsRemissionShema.nullable()),
    id_cliente: z.string(),
    nombre_cliente: z.string(),
    fecha_creacion: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional()
});

export const remissionDataSchema = z.array(
    remissionShema.pick({
        id: true,
        codigo: true,
        id_cliente: true,
        nombre_cliente: true,
        fecha_creacion: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true,
    })
)

export type Remissions = z.infer<typeof remissionShema>;

// * Form remission
export const remissionDetailsShema = z.array(
    z.object({
        id_inventario: z.string(),
        id_producto: z.string(),
        nombre_producto: z.string(),
        precio_venta: z.string().optional(),
        precio_compra: z.string().optional(),
        cantidad: z.number(),
        stock: z.number().optional(),
        subtotal: z.string().optional(),
        utilidad1: z.number().optional(),
        utilidad2: z.number().optional(),
        utilidad3: z.number().optional(),
        utilidad4: z.number().optional(),
        precio1: z.string().optional(),
        precio2: z.string().optional(),
        precio3: z.string().optional(),
        precio4: z.string().optional()
    })
)

// * Form data remissions
const remissionsFormShema = z.object({
    id: z.string(),
    codigo: z.string(),
    detalle_remision: z.array(detailsRemissionShema.nullable()),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    id_cliente: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string()
});

export const remissionsFormDataSchema = z.array(
    remissionsFormShema.pick({
        id: true,
        fecha_creacion: true,
        fecha_modificacion: true,
        id_cliente: true,
        usuario_creador: true,
        usuario_modificador: true
    })
)

export type RemissionsData = z.infer<typeof remissionsFormShema>;
export type RemissionsFormData = Pick<RemissionsData,
    "id" |
    "id_cliente" |
    "detalle_remision" |
    "usuario_creador" |
    "usuario_modificador" |
    "fecha_creacion" |
    "fecha_modificacion"
>;

export type RemissionsFormDataAdd = Pick<RemissionsData,
    "detalle_remision" |
    "id_cliente" |
    "usuario_creador"
>;

export type RemissionsFormDataInfo = Pick<RemissionsData,
    "id" |
    "codigo" |
    "id_cliente"
>;

export type RemissionsFormDataEdit = Pick<RemissionsData,
    "id" |
    "detalle_remision" |
    "id_cliente" |
    "usuario_modificador"
>;

export type RemissionsFormDataDelete = Pick<RemissionsData, "id" | "codigo">;

export type ProductRemissions = z.infer<typeof detailsRemissionShema>;
export type ProductRemissionFormData = Pick<ProductRemissions,
    "id_producto" |
    "id_inventario" |
    "nombre_producto" |
    "cantidad"
>;

export interface DataItemRemissions {
    value: string;
    label: string;
}