import { z } from "zod";


// * Data suppliers
const supplierShema = z.object({
    id: z.string(),
    codigo_proveedor: z.string(),
    nombre_proveedor: z.string(),
    direccion_proveedor: z.string(),
    correo_proveedor: z.string(),
    telefono_proveedor: z.string(),
    celular_proveedor: z.string(),
    ruc: z.string(),
    contacto: z.string(),
    estado: z.number(),
    termino_compra: z.string(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional()
});

export const supplierDataSchema = z.array(
    supplierShema.pick({
        id: true,
        codigo_proveedor: true,
        nombre_proveedor: true,
        direccion_proveedor: true,
        correo_proveedor: true,
        telefono_proveedor: true,
        celular_proveedor: true,
        ruc: true,
        contacto: true,
        estado: true,
        termino_compra: true,
        fecha_creacion: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true
    })
)

export type Supplier = z.infer<typeof supplierShema>;

// * Form data Supplier
const supplierFormShema = z.object({
    id: z.string(),
    codigo_proveedor: z.string(),
    nombre_proveedor: z.string(),
    direccion_proveedor: z.string(),
    correo_proveedor: z.string(),
    telefono_proveedor: z.string(),
    celular_proveedor: z.string(),
    ruc: z.string(),
    contacto: z.string(),
    estado: z.number(),
    termino_compra: z.string(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string()
});

export const supplierFormDataSchema = z.array(
    supplierFormShema.pick({
        id: true,
        codigo_proveedor: true,
        nombre_proveedor: true,
        direccion_proveedor: true,
        correo_proveedor: true,
        telefono_proveedor: true,
        celular_proveedor: true,
        ruc: true,
        contacto: true,
        estado: true,
        termino_compra: true,
        fecha_creacion: true,
        fecha_modificacion: true,
        usuario_creador: true,
        usuario_modificador: true,
    })
)

export type SupplierData = z.infer<typeof supplierFormShema>;

export type SupplierFormData = Pick<SupplierData,
    "id" |
    "codigo_proveedor" |
    "nombre_proveedor" |
    "direccion_proveedor" |
    "correo_proveedor" |
    "telefono_proveedor" |
    "celular_proveedor" |
    "ruc" |
    "contacto" |
    "estado" |
    "termino_compra" |
    "fecha_creacion" |
    "fecha_modificacion" |
    "usuario_creador" |
    "usuario_modificador"
>;

export type SupplierFormDataAdd = Pick<SupplierData,
    "nombre_proveedor" |
    "direccion_proveedor" |
    "correo_proveedor" |
    "telefono_proveedor" |
    "celular_proveedor" |
    "ruc" |
    "contacto" |
    "estado" |
    "termino_compra" |
    "usuario_creador"
>;

export type SupplierFormDataInfo = Pick<SupplierData,
    "id" |
    "codigo_proveedor" |
    "nombre_proveedor" |
    "direccion_proveedor" |
    "correo_proveedor" |
    "telefono_proveedor" |
    "celular_proveedor" |
    "ruc" |
    "contacto" |
    "estado" |
    "termino_compra"
>;

export type SupplierFormDataEdit = Pick<SupplierData,
    "id" |
    "nombre_proveedor" |
    "direccion_proveedor" |
    "correo_proveedor" |
    "telefono_proveedor" |
    "celular_proveedor" |
    "ruc" |
    "contacto" |
    "estado" |
    "termino_compra" |
    "usuario_modificador"
>;

export type SupplierFormDataDelete = Pick<SupplierData, "id" | "nombre_proveedor">;

export interface DataItemSupplier {
    value: string;
    label: string;
}