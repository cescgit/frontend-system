import { z } from "zod";


const salesQuoteTaxManualShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
})

const salesQuoteShema = z.object({
    id: z.string(),
    numero_cotizacion: z.string(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    dias: z.number(),
    fecha_finalizacion: z.string(),
    estado: z.number(),
    prefacturacion: z.number(),
    facturacion: z.number(),
    descuento_porcentaje: z.number(),
    descuento_valor: z.string(),
    impuesto_manual: z.array(salesQuoteTaxManualShema).nullable(),
    fecha_creacion: z.string(),
    id_cliente: z.string(),
    cliente: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional()
});



export const salesQuoteDataSchema = z.array(
    salesQuoteShema.pick({
        id: true,
        numero_cotizacion: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        dias: true,
        fecha_finalizacion: true,
        estado: true,
        prefacturacion: true,
        facturacion: true,
        descuento_porcentaje: true,
        descuento_valor: true,
        impuesto_manual: true,
        fecha_creacion: true,
        id_cliente: true,
        cliente: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true,

    })
)

export type SalesQuote = z.infer<typeof salesQuoteShema>;

// * Form data sales quote
export const salesQuoteDetailsShema = z.array(
    z.object({
        id_inventario: z.string(),
        id_producto: z.string(),
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

// * Form data sales quote
export const salesQuoteDetailsFormShema =
    z.object({
        id_producto: z.string(),
        nombre_producto: z.string(),
        precio_venta: z.string(),
        cantidad: z.number()
    })

const salesQuoteFormShema = z.object({
    id: z.string(),
    numero_cotizacion: z.string(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    dias: z.number(),
    fecha_finalizacion: z.string(),
    estado: z.number(),
    prefacturacion: z.number(),
    facturacion: z.number(),
    fecha_creacion: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
    impuesto_manual: z.array(salesQuoteTaxManualShema).nullable(),
    detalle_cotizacion_venta: z.array(salesQuoteDetailsFormShema),
    id_cliente: z.string(),
    cliente: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional()
});

export const productFormDataSchema = z.array(
    salesQuoteFormShema.pick({
        id: true,
        numero_cotizacion: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        dias: true,
        fecha_finalizacion: true,
        estado: true,
        prefacturacion: true,
        facturacion: true,
        fecha_creacion: true,
        impuesto_manual: true,
        id_cliente: true,
        cliente: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true

    })
)

export type SalesQuoteData = z.infer<typeof salesQuoteFormShema>;

export type SalesQuoteFormData = Pick<SalesQuoteData,
    "id" |
    "numero_cotizacion" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "dias" |
    "fecha_finalizacion" |
    "estado" |
    "prefacturacion" |
    "facturacion" |
    "fecha_creacion" |
    "id_cliente" |
    "cliente" |
    "detalle_cotizacion_venta" |
    "usuario_creador" |
    "usuario_modificador"
>;

export type SalesQuoteFormDataInfo = Pick<SalesQuoteData,
    "id" |
    "numero_cotizacion" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "dias" |
    "impuesto_manual" |
    "fecha_finalizacion" |
    "estado" |
    "prefacturacion" |
    "facturacion" |
    "fecha_creacion" |
    "id_cliente" |
    "cliente" |
    "detalle_cotizacion_venta"
>;

export type SalesQuoteFormDataAdd = Pick<SalesQuoteData,
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "dias" |
    "fecha_finalizacion" |
    "estado" |
    "prefacturacion" |
    "facturacion" |
    "id_cliente" |
    "detalle_cotizacion_venta" |
    "usuario_creador"
>;

export type SalesQuoteFormDataEdit = Pick<SalesQuoteData,
    "id" |
    "numero_cotizacion" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "dias" |
    "fecha_finalizacion" |
    "estado" |
    "prefacturacion" |
    "facturacion" |
    "fecha_creacion" |
    "id_cliente" |
    "detalle_cotizacion_venta" |
    "impuesto_manual" |
    "usuario_modificador"
>;


export type SalesQuoteFormDataDelete = Pick<SalesQuoteData, "id" | "numero_cotizacion">;


// * Temporary sales quote data
const tempPurchasingShema = z.object({
    id_producto: z.string(),
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
    "precio_venta" |
    "cantidad" |
    "subtotal"
>;

export type TempPurchasingFormDataAdd = Pick<TempPurchasing,
    "nombre_producto" |
    "precio_venta" |
    "cantidad" |
    "subtotal" |
    "id_producto"
>;