import { z } from "zod";

const preInvoicingTaxManualShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
})

const paymentMethodPreInvoicing = z.object({
    metodo: z.string(),
    monto: z.string(),
    descripcion: z.string().nullable().optional(),    
})

const preInvoicingCustomerManualShema = z.object({
    id: z.string(),
    nombre_cliente: z.string()
})

const preInvoicingShema = z.object({
    id: z.string(),
    numero_prefacturacion: z.number(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    cuenta_por_cobrar: z.number().nullable(),
    impuesto_manual: z.array(preInvoicingTaxManualShema).nullable(),
    metodo_pago: z.array(paymentMethodPreInvoicing),
    fecha_creacion: z.string(),
    fecha_vencimiento: z.string().nullable(),
    cliente_existente: z.number().optional(),
    id_cliente: z.string().nullable().optional(),
    cliente: z.string().nullable().optional(),
    cliente_manual: z.array(preInvoicingCustomerManualShema).nullable().optional(),
    nombre_usuario_creador: z.string().optional()
});


export const salesDataSchema = z.array(
    preInvoicingShema.pick({
        id: true,
        numero_prefacturacion: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        cuenta_por_cobrar: true,
        impuesto_manual: true,        
        fecha_creacion: true,
        // fecha_vencimiento: true,
        cliente_existente: true,
        id_cliente: true,
        cliente: true,
        cliente_manual: true,
        nombre_usuario_creador: true
    })
)

export type preInvoicing = z.infer<typeof preInvoicingShema>;

// * Form data pre-invoincing
export const preInvoicingDetailsShema = z.array(
    z.object({
        nombre_producto: z.string(),
        precio_venta: z.string(),
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

// * Form data pre-invoincing
export const preInvoicingDetailsFormShema = z.array(
    z.object({
        nombre_producto: z.string(),
        precio_venta: z.string(),
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
);

const preInvoicingFormShema = z.object({
    id: z.string(),
    numero_prefacturacion: z.string(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    cuenta_por_cobrar: z.number().nullable(),
    impuesto_manual: z.array(preInvoicingTaxManualShema).nullable(),
    metodo_pago: z.array(paymentMethodPreInvoicing),
    fecha_creacion: z.string(),
    fecha_vencimiento: z.string().nullable(),
    cliente_existente: z.number().optional(),
    id_cliente: z.string().nullable().optional(),
    cliente: z.string().nullable().optional(),
    cliente_manual: z.array(preInvoicingCustomerManualShema).nullable().optional(),
    detalles_prefacturacion: preInvoicingDetailsFormShema,
    usuario_creador: z.string(),
    nombre_usuario_creador: z.string().optional()
});

export const preInvoicingFormDataSchema = z.array(
    preInvoicingFormShema.pick({
        id: true,
        numero_prefacturacion: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        cuenta_por_cobrar: true,
        impuesto_manual: true,        
        // detalles_compra: true,
        fecha_creacion: true,
        // fecha_vencimiento: true,
        cliente_existente: true,
        id_cliente: true,
        cliente: true,
        cliente_manual: true,
        nombre_usuario_creador: true
    })
)

export type PreInvoicingData = z.infer<typeof preInvoicingFormShema>;

export type PreInvoicingFormData = Pick<PreInvoicingData,
    "id" |
    "numero_prefacturacion" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "cuenta_por_cobrar" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    "cliente_existente" |
    "id_cliente" |
    "cliente" |
    "detalles_prefacturacion" |
    "usuario_creador"
>;

export type PreInvoicingFormDataInfo = Pick<PreInvoicingData,
    "id" |
    "numero_prefacturacion" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "cuenta_por_cobrar" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    "cliente_existente" |
    "cliente_manual" |
    "id_cliente" |
    "detalles_prefacturacion" |
    "cliente"
>;

export type PreInvoicingFormDataAdd = Pick<PreInvoicingData,
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "cuenta_por_cobrar" |
    "metodo_pago" |
    "impuesto_manual" |
    "id_cliente" |
    "detalles_prefacturacion" |
    "fecha_vencimiento" |
    "usuario_creador"
>;

export type PreInvoicingFormDataDelete = Pick<PreInvoicingData, "id" | "numero_prefacturacion">;

// * Temporary purchasing data
const tempPreInvoicingDetailsShema = z.object({
    id_producto: z.string(),
    nombre_producto: z.string(),
    precio_venta: z.string(),
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



export const tempPreInvoicingDetailsDataSchema = z.array(
    tempPreInvoicingDetailsShema.pick({
        id_producto: true,
        nombre_producto: true,
        precio_venta: true,
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

export type TempPreInvoicingDetails = z.infer<typeof tempPreInvoicingDetailsShema>;

export type TempPreInvoicingFormDataDetails = Pick<TempPreInvoicingDetails,
    "id_producto" |
    "nombre_producto" |
    "precio_venta" |
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