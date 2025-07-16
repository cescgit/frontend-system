import { z } from "zod";
import { movementsByCustomersAndSuppliersShema, repeatMotionShema, repeatSalesShema, repeatShema } from "./userData";

const detailsLogin = z.object({
  sesion_activa: z.number(),
  navegador: z.string(),
  sistema_operativo: z.string(),
  tipo_dispositivo: z.string(),
  user_agent: z.string()
})

// * Auth User
const authShema = z.object({
  correo_usuario: z.string().email(),
  nombre_usuario: z.string(),
  tipo_usuario: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  detalle_inicio_sesion: z.array(detailsLogin),
  empresa: z.number(),
  permisos_empresa: z.array(repeatShema),
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
  token: z.string()
});

// * Auth Users 
export const userSchema = authShema
  .pick({
    correo_usuario: true,
    nombre_usuario: true,    
    tipo_usuario: true,
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
    reportes: true
  })
  .extend({
    id: z.string(),
  });

export type UserAuth = z.infer<typeof userSchema>;

export type Auth = z.infer<typeof authShema>;
export type UserLoginForm = Pick<Auth, "correo_usuario" | "password" | "detalle_inicio_sesion">;
export type UserRegistrationForm = Pick<
  Auth,
  "correo_usuario" | "nombre_usuario" | "tipo_usuario" | "password" | "password_confirmation"
>;
export type RequestConfirmationCodeForm = Pick<Auth, "correo_usuario">;
export type ForgotPasswordForm = Pick<Auth, "correo_usuario">;
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">;

export type ConfirmToken = Pick<Auth, "token">;


export type permissionsUser = {
  // tipo_usuario: Auth["tipo_usuario"],
  usuario: Auth["usuario"],
  empresa: Auth["empresa"],
  proveedor: Auth["proveedor"],
  cliente: Auth["cliente"],
  marca: Auth["marca"],
  categoria: Auth["categoria"],
  producto: Auth["producto"],
  inventario: Auth["inventario"],
  remisiones: Auth["remisiones"],
  compra: Auth["compra"],
  devolucion_compra: Auth["devolucion_compra"],
  cotizacion_venta: Auth["cotizacion_venta"],
  producto_apartado: Auth["producto_apartado"],
  prefacturacion: Auth["prefacturacion"],
  venta: Auth["venta"],
  devolucion_venta: Auth["devolucion_venta"],
  kardex: Auth["kardex"],
  reportes_inventario: Auth["reportes_inventario"],
  cuenta_corriente: Auth["cuenta_corriente"],
  cuenta_xcobrar: Auth["cuenta_xcobrar"],
  cuenta_xpagar: Auth["cuenta_xpagar"],
  contabilidad: Auth["contabilidad"],
  reportes: Auth["reportes"]
};

export type AuthPermissions = Pick<Auth,
  "tipo_usuario" |
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
  "reportes">