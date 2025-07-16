import { z } from "zod";


// * Data User
const userShema = z.object({
  id: z.string(),
  nombre_usuario: z.string(),
  cedula_usuario: z.string(),
  celular_usuario: z.string(),
  correo_usuario: z.string().email(),
  tipo_usuario: z.string(),
  password: z.string(),
  estado: z.number(),
  fecha_creacion: z.string(),
  nombre_usuario_creador: z.string().optional(),
  nombre_usuario_modificador: z.string().optional()
});

export const userDataSchema = z.array(
  userShema.pick({
    id: true,
    nombre_usuario: true,
    cedula_usuario: true,
    celular_usuario: true,
    correo_usuario: true,
    tipo_usuario: true,    
    estado: true,
    fecha_creacion: true,
    nombre_usuario_creador: true,
    nombre_usuario_modificador: true
  })
)

export type User = z.infer<typeof userShema>;

// * Form data User
const userFormShema = z.object({
  id: z.string(),
  nombre_usuario: z.string(),
  cedula_usuario: z.string(),
  celular_usuario: z.string(),
  correo_usuario: z.string().email(),
  password: z.string(),
  oldPasswordUser: z.string().optional(),
  tipo_usuario: z.string(),
  estado: z.number(),
  usuario_creador: z.string(),
  usuario_modificador: z.string(),
  fecha_creacion: z.string(),
  fecha_modificacion: z.string(),
});

export const userFormDataSchema = z.array(
  userFormShema.pick({
    id: true,
    nombre_usuario: true,
    cedula_usuario: true,
    celular_usuario: true,
    correo_usuario: true,
    password: true,
    oldPasswordUser: true,
    tipo_usuario: true,
    estado: true,
    // usuario_creador: true,
    // usuario_modificador: true,
    // fecha_creacion: true,
    // fecha_modificacion: true,
  })
)

export type UserData = z.infer<typeof userFormShema>;
export type UserFormData = Pick<UserData, "id" | "nombre_usuario" | "cedula_usuario" | "celular_usuario" | "correo_usuario" | "password" | "tipo_usuario" | "estado" | "usuario_creador" | "usuario_modificador" | "fecha_creacion" | "fecha_modificacion">;
export type UserFormDataAdd = Pick<UserData, "nombre_usuario" | "cedula_usuario" | "celular_usuario" | "correo_usuario" | "password" | "tipo_usuario" | "estado" | "usuario_creador">;

export type UserFormDataInfo = Pick<UserData, "id" | "nombre_usuario" | "cedula_usuario" | "celular_usuario" | "correo_usuario" | "tipo_usuario" | "estado">;
export type UserFormDataEdit = Pick<UserData, "id" | "nombre_usuario" | "cedula_usuario" | "celular_usuario" | "correo_usuario" | "tipo_usuario" | "estado" | "usuario_modificador">;
export type UserFormDataEditStaff = Pick<UserData, "celular_usuario" | "correo_usuario" | "password" | "oldPasswordUser">;
// export type UserFormDataUserEdit = Pick<UserData,"nombre_usuario" | "celular_usuario" | "correo_usuario"  | "password" >;

export type UserFormDataDelete = Pick<UserData, "id" | "nombre_usuario">;


// * permissions for button
export const repeatShema = z.object({
  key: z.number().optional().default(0),
  guardar: z.number().optional().default(0),
  modificar: z.number().optional().default(0),
  eliminar: z.number().optional().default(0)
});

export const repeatMotionShema = z.object({
  key: z.number().optional().default(0),
  guardar: z.number().optional().default(0),
  reporte: z.number().optional().default(0)
});

export const companyShema = z.object({
  key: z.number().optional().default(0),
  guardar: z.number().optional().default(0),
  modificar: z.number().optional().default(0)
});

export const repeatSalesShema = z.object({
  key: z.number().optional().default(0),
  guardar: z.number().optional().default(0),
  modificar: z.number().optional().default(0),
  eliminar: z.number().optional().default(0),
  reporte: z.number().optional().default(0)
});


export const repeatMovementsByCustomerAndSuppliers = z.object({
  key: z.number().optional().default(0),
  pagos: z.number().optional().default(0),
  anular: z.number().optional().default(0),
  eliminar: z.number().optional().default(0)
})

export const movementsByCustomersAndSuppliersShema = z.object({
  key: z.number().optional().default(0),
  cartera: z.number().optional().default(0),
  estado_cuenta: z.number().optional().default(0),
  permisos_cartera: z.array(repeatMovementsByCustomerAndSuppliers),
  reporte: z.number().optional().default(0)
})

