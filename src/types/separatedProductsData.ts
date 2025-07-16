import { z } from "zod";


const separatedProductTaxManualShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
})

export const separatedProductShema = z.object({
    id: z.string(),
    numero_apartado: z.string(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    estado: z.number(),
    prefacturacion: z.number(),
    facturacion: z.number(),
    impuesto_manual: z.array(separatedProductTaxManualShema).nullable(),
    fecha_creacion: z.string(),
    id_cliente: z.string(),
    cliente: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional(),
});



export const separatedProductDataSchema = z.array(
    separatedProductShema.pick({
        id: true,
        numero_apartado: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        estado: true,
        prefacturacion: true,
        facturacion: true,
        impuesto_manual: true,
        fecha_creacion: true,
        id_cliente: true,
        cliente: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true,
    })
)

export type SeparatedProduct = z.infer<typeof separatedProductShema>;

// * Form data separated product
export const seperatedProductDetailsShema = z.array(
    z.object({
        id_producto: z.string(),
        id_inventario: z.string(),
        nombre_producto: z.string(),
        precio_venta: z.string(),
        precio_compra: z.string().nullable().optional(),
        cantidad: z.number(),
        stock: z.number().nullable().optional(),
        subtotal: z.string(),
        utilidad1: z.number(),
        utilidad2: z.number(),
        utilidad3: z.number(),
        utilidad4: z.number(),
        precio1: z.string(),
        precio2: z.string(),
        precio3: z.string(),
        precio4: z.string()
    })
)

// * Form data separated product
export const separatedProductDetailsFormShema =
    z.object({
        id_producto: z.string(),
        id_inventario: z.string(),
        nombre_producto: z.string(),
        precio_venta: z.string(),
        cantidad: z.number()
    })

const separatedProductFormShema = z.object({
    id: z.string(),
    numero_apartado: z.string(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    estado: z.number(),
    prefacturacion: z.number(),
    facturacion: z.number(),
    fecha_creacion: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
    impuesto_manual: z.array(separatedProductTaxManualShema).nullable(),
    detalle_producto_apartado: z.array(separatedProductDetailsFormShema),
    id_cliente: z.string(),
    cliente: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional()
});

export const productFormDataSchema = z.array(
    separatedProductFormShema.pick({
        id: true,
        numero_apartado: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        estado: true,
        prefacturacion: true,
        facturacion: true,
        fecha_creacion: true,
        impuesto_manual: true,
        id_cliente: true,
        cliente: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true,
    })
)

export type SeparatedProductData = z.infer<typeof separatedProductFormShema>;

export type SeparatedProductFormData = Pick<SeparatedProductData,
    "id" |
    "numero_apartado" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "estado" |
    "prefacturacion" |
    "facturacion" |
    "fecha_creacion" |
    "id_cliente" |
    "cliente" |
    "impuesto_manual" |
    "detalle_producto_apartado" |
    "usuario_creador" |
    "usuario_modificador"
>;

export type SeparatedProductFormDataInfo = Pick<SeparatedProductData,
    "id" |
    "numero_apartado" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "estado" |
    "prefacturacion" |
    "facturacion" |
    "fecha_creacion" |
    "id_cliente" |
    "cliente" |
    "detalle_producto_apartado"
>;

export type SeparatedProductFormDataAdd = Pick<SeparatedProductData,
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "estado" |
    "prefacturacion" |
    "facturacion" |
    "id_cliente" |
    "detalle_producto_apartado" |
    "usuario_creador"
>;

export type SeparatedProductFormDataEdit = Pick<SeparatedProductData,
    "id" |
    "numero_apartado" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "estado" |
    "prefacturacion" |
    "facturacion" |
    "fecha_creacion" |
    "id_cliente" |
    "detalle_producto_apartado" |
    "impuesto_manual" |
    "usuario_modificador"
>;


export type SeparatedProductFormDataDelete = Pick<SeparatedProductData, "id" | "numero_apartado">;


// * Temporary sales quote data
const tempPurchasingShema = z.object({
    id_producto: z.string(),
    id_inventario: z.string(),
    nombre_producto: z.string(),
    precio_venta: z.string(),
    cantidad: z.number(),
    stock: z.number(),
    subtotal: z.string(),
    utilidad1: z.string(),
    utilidad2: z.string(),
    utilidad3: z.string(),
    utilidad4: z.string(),
    precio1: z.string(),
    precio2: z.string(),
    precio3: z.string(),
    precio4: z.string()
});



export const tempPurchasingDataSchema = z.array(
    tempPurchasingShema.pick({
        id_producto: true,
        id_inventario: true,
        nombre_producto: true,
        precio_venta: true,
        cantidad: true,
        subtotal: true
    })
)

export type TempPurchasing = z.infer<typeof tempPurchasingShema>;

export type TempPurchasingFormData = Pick<TempPurchasing,
    "id_producto" |
    "nombre_producto" |
    "id_inventario" |
    "precio_venta" |
    "cantidad" |
    "subtotal"
>;

export type TempPurchasingFormDataAdd = Pick<TempPurchasing,
    "nombre_producto" |
    "precio_venta" |
    "cantidad" |
    "subtotal" |
    "id_producto" |
    "id_inventario"
>;