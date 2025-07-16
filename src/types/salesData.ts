import { z } from "zod";

const salesTaxManualShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
})

const paymentMethodSales = z.object({
    metodo: z.string(),
    monto: z.string(),
    descripcion: z.string().nullable().optional()    
})

const salesShema = z.object({
    id: z.string(),
    numero_venta: z.number(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    cuenta_por_cobrar: z.number().nullable(),
    impuesto_manual: z.array(salesTaxManualShema).nullable(),
    metodo_pago: z.array(paymentMethodSales),
    fecha_creacion: z.string(),
    fecha_vencimiento: z.string().nullable(),
    id_cliente: z.string(),
    cliente: z.string(),
    nombre_usuario_creador: z.string().optional()    
});


export const salesDataSchema = z.array(
    salesShema.pick({
        id: true,
        numero_venta: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        cuenta_por_cobrar: true,
        impuesto_manual: true,
        metodo_pago: true,
        fecha_creacion: true,
        // fecha_vencimiento: true,
        id_cliente: true,
        cliente: true,
        nombre_usuario_creador: true        
    })
)

export type Sales = z.infer<typeof salesShema>;

// * Form data sales
export const salesDetailsShema = z.array(
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

// * Form data sales
export const salesDetailsFormShema = z.object({
    nombre_producto: z.string(),
    precio_venta: z.string(),
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

const salesFormShema = z.object({
    id: z.string(),
    numero_venta: z.string(),
    termino: z.string(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    cuenta_por_cobrar: z.number().nullable(),
    impuesto_manual: z.array(salesTaxManualShema).nullable(),
    metodo_pago: z.array(paymentMethodSales),
    fecha_creacion: z.string(),
    fecha_vencimiento: z.string().nullable(),
    id_cliente: z.string(),
    cliente: z.string(),
    detalles_venta: salesDetailsShema,
    usuario_creador: z.string(),
    nombre_usuario_creador: z.string().optional()    
});

export const salesFormDataSchema = z.array(
    salesFormShema.pick({
        id: true,
        numero_venta: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        total: true,
        cuenta_por_cobrar: true,
        impuesto_manual: true,
        metodo_pago: true,
        // detalles_compra: true,
        fecha_creacion: true,
        // fecha_vencimiento: true,
        id_cliente: true,
        cliente: true,
        nombre_usuario_creador: true        
    })
)

export type SalesData = z.infer<typeof salesFormShema>;

export type SalesFormData = Pick<SalesData,
    "id" |
    "numero_venta" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "cuenta_por_cobrar" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    "id_cliente" |
    "cliente" |
    "detalles_venta" |
    "usuario_creador"
>;

export type SalesFormDataInfo = Pick<SalesData,
    "id" |
    "numero_venta" |
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "cuenta_por_cobrar" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    "id_cliente" |
    "detalles_venta" |
    "cliente"
>;

export type SalesFormDataAdd = Pick<SalesData,
    "termino" |
    "observaciones" |
    "subtotal" |
    "total" |
    "cuenta_por_cobrar" |
    "impuesto_manual" |
    "metodo_pago" |
    "id_cliente" |
    "detalles_venta" |
    "fecha_vencimiento" |
    "usuario_creador"
>;

export type SalesFormDataDelete = Pick<SalesData, "id" | "numero_venta">;

// * Temporary purchasing data
const tempPurchasingDetailsShema = z.object({
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



export const tempPurchasingDetailsDataSchema = z.array(
    tempPurchasingDetailsShema.pick({
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

export type TempPurchasingDetails = z.infer<typeof tempPurchasingDetailsShema>;

export type TempSalesFormDataDetails = Pick<TempPurchasingDetails,
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