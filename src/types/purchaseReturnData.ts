import { z } from "zod";

const purchaseReturnTaxManualShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
})


const purchaseReturnShema = z.object({
    id: z.string(),
    numero_factura_proveedor: z.string(),
    numero_compra: z.string(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    impuesto_manual: z.array(purchaseReturnTaxManualShema).nullable(), 
    fecha_creacion: z.string(),
    id_proveedor: z.string(),
    id_compra: z.string(),
    proveedor: z.string()
});

export const purchaseReturnDataSchema = z.array(
    purchaseReturnShema.pick({
        id: true,
        numero_factura_proveedor: true,
        numero_compra: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        impuesto_manual: true,
        fecha_creacion: true,
        id_proveedor: true,
        id_compra: true,
        proveedor: true
    })
)

export type PurchaseReturn = z.infer<typeof purchaseReturnShema>;

// * Form data purchaseReturn
export const purchaseReturnDetailsShema = z.array(
    z.object({
        nombre_producto: z.string(),
        precio_compra: z.string(),
        cantidad: z.number(),
        subtotal: z.string(),
        id_producto: z.string()
    })
)

// * Form data purchaseReturn
export const purchaseReturnDetailsFormShema = z.object({
    nombre_producto: z.string(),
    precio_compra: z.string(),
    cantidad: z.number(),
    subtotal: z.string(),
    id_producto: z.string(),
})

const purchaseReturnFormShema = z.object({
    id: z.string(),
    numero_factura_proveedor: z.string(),
    numero_compra: z.string(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    impuesto_manual: z.array(purchaseReturnTaxManualShema).nullable(), 
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    id_proveedor: z.string(),
    proveedor: z.string(),
    id_compra: z.string(),
    detalle_devolucion_compra: z.array(purchaseReturnDetailsFormShema),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
});

export const purchaseReturnFormDataSchema = z.array(
    purchaseReturnFormShema.pick({
        id: true,
        numero_factura_proveedor: true,
        numero_compra: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,         
        impuesto_manual: true,       
        // detalles_compra: true,
        fecha_creacion: true,
        id_proveedor: true,
        id_compra: true,
        proveedor: true
    })
)

export type PurchaseReturnData = z.infer<typeof purchaseReturnFormShema>;

export type PurchaseReturnFormData = Pick<PurchaseReturnData,
    "id" |
    "numero_factura_proveedor" |
    "numero_compra" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "fecha_creacion" |
    "fecha_modificacion" |
    "id_proveedor" |
    "proveedor" |
    "id_compra" |
    "detalle_devolucion_compra" |    
    "usuario_creador" |
    "usuario_modificador"
>;

export type PurchaseReturnFormDataInfo = Pick<PurchaseReturnData,
    "id" |
    "numero_factura_proveedor" |
    "numero_compra" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "fecha_creacion" |
    "id_proveedor" |
    "id_compra" |
    "detalle_devolucion_compra" |    
    "proveedor"
>;

export type PurchaseReturnFormDataAdd = Pick<PurchaseReturnData,
    "numero_factura_proveedor" |
    "numero_compra" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "id_proveedor" |
    "id_compra" |
    "detalle_devolucion_compra" |    
    "usuario_creador"
>;

export type PurchaseReturnFormDataEdit = Pick<PurchaseReturnData,
    "id" |
    "numero_factura_proveedor" |
    "numero_compra" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "id_proveedor" |
    "proveedor" | "id_compra" |
    "detalle_devolucion_compra" |    
    "usuario_modificador"
>;


export type PurchaseReturnFormDataDelete = Pick<PurchaseReturnData, "id" | "numero_compra">;


// * Temporary purchase return data
const tempPurchaseReturnShema = z.object({
    nombre_producto: z.string(),
    precio_compra: z.string(),
    cantidad: z.number(),
    subtotal: z.string(),
    id_producto: z.string(),
    utilidad1: z.number(),
    utilidad2: z.number(),
    utilidad3: z.number(),
    utilidad4: z.number(),
    precio1: z.string(),
    precio2: z.string(),
    precio3: z.string(),
    precio4: z.string()
});



export const tempPurchaseReturnDataSchema = z.array(
    tempPurchaseReturnShema.pick({
        id_producto: true,
        nombre_producto: true,
        precio_compra: true,
        cantidad: true,
        subtotal: true
    })
)

export type TempPurchaseReturn = z.infer<typeof tempPurchaseReturnShema>;

export type TempPurchaseReturnFormData = Pick<TempPurchaseReturn,
    "id_producto" |
    "nombre_producto" |
    "precio_compra" |
    "cantidad" |
    "subtotal" |
    "utilidad1" |
    "utilidad2" |
    "utilidad3" |
    "utilidad4" |
    "precio1" |
    "precio2" |
    "precio3" |
    "precio4"
>;

export type TempPurchaseReturnFormDataAdd = Pick<TempPurchaseReturn,
    "nombre_producto" |
    "precio_compra" |
    "cantidad" |
    "subtotal" |
    "id_producto"
>;