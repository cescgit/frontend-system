import { z } from "zod";


// * Data brand
const productShema = z.object({
    id: z.string(),
    sac: z.string(),
    codigo: z.string(),
    nombre_producto: z.string(),
    descripcion_producto: z.string(),
    precio_compra: z.string(),
    precio_venta_promedio: z.string(),
    cantidad: z.number(),
    cantidad_minima: z.number(),
    cantidad_maxima: z.number(),
    imagen_url: z.string(),
    estado: z.number(),
    expiracion: z.number(),
    fecha_expiracion: z.string(),
    pesoValor: z.number(),
    precio1: z.string(),
    utilidad1: z.number(),
    precio2: z.string(),
    utilidad2: z.number(),
    precio3: z.string(),
    utilidad3: z.number(),
    precio4: z.string(),
    utilidad4: z.number(),
    fecha_creacion: z.string(),
    id_unidad_medida: z.string(),
    id_peso: z.string(),
    id_marca: z.string(),
    marca: z.string(),
    id_categoria: z.string(),
    categoria: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional(),
});

export const productDataSchema = z.array(
    productShema.pick({
        id: true,
        codigo: true,
        sac: true,
        nombre_producto: true,
        descripcion_producto: true,
        precio_compra: true,
        precio_venta_promedio: true,
        cantidad: true,
        cantidad_minima: true,
        cantidad_maxima: true,
        imagen_url: true,
        estado: true,
        expiracion: true,
        fecha_expiracion: true,
        pesoValor: true,
        precio1: true,
        utilidad1: true,
        precio2: true,
        utilidad2: true,
        precio3: true,
        utilidad3: true,
        precio4: true,
        utilidad4: true,
        fecha_creacion: true,
        id_unidad_medida: true,
        id_peso: true,
        id_marca: true,
        marca: true,
        id_categoria: true,
        categoria: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true
    })
)

export type Product = z.infer<typeof productShema>;

// * Form data Product
const productFormShema = z.object({
    id: z.string(),
    sac: z.string(),
    codigo: z.string(),
    nombre_producto: z.string(),
    descripcion_producto: z.string(),
    precio_compra: z.string(),
    precio_venta_promedio: z.string(),
    cantidad: z.number(),
    cantidad_minima: z.number(),
    cantidad_maxima: z.number(),
    imagen_url: z.string(),
    estado: z.number(),
    expiracion: z.number(),
    fecha_expiracion: z.string(),
    pesoValor: z.number(),
    precio1: z.string(),
    utilidad1: z.number(),
    precio2: z.string(),
    utilidad2: z.number(),
    precio3: z.string(),
    utilidad3: z.number(),
    precio4: z.string(),
    utilidad4: z.number(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    id_unidad_medida: z.string(),
    id_peso: z.string(),
    id_marca: z.string(),
    marca: z.string(),
    id_categoria: z.string(),
    categoria: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string()
});

export const productFormDataSchema = z.array(
    productFormShema.pick({
        id: true,
        codigo: true,
        sac: true,
        nombre_producto: true,
        descripcion_producto: true,
        precio_compra: true,
        precio_venta_promedio: true,
        cantidad: true,
        cantidad_minima: true,
        cantidad_maxima: true,
        imagen_url: true,
        estado: true,
        expiracion: true,
        fecha_expiracion: true,
        pesoValor: true,
        precio1: true,
        utilidad1: true,
        precio2: true,
        utilidad2: true,
        precio3: true,
        utilidad3: true,
        precio4: true,
        utilidad4: true,
        fecha_creacion: true,
        fecha_modificacion: true,
        id_unidad_medida: true,
        id_peso: true,
        id_marca: true,
        marca: true,
        id_categoria: true,
        categoria: true,
        usuario_creador: true,
        usuario_modificador: true
    })
)

export type ProductData = z.infer<typeof productFormShema>;

export type ProductFormData = Pick<ProductData,
    "id" | 
    "codigo" | 
    "nombre_producto" | 
    "descripcion_producto" | 
    "precio_compra" | 
    "precio_venta_promedio" | 
    "cantidad" | 
    "cantidad_minima" |
    "cantidad_maxima" |
    "imagen_url" | 
    "estado" | 
    "expiracion" |
    "fecha_expiracion" | 
    "pesoValor" | 
    "precio1" | 
    "utilidad1" | 
    "precio2" | "utilidad2" | "precio3" | "utilidad3" |
    "precio4" | "utilidad4" | "fecha_creacion" | "fecha_modificacion" | "id_unidad_medida" | "id_peso" | "id_marca" | "marca" | "id_categoria" | "categoria" | "usuario_creador" | "usuario_modificador"
>;

export type ProductDataCombobox = Pick<ProductData,
    "id" | "codigo" | "sac" | "nombre_producto" | "descripcion_producto" | "precio_compra" | "precio_venta_promedio" | "cantidad" | "cantidad_minima" | "cantidad_maxima" |
    "imagen_url" | "estado" | "expiracion" |
    "fecha_expiracion" | "pesoValor" | "precio1" | "utilidad1" | "precio2" | "utilidad2" | "precio3" | "utilidad3" |
    "precio4" | "utilidad4" | "id_unidad_medida" | "id_peso" | "id_marca" | "marca" | "id_categoria" | "categoria"
>;

export type ProductFormDataInfo = Pick<ProductData,
    "id" | "codigo" | "sac" | "nombre_producto" | "descripcion_producto" | "precio_compra" | "precio_venta_promedio" | "cantidad" | "cantidad_minima" | "cantidad_maxima" |
    "imagen_url" | "estado" | "expiracion" |
    "fecha_expiracion" | "pesoValor" | "precio1" | "utilidad1" | "precio2" | "utilidad2" | "precio3" | "utilidad3" |
    "precio4" | "utilidad4" | "id_unidad_medida" | "id_peso" | "id_marca" | "id_categoria">;

export type ProductFormDataAdd = Pick<ProductData,
    "codigo" | "sac" | "nombre_producto" | "descripcion_producto" | "precio_compra" | "cantidad" | "cantidad_minima" | "cantidad_maxima" |
    "imagen_url" | "estado" | "expiracion" |
    "fecha_expiracion" | "pesoValor" | "precio1" | "utilidad1" | "precio2" | "utilidad2" | "precio3" | "utilidad3" |
    "precio4" | "utilidad4" | "id_unidad_medida" | "id_peso" | "id_marca" | "id_categoria" | "usuario_creador"
>;

export type ProductFormDataEdit = Pick<ProductData,
    "id" | "codigo" | "sac" | "nombre_producto" | "descripcion_producto" | "precio_compra" | "cantidad" | "cantidad_minima" | "cantidad_maxima" |
    "imagen_url" | "estado" | "expiracion" |
    "fecha_expiracion" | "pesoValor" | "precio1" | "utilidad1" | "precio2" | "utilidad2" | "precio3" | "utilidad3" |
    "precio4" | "utilidad4" | "id_peso" | "id_unidad_medida" | "id_marca" | "id_categoria" | "usuario_modificador"
>;


export type ProductFormDataDelete = Pick<ProductData, "id" | "nombre_producto">;