// * Permissions by users
const permisssionsUserFormShema = z.object({
  empresa: z.number(),
  permisos_empresa: z.array(companyShema),
  usuario: z.number(),
  permisos_usuario: z.array(repeatShema),
  proveedor: z.number(),
  permisos_proveedor: z.array(repeatShema),
  cliente: z.number(),
  permisos_cliente: z.array(repeatShema),
  marca: z.number(),
  permisos_marca: z.array(repeatShema),
  categoria: z.number(),
  permisos_categoria: z.array(repeatShema),
  producto: z.number(),
  permisos_producto: z.array(repeatShema),
  inventario: z.number(),
  remisiones: z.number(),
  permisos_remisiones: z.array(repeatSalesShema),
  compra: z.number(),
  permisos_compra: z.array(repeatMotionShema),
  devolucion_compra: z.number(),
  permisos_devolucion_compra: z.array(repeatMotionShema),
  cotizacion_venta: z.number(),
  permisos_cotizacion_venta: z.array(repeatSalesShema),
  producto_apartado: z.number(),
  permisos_producto_apartado: z.array(repeatSalesShema),
  prefacturacion: z.number(),
  permisos_prefacturacion: z.array(repeatMotionShema),
  venta: z.number(),
  permisos_venta: z.array(repeatMotionShema),
  devolucion_venta: z.number(),
  permisos_devolucion_venta: z.array(repeatMotionShema),
  kardex: z.number(),
  reportes_inventario: z.number(),
  cuenta_corriente: z.number(),
  permisos_cuenta_corriente: z.array(repeatSalesShema),
  cuenta_xcobrar: z.number(),
  permisos_cuenta_xcobrar: z.array(movementsByCustomersAndSuppliersShema),
  cuenta_xpagar: z.number(),
  permisos_cuenta_xpagar: z.array(movementsByCustomersAndSuppliersShema),
  contabilidad: z.number(),
  permisos_contabilidad: z.array(repeatSalesShema),
  reportes: z.number(),
  id_usuario: z.string()
});

export const permissionsUserFormDataSchema = z.array(
  permisssionsUserFormShema.pick({
    empresa: true,
    permisos_empresa: true,
    usuario: true,
    permisos_usuario: true,
    proveedor: true,
    permisos_proveedor: true,
    cliente: true,
    permisos_cliente: true,
    marca: true,
    permisos_marca: true,
    categoria: true,
    permisos_categoria: true,
    producto: true,
    permisos_producto: true,
    inventario: true,
    remisiones: true,
    permisos_remisiones: true,
    compra: true,
    permisos_compra: true,
    devolucion_compra: true,
    permisos_devolucion_compra: true,
    cotizacion_venta: true,
    permisos_cotizacion_venta: true,
    producto_apartado: true,
    permisos_producto_apartado: true,
    prefacturacion: true,
    permisos_prefacturacion: true,
    venta: true,
    permisos_venta: true,
    devolucion_venta: true,
    permisos_devolucion_venta: true,
    kardex: true,
    reportes_inventario: true,
    cuenta_corriente: true,
    permisos_cuenta_corriente: true,
    cuenta_xcobrar: true,
    permisos_cuenta_xcobrar: true,
    cuenta_xpagar: true,
    permisos_cuenta_xpagar: true,
    contabilidad: true,
    permisos_contabilidad: true,
    reportes: true,
    id_usuario: true
  })
)

export type PermissionsUserData = z.infer<typeof permisssionsUserFormShema>;
export type PermissionsUserFormData = Pick<PermissionsUserData,
  "empresa" |
  "permisos_empresa" |
  "usuario" |
  "permisos_usuario" |
  "proveedor" |
  "permisos_proveedor" |
  "cliente" |
  "permisos_cliente" |
  "marca" |
  "permisos_marca" |
  "categoria" |
  "permisos_categoria" |
  "producto" |
  "permisos_producto" |
  "inventario" |
  "remisiones" |
  "permisos_remisiones" |
  "compra" |
  "permisos_compra" |
  "devolucion_compra" |
  "permisos_devolucion_compra" |
  "cotizacion_venta" |
  "permisos_cotizacion_venta" |
  "producto_apartado" |
  "permisos_producto_apartado" |
  "prefacturacion" |
  "permisos_prefacturacion" |
  "venta" |
  "permisos_venta" |
  "devolucion_venta" |
  "permisos_devolucion_venta" |
  "kardex" |
  "reportes_inventario" |
  "cuenta_corriente" |
  "permisos_cuenta_corriente" |
  "cuenta_xcobrar" |
  "permisos_cuenta_xcobrar" |
  "cuenta_xpagar" |
  "permisos_cuenta_xpagar" |
  "contabilidad" |
  "permisos_contabilidad" |
  "reportes" |
  "id_usuario"
>;