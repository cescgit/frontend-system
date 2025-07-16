import { z } from "zod";

const buysTaxManualShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
});

const paymentMethodBuys = z.object({
    metodo: z.string(),
    monto: z.string(),
    descripcion: z.string().nullable().optional(),
})

const buysShema = z.object({
    id: z.string(),
    numero_factura_proveedor: z.string(),
    numero_compra: z.number(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    cuenta_por_pagar: z.number().nullable(),
    impuesto_manual: z.array(buysTaxManualShema).nullable(),
    metodo: z.string(),
    monto: z.string(),
    fecha_creacion: z.string(),
    fecha_vencimiento: z.string().nullable(),
    id_proveedor: z.string(),
    proveedor: z.string(),
    nombre_usuario_creador: z.string().optional()
});


export const buysDataSchema = z.array(
    buysShema.pick({
        id: true,
        numero_factura_proveedor: true,
        numero_compra: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        cuenta_por_pagar: true,
        impuesto_manual: true,
        metodo: true,
        monto: true,
        fecha_creacion: true,
        // fecha_vencimiento: true,
        id_proveedor: true,
        proveedor: true,
        nombre_usuario_creador: true
    })
)

export type Buys = z.infer<typeof buysShema>;

// * Form data buys
export const buysDetailsShema = z.array(
    z.object({
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
    })
)

// * Form data buys
export const buysDetailsFormShema = z.object({
    nombre_producto: z.string(),
    precio_compra: z.string(),
    cantidad: z.number(),
    subtotal: z.string(),
    id_producto: z.string(),
    utilidad1: z.number().nullable(),
    utilidad2: z.number().nullable(),
    utilidad3: z.number().nullable(),
    utilidad4: z.number().nullable(),
    precio1: z.string().nullable(),
    precio2: z.string().nullable(),
    precio3: z.string().nullable(),
    precio4: z.string().nullable()
});

const buysTaxManualFormShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
})

const buysFormShema = z.object({
    id: z.string(),
    numero_factura_proveedor: z.string(),
    numero_compra: z.string(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    cuenta_por_pagar: z.number().nullable(),
    impuesto_manual: z.array(buysTaxManualFormShema).nullable(),
    metodo_pago: z.array(paymentMethodBuys),
    metodo: z.string(),
    monto: z.string(),
    fecha_creacion: z.string(),
    fecha_vencimiento: z.string().nullable(),
    id_proveedor: z.string(),
    proveedor: z.string(),
    detalles_compra: buysDetailsShema,
    usuario_creador: z.string(),
    nombre_usuario_creador: z.string().optional()
});

export const buysFormDataSchema = z.array(
    buysFormShema.pick({
        id: true,
        numero_factura_proveedor: true,
        numero_compra: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        cuenta_por_pagar: true,
        impuesto_manual: true,
        metodo: true,
        monto: true,
        // detalles_compra: true,
        fecha_creacion: true,
        // fecha_vencimiento: true,
        id_proveedor: true,
        proveedor: true,
        nombre_usuario_creador: true
    })
)

export type BuysData = z.infer<typeof buysFormShema>;

export type BuysFormData = Pick<BuysData,
    "id" |
    "numero_factura_proveedor" |
    "numero_compra" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "cuenta_por_pagar" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    // "fecha_vencimiento" |
    "id_proveedor" |
    "proveedor" |
    "detalles_compra" |
    "usuario_creador"
>;

export type BuysFormDataInfo = Pick<BuysData,
    "id" |
    "numero_factura_proveedor" |
    "numero_compra" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "cuenta_por_pagar" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    "id_proveedor" |
    "detalles_compra" |
    "proveedor"
>;

export type BuysFormDataAdd = Pick<BuysData,
    "numero_factura_proveedor" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "cuenta_por_pagar" |
    "impuesto_manual" |
    "metodo_pago" |
    "id_proveedor" |
    "detalles_compra" |
    "fecha_vencimiento" |
    "usuario_creador"
>;

export type BuysFormDataDelete = Pick<BuysData, "id" | "numero_compra">;

// * Temporary purchasing data
const tempPurchasingDetailsShema = z.object({
    id_producto: z.string(),
    nombre_producto: z.string(),
    precio_compra: z.string(),
    cantidad: z.number(),
    subtotal: z.string(),
    utilidad1: z.number(),
    utilidad2: z.number(),
    utilidad3: z.number(),
    utilidad4: z.number(),
    precio1: z.string(),
    precio2: z.string(),
    precio3: z.string(),
    precio4: z.string()
});



export const tempPurchasingDetailsDataSchema = z.array(
    tempPurchasingDetailsShema.pick({
        id_producto: true,
        nombre_producto: true,
        precio_compra: true,
        cantidad: true,
        subtotal: true,
        // utilidad1: true,
        // utilidad2: true,
        // utilidad3: true,
        // utilidad4: true,
        // precio1: true,
        // precio2: true,
        // precio3: true,
        // precio4: true
    })
)

export type TempPurchasingDetails = z.infer<typeof tempPurchasingDetailsShema>;

export type TempPurchasingFormDataDetails = Pick<TempPurchasingDetails,
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

// * Temporary purchasing data
const tempPurchasingShema = z.object({
    id_inventario: z.string(),
    id_producto: z.string(),
    nombre_producto: z.string(),
    precio_venta: z.string(),
    precio_compra: z.string(),
    cantidad: z.number(),
    stock: z.number(),
    subtotal: z.string(),
    utilidad1: z.number(),
    utilidad2: z.number(),
    utilidad3: z.number(),
    utilidad4: z.number(),
    precio1: z.string(),
    precio2: z.string(),
    precio3: z.string(),
    precio4: z.string()
});



export const tempPurchasingDataSchema = z.array(
    tempPurchasingShema.pick({
        id_inventario: true,
        id_producto: true,
        nombre_producto: true,
        precio_venta: true,
        precio_compra: true,
        cantidad: true,
        stock: true,
        subtotal: true,
        utilidad1: true,
        utilidad2: true,
        utilidad3: true,
        utilidad4: true,
        precio1: true,
        precio2: true,
        precio3: true,
        precio4: true
    })
)

export type TempPurchasing = z.infer<typeof tempPurchasingShema>;

export type TempPurchasingFormData = Pick<TempPurchasing,
    "id_inventario" |
    "id_producto" |
    "nombre_producto" |
    "precio_venta" |
    "precio_compra" |
    "cantidad" |
    "stock" |
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

export type TempPurchasingFormDataAdd = Pick<TempPurchasing,
    "id_inventario" |
    "nombre_producto" |
    "precio_venta" |
    "cantidad" |
    "subtotal" |
    "id_producto" |
    "utilidad1" |
    "utilidad2" |
    "utilidad3" |
    "utilidad4" |
    "precio1" |
    "precio2" |
    "precio3" |
    "precio4"
>;
export interface DataItem {
    value: string;
    label: number;
}

export interface DataComboboxPayment {
    value: string,
    label: string
}