import { z } from "zod";


// * Data inventory
const inventoryShema = z.object({
    id_inventario: z.string(),
    id_producto: z.string(),
    codigo: z.string(),
    sac: z.string(),
    nombre_producto: z.string(),
    imagen_url: z.string(),
    precio_compra: z.string(),
    remisiones: z.string(),
    producto_apartado: z.string(),
    stock: z.number(),
    unidad_medida: z.string(),
    nombre_categoria: z.string(),
    nombre_marca: z.string(),
    estado: z.number(),
    utilidad1: z.number(),
    utilidad2: z.number(),
    utilidad3: z.number(),
    utilidad4: z.number(),
    precio1: z.string(),
    precio2: z.string(),
    precio3: z.string(),
    precio4: z.string()
});

export const inventoryDataSchema = z.array(
    inventoryShema.pick({
        id_inventario: true,
        id_producto: true,
        codigo: true,
        sac: true,
        nombre_producto: true,
        imagen_url: true,
        precio_compra: true,
        remisiones: true,
        producto_apartado: true,
        stock: true,
        unidad_medida: true,
        nombre_categoria: true,
        nombre_marca: true,
        estado: true,
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

export type Inventory = z.infer<typeof inventoryShema>;


export type InventoryFormDataInfo = Pick<Inventory,
    "id_inventario" |
    "id_producto" |
    "codigo" |
    "sac" |
    "nombre_producto" |
    "imagen_url" |
    "precio_compra" |
    "remisiones" |
    "producto_apartado" |
    "stock" |
    "unidad_medida" |
    "nombre_categoria" |
    "nombre_marca" |
    "estado" |
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
    nombre_producto: z.string(),
    precio_compra: z.string(),
    cantidad: z.number(),
    subtotal: z.string(),
    id_producto: z.string(),
});


export const tempPurchasingDataSchema = z.array(
    tempPurchasingShema.pick({
        id_producto: true,
        nombre_producto: true,
        precio_compra: true,
        cantidad: true,
        subtotal: true
    })
)

export type TempPurchasing = z.infer<typeof tempPurchasingShema>;

export type TempPurchasingFormData = Pick<TempPurchasing,
    "id_producto" |
    "nombre_producto" |
    "precio_compra" |
    "cantidad" |
    "subtotal"
>;

export type TempPurchasingFormDataAdd = Pick<TempPurchasing,
    "nombre_producto" |
    "precio_compra" |
    "cantidad" |
    "subtotal" |
    "id_producto"
>;