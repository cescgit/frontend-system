import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { PermissionsUserFormData } from "../../types/userData";
import { addOrUpdatePermissionsUser, getPermissionsUser } from "../../api/UserAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreateOrEditPermissionsUser() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const userId = queryParams.get("permissionsUser")!
    const id_usuario = userId;

    const { data } = useQuery({
        queryKey: ["users", userId],
        queryFn: () => getPermissionsUser({ id_usuario }),
        enabled: !!userId,
        retry: false
    })

    const [permissionsData, setPermissionsData] = useState(data)

    useEffect(() => {
        setPermissionsData(data)
    }, [data])

    const [open, setOpen] = useState(false);
    const [permisosUsuario, setPermisosUsuario] = useState({
        key: 1,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosProveedor, setPermisosProveedor] = useState({
        key: 2,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosCliente, setPermisosCliente] = useState({
        key: 3,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosMarca, setPermisosMarca] = useState({
        key: 4,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosProducto, setPermisosProducto] = useState({
        key: 5,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosCategoria, setPermisosCategoria] = useState({
        key: 6,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosCompra, setPermisosCompra] = useState({
        key: 7,
        guardar: 0,
        reporte: 0
    })

    const [permisosDevolucionCompra, setPermisosDevolucionCompra] = useState({
        key: 8,
        guardar: 0,
        reporte: 0
    })

    const [permisosCotizacionVenta, setPermisosCotizacionVenta] = useState({
        key: 9,
        guardar: 0,
        modificar: 0,
        eliminar: 0,
        reporte: 0
    })

    const [permisosPrefacturacion, setPermisosPrefacturacion] = useState({
        key: 10,
        guardar: 0,
        reporte: 0
    })

    const [permisosVentas, setPermisosVentas] = useState({
        key: 11,
        guardar: 0,
        reporte: 0
    })

    const [permisosDevolucionVenta, setPermisosDevolucionVenta] = useState({
        key: 12,
        guardar: 0,
        reporte: 0
    })

    const [permisosCuentaCorriente, setPermisosCuentaCorriente] = useState({
        key: 13,
        guardar: 0,
        modificar: 0,
        eliminar: 0,
        reporte: 0
    })

    const [permisosCuentaXCobrar, setPermisosCuentaXCobrar] = useState({
        key: 14,
        estado_cuenta: 0,
        cartera: 0,
        permisos_cartera: [{
            key: 14.1,
            pagos: 0,
            anular: 0,
            eliminar: 0,
        }],
        reporte: 0
    })

    const [permisosCuentaXPagar, setPermisosCuentaXPagar] = useState({
        key: 15,
        estado_cuenta: 0,
        cartera: 0,
        permisos_cartera: [{
            key: 15.1,
            pagos: 0,
            anular: 0,
            eliminar: 0,
        }],
        reporte: 0
    })

    const [permisosContabilidad, setPermisosContabilidad] = useState({
        key: 16,
        guardar: 0,
        modificar: 0,
        eliminar: 0,
        reporte: 0
    })

    const [permisosEmpresa, setPermisosEmpresa] = useState({
        key: 17,
        guardar: 0,
        modificar: 0,
    })
    const [permisosRemisiones, setPermisosRemisiones] = useState({
        key: 18,
        guardar: 0,
        modificar: 0,
        eliminar: 0,
        reporte: 0
    })
        const [permisosProductosApartado, setPermisosProductosApartado] = useState({
        key: 19,
        guardar: 0,
        modificar: 0,
        eliminar: 0,
        reporte: 0
    })

    const [permissionsUserAddORUpdate, setPermissionsUserAddORUpdate] = useState({
        empresa: 0,
        permisos_empresa: [permisosEmpresa],
        usuario: 0,
        permisos_usuario: [permisosUsuario],
        proveedor: 0,
        permisos_proveedor: [permisosProveedor],
        cliente: 0,
        permisos_cliente: [permisosCliente],
        marca: 0,
        permisos_marca: [permisosMarca],
        categoria: 0,
        permisos_categoria: [permisosCategoria],
        producto: 0,
        permisos_producto: [permisosProducto],
        inventario: 0,
        remisiones: 0,
        permisos_remisiones: [permisosRemisiones],
        compra: 0,
        permisos_compra: [permisosCompra],
        devolucion_compra: 0,
        permisos_devolucion_compra: [permisosDevolucionCompra],
        cotizacion_venta: 0,
        permisos_cotizacion_venta: [permisosCotizacionVenta],
        producto_apartado: 0,
        permisos_producto_apartado: [permisosProductosApartado],
        prefacturacion: 0,
        permisos_prefacturacion: [permisosPrefacturacion],
        venta: 0,
        permisos_venta: [permisosVentas],
        devolucion_venta: 0,
        permisos_devolucion_venta: [permisosDevolucionVenta],
        kardex: 0,
        reportes_inventario: 0,
        cuenta_corriente: 0,
        permisos_cuenta_corriente: [permisosCuentaCorriente],
        cuenta_xcobrar: 0,
        permisos_cuenta_xcobrar: [permisosCuentaXCobrar],
        cuenta_xpagar: 0,
        permisos_cuenta_xpagar: [permisosCuentaXPagar],
        contabilidad: 0,
        permisos_contabilidad: [permisosContabilidad],
        reportes: 0,
        id_usuario: ""
    })

    const queryClient = useQueryClient()

    const {
        handleSubmit
    } = useForm<PermissionsUserFormData>()

    const { mutate } = useMutation({
        mutationFn: addOrUpdatePermissionsUser,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Permisos del usuario",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-red-500 font-bold">
                            {error.message}
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
            navigate(location.pathname, { replace: true })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users", userId] })
            MySwal.fire({
                position: "center",
                title: "Permisos del usuario",
                icon: "success",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-cyan-500 font-bold">
                            {data}
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
            navigate(location.pathname, { replace: true })
            setOpen(!open)
        }
    })


    const onSubmitPermissions = () => {
        if (permissionsData != undefined) {
            permissionsUserAddORUpdate.empresa = permissionsData![0].empresa;
            permissionsUserAddORUpdate.permisos_empresa = permissionsData![0].permisos_empresa;
            permissionsUserAddORUpdate.usuario = permissionsData![0].usuario;
            permissionsUserAddORUpdate.permisos_usuario = permissionsData![0].permisos_usuario;
            permissionsUserAddORUpdate.usuario = permissionsData![0].usuario;
            permissionsUserAddORUpdate.permisos_usuario = permissionsData![0].permisos_usuario;
            permissionsUserAddORUpdate.proveedor = permissionsData![0].proveedor;
            permissionsUserAddORUpdate.permisos_proveedor = permissionsData![0].permisos_proveedor;
            permissionsUserAddORUpdate.cliente = permissionsData![0].cliente;
            permissionsUserAddORUpdate.permisos_cliente = permissionsData![0].permisos_cliente;
            permissionsUserAddORUpdate.cliente = permissionsData![0].cliente;
            permissionsUserAddORUpdate.permisos_cliente = permissionsData![0].permisos_cliente;
            permissionsUserAddORUpdate.marca = permissionsData![0].marca;
            permissionsUserAddORUpdate.permisos_marca = permissionsData![0].permisos_marca;
            permissionsUserAddORUpdate.categoria = permissionsData![0].categoria;
            permissionsUserAddORUpdate.permisos_categoria = permissionsData![0].permisos_categoria;
            permissionsUserAddORUpdate.producto = permissionsData![0].producto;
            permissionsUserAddORUpdate.permisos_producto = permissionsData![0].permisos_producto;
            permissionsUserAddORUpdate.inventario = permissionsData![0].inventario;
            permissionsUserAddORUpdate.remisiones = permissionsData![0].remisiones;
            permissionsUserAddORUpdate.permisos_remisiones = permissionsData![0].permisos_remisiones;
            permissionsUserAddORUpdate.compra = permissionsData![0].compra;
            permissionsUserAddORUpdate.permisos_compra = permissionsData![0].permisos_compra;
            permissionsUserAddORUpdate.devolucion_compra = permissionsData![0].devolucion_compra;
            permissionsUserAddORUpdate.permisos_devolucion_compra = permissionsData![0].permisos_devolucion_compra;
            permissionsUserAddORUpdate.cotizacion_venta = permissionsData![0].cotizacion_venta;
            permissionsUserAddORUpdate.permisos_cotizacion_venta = permissionsData![0].permisos_cotizacion_venta;
            permissionsUserAddORUpdate.producto_apartado = permissionsData![0].producto_apartado;
            permissionsUserAddORUpdate.permisos_producto_apartado = permissionsData![0].permisos_producto_apartado;
            permissionsUserAddORUpdate.prefacturacion = permissionsData![0].prefacturacion;
            permissionsUserAddORUpdate.permisos_prefacturacion = permissionsData![0].permisos_prefacturacion;
            permissionsUserAddORUpdate.venta = permissionsData![0].venta;
            permissionsUserAddORUpdate.permisos_venta = permissionsData![0].permisos_venta;
            permissionsUserAddORUpdate.devolucion_venta = permissionsData![0].devolucion_venta;
            permissionsUserAddORUpdate.permisos_devolucion_venta = permissionsData![0].permisos_devolucion_venta;
            permissionsUserAddORUpdate.kardex = permissionsData![0].kardex;
            permissionsUserAddORUpdate.reportes_inventario = permissionsData![0].reportes_inventario;
            permissionsUserAddORUpdate.cuenta_corriente = permissionsData![0].cuenta_corriente;
            permissionsUserAddORUpdate.permisos_cuenta_corriente = permissionsData![0].permisos_cuenta_corriente;
            permissionsUserAddORUpdate.cuenta_xcobrar = permissionsData![0].cuenta_xcobrar;
            permissionsUserAddORUpdate.permisos_cuenta_xcobrar = permissionsData![0].permisos_cuenta_xcobrar;
            permissionsUserAddORUpdate.cuenta_xpagar = permissionsData![0].cuenta_xpagar;
            permissionsUserAddORUpdate.permisos_cuenta_xpagar = permissionsData![0].permisos_cuenta_xpagar;
            permissionsUserAddORUpdate.contabilidad = permissionsData![0].contabilidad;
            permissionsUserAddORUpdate.permisos_contabilidad = permissionsData![0].permisos_contabilidad;
            permissionsUserAddORUpdate.reportes = permissionsData![0].reportes;
        }
        else {
            permissionsUserAddORUpdate.permisos_empresa = [permisosEmpresa];
            permissionsUserAddORUpdate.permisos_usuario = [permisosUsuario];
            permissionsUserAddORUpdate.permisos_proveedor = [permisosProveedor];
            permissionsUserAddORUpdate.permisos_cliente = [permisosCliente];
            permissionsUserAddORUpdate.permisos_marca = [permisosMarca];
            permissionsUserAddORUpdate.permisos_categoria = [permisosCategoria];
            permissionsUserAddORUpdate.permisos_producto = [permisosProducto];
            permissionsUserAddORUpdate.permisos_remisiones = [permisosRemisiones];
            permissionsUserAddORUpdate.permisos_compra = [permisosCompra];
            permissionsUserAddORUpdate.permisos_devolucion_compra = [permisosDevolucionCompra];
            permissionsUserAddORUpdate.permisos_cotizacion_venta = [permisosCotizacionVenta];
            permissionsUserAddORUpdate.permisos_producto_apartado = [permisosProductosApartado];
            permissionsUserAddORUpdate.permisos_prefacturacion = [permisosPrefacturacion];
            permissionsUserAddORUpdate.permisos_venta = [permisosVentas];
            permissionsUserAddORUpdate.permisos_devolucion_venta = [permisosDevolucionVenta];
            permissionsUserAddORUpdate.permisos_cuenta_corriente = [permisosCuentaCorriente];
            permissionsUserAddORUpdate.permisos_cuenta_xcobrar = [permisosCuentaXCobrar];
            permissionsUserAddORUpdate.permisos_cuenta_xpagar = [permisosCuentaXPagar];
            permissionsUserAddORUpdate.permisos_contabilidad = [permisosContabilidad];
        }

        const formData = permissionsUserAddORUpdate;
        const dataPermissions = { id_usuario, formData }        
        mutate(dataPermissions)

    }

    if (data === undefined) return (
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/65 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed left-1/2 top-1/2 h-[95%] overflow-y-auto touch-pan-y w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                <Dialog.Title className="font-bold text-black text-2xl text-center">
                    Agrega o Modifica Permisos
                </Dialog.Title>
                <Dialog.Description className="my-2 text-base text-black text-center">
                    Crear o modifica los permisos o autorizaciones de los usuarios en el sistema...
                </Dialog.Description>
                <form
                    onSubmit={handleSubmit(onSubmitPermissions)}
                    className="space-y-3 h-[85%] top-0 sticky"
                >
                    <div
                        className="h-[90%] overflow-y-auto touch-pan-y space-y-2"
                    >

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="usuario">
                                Usuario
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="usuario"
                                checked={permissionsUserAddORUpdate.usuario ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, usuario: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.usuario == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        {
                                            <div
                                                className="flex items-start flex-col"
                                            >

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_usuario">
                                                        Guardar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                        type="checkbox"
                                                        id="guardar_usuario"
                                                        checked={permisosUsuario.guardar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosUsuario({ ...permisosUsuario, guardar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_usuario">
                                                        Modificar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                        type="checkbox"
                                                        id="modificar_usuario"
                                                        checked={permisosUsuario.modificar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosUsuario({ ...permisosUsuario, modificar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_usuario">
                                                        Eliminar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                        type="checkbox"
                                                        id="eliminar_usuario"
                                                        checked={permisosUsuario.eliminar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosUsuario({ ...permisosUsuario, eliminar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="proveedor">
                                Proveedor
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="proveedor"
                                checked={permissionsUserAddORUpdate.proveedor == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, proveedor: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.proveedor == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_proveedor">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_proveedor"
                                                    checked={permisosProveedor.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProveedor({ ...permisosProveedor, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_proveedor">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_proveedor"
                                                    checked={permisosProveedor.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProveedor({ ...permisosProveedor, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_proveedor">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_proveedor"
                                                    checked={permisosProveedor.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProveedor({ ...permisosProveedor, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="cliente">
                                Cliente
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="cliente"
                                checked={permissionsUserAddORUpdate.cliente == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cliente: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.cliente == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_cliente">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_cliente"
                                                    checked={permisosCliente.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCliente({ ...permisosCliente, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_cliente">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_cliente"
                                                    checked={permisosCliente.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCliente({ ...permisosCliente, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_cliente">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_cliente"
                                                    checked={permisosCliente.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCliente({ ...permisosCliente, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="marca">
                                Marca
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="marca"
                                checked={permissionsUserAddORUpdate.marca == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, marca: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.marca == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_marca">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_marca"
                                                    checked={permisosMarca.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosMarca({ ...permisosMarca, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_marca">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_marca"
                                                    checked={permisosMarca.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosMarca({ ...permisosMarca, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_marca">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_marca"
                                                    checked={permisosMarca.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosMarca({ ...permisosMarca, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="categoria">
                                Categoria
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="categoria"
                                checked={permissionsUserAddORUpdate.categoria == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, categoria: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.categoria == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_categoria">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_categoria"
                                                    checked={permisosCategoria.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCategoria({ ...permisosCategoria, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_categoria">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_categoria"
                                                    checked={permisosCategoria.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCategoria({ ...permisosCategoria, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_categoria">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_categoria"
                                                    checked={permisosCategoria.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCategoria({ ...permisosCategoria, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="producto">
                                Producto
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="producto"
                                checked={permissionsUserAddORUpdate.producto == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, producto: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.producto == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_producto">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_producto"
                                                    checked={permisosProducto.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProducto({ ...permisosProducto, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_producto">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_producto"
                                                    checked={permisosProducto.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProducto({ ...permisosProducto, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_producto">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_producto"
                                                    checked={permisosProducto.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProducto({ ...permisosProducto, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="inventario">
                                Inventario
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="inventario"
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, inventario: +e.target.checked });
                                }}
                            />
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="compra">
                                Compra
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="compra"
                                checked={permissionsUserAddORUpdate.compra == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, compra: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.compra == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_compra">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_compra"
                                                    checked={permisosCompra.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCompra({ ...permisosCompra, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_compra">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_compra"
                                                    checked={permisosCompra.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCompra({ ...permisosCompra, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="devolucion_compra">
                                Devolución compra
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="devolucion_compra"
                                checked={permissionsUserAddORUpdate.devolucion_compra == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, devolucion_compra: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.devolucion_compra == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_devolucion_compra">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_devolucion_compra"
                                                    checked={permisosDevolucionCompra.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosDevolucionCompra({ ...permisosDevolucionCompra, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_devolucion_compra">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_devolucion_compra"
                                                    checked={permisosDevolucionCompra.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosDevolucionCompra({ ...permisosDevolucionCompra, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="remisiones">
                                Remisiones
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="remisiones"
                                checked={permissionsUserAddORUpdate.remisiones ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, remisiones: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.remisiones == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        {
                                            <div
                                                className="flex items-start flex-col"
                                            >

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_remisiones">
                                                        Guardar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                        type="checkbox"
                                                        id="guardar_remisiones"
                                                        checked={permisosRemisiones.guardar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosRemisiones({ ...permisosRemisiones, guardar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_remisiones">
                                                        Modificar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                        type="checkbox"
                                                        id="modificar_remisiones"
                                                        checked={permisosRemisiones.modificar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosRemisiones({ ...permisosRemisiones, modificar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_remisiones">
                                                        Eliminar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                        type="checkbox"
                                                        id="eliminar_remisiones"
                                                        checked={permisosRemisiones.eliminar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosRemisiones({ ...permisosRemisiones, eliminar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_remisiones">
                                                        Reporte
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                        type="checkbox"
                                                        id="reporte_remisiones"
                                                        checked={permisosRemisiones.reporte ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosRemisiones({ ...permisosRemisiones, reporte: +e.target.checked });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        </div>


                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="producto_apartado">
                                Apartado de productos
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="producto_apartado"
                                checked={permissionsUserAddORUpdate.producto_apartado === 1}
                                onChange={(e) => {
                                    const newValue = +e.target.checked;
                                    setPermissionsUserAddORUpdate(prev => ({ 
                                        ...prev, 
                                        producto_apartado: newValue 
                                    }));
                                    if (!newValue) {
                                        setPermisosProductosApartado({
                                            key: 19,
                                            guardar: 0,
                                            modificar: 0,
                                            eliminar: 0,
                                            reporte: 0
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.producto_apartado == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        {
                                            <div
                                                className="flex items-start flex-col"
                                            >

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_producto_apartado">
                                                        Guardar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                        type="checkbox"
                                                        id="guardar_producto_apartado"
                                                        checked={permisosProductosApartado.guardar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosProductosApartado({ ...permisosProductosApartado, guardar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_producto_apartado">
                                                        Modificar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                        type="checkbox"
                                                        id="modificar_producto_apartado"
                                                        checked={permisosProductosApartado.modificar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosProductosApartado({ ...permisosProductosApartado, modificar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_producto_apartado">
                                                        Eliminar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                        type="checkbox"
                                                        id="eliminar_producto_apartado"
                                                        checked={permisosProductosApartado.eliminar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosProductosApartado({ ...permisosProductosApartado, eliminar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_producto_apartado">
                                                        Reporte
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                        type="checkbox"
                                                        id="reporte_producto_apartado"
                                                        checked={permisosProductosApartado.reporte ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosProductosApartado({ ...permisosProductosApartado, reporte: +e.target.checked });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="cotizacion_venta">
                                Proforma
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="cotizacion_venta"
                                checked={permissionsUserAddORUpdate.cotizacion_venta === 1}
                                onChange={(e) => {
                                    const newValue = +e.target.checked;
                                    setPermissionsUserAddORUpdate(prev => ({ 
                                        ...prev, 
                                        cotizacion_venta: newValue 
                                    }));
                                    if (!newValue) {
                                        setPermisosCotizacionVenta({
                                            key: 9,
                                            guardar: 0,
                                            modificar: 0,
                                            eliminar: 0,
                                            reporte: 0
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.cotizacion_venta == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_cotizacion_venta">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_cotizacion_venta"
                                                    checked={permisosCotizacionVenta.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCotizacionVenta({ ...permisosCotizacionVenta, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_cotizacion_venta">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_cotizacion_venta"
                                                    checked={permisosCotizacionVenta.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCotizacionVenta({ ...permisosCotizacionVenta, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_cotizacion_venta">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_cotizacion_venta"
                                                    checked={permisosCotizacionVenta.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCotizacionVenta({ ...permisosCotizacionVenta, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_cotizacion_venta">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_cotizacion_venta"
                                                    checked={permisosCotizacionVenta.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCotizacionVenta({ ...permisosCotizacionVenta, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="prefacturacion">
                                Prefacturación
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="prefacturacion"
                                checked={permissionsUserAddORUpdate.prefacturacion ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, prefacturacion: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.prefacturacion == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_prefacturacion">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_prefacturacion"
                                                    checked={permisosPrefacturacion.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosPrefacturacion({ ...permisosPrefacturacion, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_prefacturacion">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_prefacturacion"
                                                    checked={permisosPrefacturacion.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosPrefacturacion({ ...permisosPrefacturacion, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="facturacion">
                                Facturación
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="facturacion"
                                checked={permissionsUserAddORUpdate.venta ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, venta: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.venta == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_facturacion">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_facturacion"
                                                    checked={permisosVentas.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosVentas({ ...permisosVentas, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_facturacion">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_facturacion"
                                                    checked={permisosVentas.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosVentas({ ...permisosVentas, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="devolucion_venta">
                                Devolución venta
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="devolucion_venta"
                                checked={permissionsUserAddORUpdate.devolucion_venta == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, devolucion_venta: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.devolucion_venta == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_devolucion_venta">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_devolucion_venta"
                                                    checked={permisosDevolucionVenta.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosDevolucionVenta({ ...permisosDevolucionVenta, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_devolucion_venta">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_devolucion_venta"
                                                    checked={permisosDevolucionVenta.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosDevolucionVenta({ ...permisosDevolucionVenta, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="kardex">
                                Kardex
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="kardex"
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, kardex: +e.target.checked });
                                }}
                            />
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="reportes_inventario">
                                Reportes de inventario
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="reportes_inventario"
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, reportes_inventario: +e.target.checked });
                                }}
                            />
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="cuenta_corriente">
                                Cuenta corriente
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="cuenta_corriente"
                                checked={permissionsUserAddORUpdate.cuenta_corriente == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cuenta_corriente: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.cuenta_corriente == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_cuenta_corriente">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_cuenta_corriente"
                                                    checked={permisosCuentaCorriente.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaCorriente({ ...permisosCuentaCorriente, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_cuenta_corriente">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_cuenta_corriente"
                                                    checked={permisosCuentaCorriente.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaCorriente({ ...permisosCuentaCorriente, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_cuenta_corriente">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_cuenta_corriente"
                                                    checked={permisosCuentaCorriente.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaCorriente({ ...permisosCuentaCorriente, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_cuenta_corriente">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_cuenta_corriente"
                                                    checked={permisosCuentaCorriente.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaCorriente({ ...permisosCuentaCorriente, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="cuenta_xcobrar">
                                Cuenta por cobrar
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="cuenta_xcobrar"
                                checked={permissionsUserAddORUpdate.cuenta_xcobrar == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cuenta_xcobrar: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-56 ml-4">
                            {
                                permissionsUserAddORUpdate.cuenta_xcobrar == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="estado_cuenta_xcobrar">
                                                    Estado cuenta
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="estado_cuenta_xcobrar"
                                                    checked={permisosCuentaXCobrar.estado_cuenta ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaXCobrar({ ...permisosCuentaXCobrar, estado_cuenta: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_cuenta_xcobrar">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_cuenta_xcobrar"
                                                    checked={permisosCuentaXCobrar.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaXCobrar({ ...permisosCuentaXCobrar, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="cartera_cuenta_xcobrar">
                                                    Cartera
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="cartera_cuenta_xcobrar"
                                                    checked={permisosCuentaXCobrar.cartera ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaXCobrar({ ...permisosCuentaXCobrar, cartera: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="ml-4 w-full">
                                                {
                                                    permisosCuentaXCobrar.cartera == 1 && (

                                                        <div className="flex items-start flex-col">
                                                            <div className="border border-gray-400 w-[90%]"></div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 font-bold" htmlFor="permisos_cartera_pagos_xcobrar">
                                                                    Pagos
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                    type="checkbox"
                                                                    id="permisos_cartera_pagos_xcobrar"
                                                                    checked={permisosCuentaXCobrar.permisos_cartera[0].pagos ? true : false}
                                                                    onChange={(e) => {
                                                                        const nuevoPermiso = +e.target.checked;
                                                                        const nuevaCartera = [...permisosCuentaXCobrar.permisos_cartera];
                                                                        nuevaCartera[0] = {
                                                                            ...nuevaCartera[0],
                                                                            pagos: nuevoPermiso
                                                                        };

                                                                        setPermisosCuentaXCobrar({
                                                                            ...permisosCuentaXCobrar,
                                                                            permisos_cartera: nuevaCartera
                                                                        });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-500 font-bold" htmlFor="permisos_cartera_anular_xcobrar">
                                                                    Anular
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-500"
                                                                    type="checkbox"
                                                                    id="permisos_cartera_anular_xcobrar"
                                                                    checked={permisosCuentaXCobrar.permisos_cartera[0].anular ? true : false}
                                                                    onChange={(e) => {
                                                                        const nuevoPermiso = +e.target.checked;
                                                                        const nuevaCartera = [...permisosCuentaXCobrar.permisos_cartera];
                                                                        nuevaCartera[0] = {
                                                                            ...nuevaCartera[0],
                                                                            anular: nuevoPermiso
                                                                        };

                                                                        setPermisosCuentaXCobrar({
                                                                            ...permisosCuentaXCobrar,
                                                                            permisos_cartera: nuevaCartera
                                                                        });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-500 font-bold" htmlFor="permisos_cartera_eliminar_xcobrar">
                                                                    Eliminar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-500"
                                                                    type="checkbox"
                                                                    id="permisos_cartera_eliminar_xcobrar"
                                                                    checked={permisosCuentaXCobrar.permisos_cartera[0].eliminar ? true : false}
                                                                    onChange={(e) => {
                                                                        const nuevoPermiso = +e.target.checked;
                                                                        const nuevaCartera = [...permisosCuentaXCobrar.permisos_cartera];
                                                                        nuevaCartera[0] = {
                                                                            ...nuevaCartera[0],
                                                                            eliminar: nuevoPermiso
                                                                        };

                                                                        setPermisosCuentaXCobrar({
                                                                            ...permisosCuentaXCobrar,
                                                                            permisos_cartera: nuevaCartera
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="cuenta_xpagar">
                                Cuenta por pagar
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="cuenta_xpagar"
                                checked={permissionsUserAddORUpdate.cuenta_xpagar == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cuenta_xpagar: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-56 ml-4">
                            {
                                permissionsUserAddORUpdate.cuenta_xpagar == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start justify-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="estado_cuenta_xpagar">
                                                    Estado cuenta
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="estado_cuenta_xpagar"
                                                    checked={permisosCuentaXPagar.estado_cuenta ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaXPagar({ ...permisosCuentaXPagar, estado_cuenta: +e.target.checked });
                                                    }}
                                                />
                                            </div>


                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_cuenta_xpagar">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_cuenta_xpagar"
                                                    checked={permisosCuentaXPagar.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaXPagar({ ...permisosCuentaXPagar, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="cartera_cuenta_xpagar">
                                                    Cartera
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="cartera_cuenta_xpagar"
                                                    checked={permisosCuentaXPagar.cartera ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCuentaXPagar({ ...permisosCuentaXPagar, cartera: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="ml-4 w-full">
                                                {
                                                    permisosCuentaXPagar.cartera == 1 && (
                                                        <div className="flex items-start flex-col">
                                                            <div className="border border-gray-400 w-[90%]"></div>
                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 font-bold" htmlFor="permisos_cartera_pagos">
                                                                    Pagos
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                    type="checkbox"
                                                                    id="permisos_cartera_pagos"
                                                                    checked={permisosCuentaXPagar.permisos_cartera[0].pagos ? true : false}
                                                                    onChange={(e) => {
                                                                        const nuevoPermiso = +e.target.checked;
                                                                        const nuevaCartera = [...permisosCuentaXPagar.permisos_cartera];
                                                                        nuevaCartera[0] = {
                                                                            ...nuevaCartera[0],
                                                                            pagos: nuevoPermiso
                                                                        };

                                                                        setPermisosCuentaXPagar({
                                                                            ...permisosCuentaXPagar,
                                                                            permisos_cartera: nuevaCartera
                                                                        });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-500 font-bold" htmlFor="permisos_cartera_anular">
                                                                    Anular
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-500"
                                                                    type="checkbox"
                                                                    id="permisos_cartera_anular"
                                                                    checked={permisosCuentaXPagar.permisos_cartera[0].anular ? true : false}
                                                                    onChange={(e) => {
                                                                        const nuevoPermiso = +e.target.checked;
                                                                        const nuevaCartera = [...permisosCuentaXPagar.permisos_cartera];
                                                                        nuevaCartera[0] = {
                                                                            ...nuevaCartera[0],
                                                                            anular: nuevoPermiso
                                                                        };

                                                                        setPermisosCuentaXPagar({
                                                                            ...permisosCuentaXPagar,
                                                                            permisos_cartera: nuevaCartera
                                                                        });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-500 font-bold" htmlFor="permisos_cartera_eliminar">
                                                                    Eliminar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-500"
                                                                    type="checkbox"
                                                                    id="permisos_cartera_anular"
                                                                    checked={permisosCuentaXPagar.permisos_cartera[0].anular ? true : false}
                                                                    onChange={(e) => {
                                                                        const nuevoPermiso = +e.target.checked;
                                                                        const nuevaCartera = [...permisosCuentaXPagar.permisos_cartera];
                                                                        nuevaCartera[0] = {
                                                                            ...nuevaCartera[0],
                                                                            eliminar: nuevoPermiso
                                                                        };

                                                                        setPermisosCuentaXPagar({
                                                                            ...permisosCuentaXPagar,
                                                                            permisos_cartera: nuevaCartera
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="contabilidad">
                                Contabilidad
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="contabilidad"
                                checked={permissionsUserAddORUpdate.contabilidad == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, contabilidad: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.contabilidad == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_contabilidad">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_contabilidad"
                                                    checked={permisosContabilidad.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosContabilidad({ ...permisosContabilidad, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_contabilidad">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_contabilidad"
                                                    checked={permisosContabilidad.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosContabilidad({ ...permisosContabilidad, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_contabilidad">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_contabilidad"
                                                    checked={permisosContabilidad.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosContabilidad({ ...permisosContabilidad, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_contabilidad">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_contabilidad"
                                                    checked={permisosContabilidad.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosContabilidad({ ...permisosContabilidad, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="reportes">
                                Reportes generales
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="reportes"
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, reportes: +e.target.checked });
                                }}
                            />
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left text-black font-bold" htmlFor="empresa">
                                Empresa
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="empresa"
                                checked={permissionsUserAddORUpdate.empresa == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, empresa: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.empresa == 1 && (
                                    <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_empresa">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                    type="checkbox"
                                                    id="guardar_empresa"
                                                    checked={permisosEmpresa.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosEmpresa({ ...permisosEmpresa, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_empresa">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_empresa"
                                                    checked={permisosEmpresa.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosEmpresa({ ...permisosEmpresa, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 md:w-auto mx-auto border border-gray-500 py-2 px-4 bg-gray-100 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-gray-300 transition-all duration-200"
                        aria-label="Close"
                        onClick={() => {
                            setTimeout(() => {
                                setOpen(false)
                            }, 100);
                        }}
                    >
                        <Save className="size-5" />
                        Guardar cambios
                    </button>

                </form>
                <Dialog.Close asChild>
                    <button
                        className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                        aria-label="Close"
                        onClick={() => {
                            navigate(location.pathname, { replace: true })
                            setOpen(false)
                        }}
                    >
                        <X />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    )

    if (data) return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/65 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed left-1/2 top-1/2 h-[95%] overflow-y-auto touch-pan-y w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Agrega o Modifica Permisos
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Crear o modifica los permisos o autorizaciones de los usuarios en el sistema...
                    </Dialog.Description>
                    <form
                        onSubmit={handleSubmit(onSubmitPermissions)}
                        className="space-y-3 h-[85%] top-0 sticky"
                    >
                        {
                            permissionsData?.map((permission) => (
                                <div
                                    key={permission.permisos_usuario[0].key}
                                    className="h-[90%] overflow-y-auto touch-pan-y space-y-2"
                                >

                                    {/* Permission user */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="usuario">
                                            Usuario
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="usuario"
                                            checked={permission.usuario ? true : false}
                                            onChange={(e) => {
                                                permission.usuario = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, usuario: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.usuario == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_usuario.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_usuario">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_usuario"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosUsuario({ ...permisosUsuario, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_usuario">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_usuario"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosUsuario({ ...permisosUsuario, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_usuario">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_usuario"
                                                                        checked={permisionCRUD.eliminar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosUsuario({ ...permisosUsuario, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission supplier */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="proveedor">
                                            Proveedor
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="proveedor"
                                            checked={permission.proveedor ? true : false}
                                            onChange={(e) => {
                                                permission.proveedor = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, proveedor: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.proveedor == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_proveedor.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_proveedor">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_proveedor"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosProveedor({ ...permisosProveedor, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_proveedor">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_proveedor"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosProveedor({ ...permisosProveedor, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_proveedor">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_proveedor"
                                                                        checked={permisionCRUD.eliminar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosProveedor({ ...permisosProveedor, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission customer */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="cliente">
                                            Cliente
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="cliente"
                                            checked={permission.cliente ? true : false}
                                            onChange={(e) => {
                                                permission.cliente = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cliente: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.cliente == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_cliente.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_cliente">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_cliente"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosCliente({ ...permisosCliente, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_cliente">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_cliente"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosCliente({ ...permisosCliente, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_cliente">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_cliente"
                                                                        checked={permisionCRUD.eliminar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosCliente({ ...permisosCliente, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission brand */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="marca">
                                            Marca
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="marca"
                                            checked={permission.marca ? true : false}
                                            onChange={(e) => {
                                                permission.marca = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, marca: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.marca == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_marca.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_marca">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_marca"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosMarca({ ...permisosMarca, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_marca">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_marca"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosMarca({ ...permisosMarca, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_marca">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_marca"
                                                                        checked={permisionCRUD.eliminar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosMarca({ ...permisosMarca, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission category */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="categoria">
                                            Categoria
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="categoria"
                                            checked={permission.categoria ? true : false}
                                            onChange={(e) => {
                                                permission.categoria = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, categoria: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.categoria == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_categoria.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_categoria">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_categoria"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosCategoria({ ...permisosCategoria, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_categoria">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_categoria"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosCategoria({ ...permisosCategoria, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_categoria">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_categoria"
                                                                        checked={permisionCRUD.eliminar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosCategoria({ ...permisosCategoria, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission product */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="producto">
                                            Producto
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="producto"
                                            checked={permission.producto ? true : false}
                                            onChange={(e) => {
                                                permission.producto = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, producto: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.producto == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_producto.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_producto">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_producto"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosProducto({ ...permisosProducto, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_producto">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_producto"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosProducto({ ...permisosProducto, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_producto">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_producto"
                                                                        checked={permisionCRUD.eliminar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosProducto({ ...permisosProducto, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission inventory */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="inventario">
                                            Inventario
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="inventario"
                                            checked={permission.inventario ? true : false}
                                            onChange={(e) => {
                                                permission.inventario = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, inventario: +e.target.checked });
                                            }}
                                        />
                                    </div>

                                    {/* Pemission buys */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="compra">
                                            Compra
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="compra"
                                            checked={permission.compra ? true : false}
                                            onChange={(e) => {
                                                permission.compra = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, compra: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.compra == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_compra.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_compra">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_compra"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosCompra({ ...permisosCompra, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_compra">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_compra"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosCompra({ ...permisosCompra, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission return buys */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="devolucion_compra">
                                            Devolución compra
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="devolucion_compra"
                                            checked={permission.devolucion_compra ? true : false}
                                            onChange={(e) => {
                                                permission.devolucion_compra = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, devolucion_compra: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.devolucion_compra == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_devolucion_compra.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_devolucion_compra">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_devolucion_compra"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosDevolucionCompra({ ...permisosDevolucionCompra, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_devolucion_compra">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_devolucion_compra"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosDevolucionCompra({ ...permisosDevolucionCompra, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission remissions */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="remisiones">
                                            Remisiones
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="remisiones"
                                            checked={permission.remisiones ? true : false}
                                            onChange={(e) => {
                                                permission.remisiones = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, remisiones: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.remisiones == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_remisiones.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_remisiones">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_remisiones"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosRemisiones({ ...permisosRemisiones, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_remisiones">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_remisiones"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosRemisiones({ ...permisosRemisiones, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-500 font-bold" htmlFor="eliminar_remisiones">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-500"
                                                                        type="checkbox"
                                                                        id="eliminar_remisiones"
                                                                        checked={permisionCRUD.eliminar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosRemisiones({ ...permisosRemisiones, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_compra">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_compra"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosRemisiones({ ...permisosRemisiones, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission separated product */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="producto_apartado">
                                            Apartado de productos
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="producto_apartado"
                                            checked={permission.producto_apartado ? true : false}
                                            onChange={(e) => {
                                                permission.producto_apartado = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, producto_apartado: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.producto_apartado == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_producto_apartado.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_producto_apartado">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_producto_apartado"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosProductosApartado({ ...permisosProductosApartado, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_producto_apartado">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_producto_apartado"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosProductosApartado({ ...permisosProductosApartado, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_producto_apartado">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_producto_apartado"
                                                                        checked={permisionCRUD.eliminar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosProductosApartado({ ...permisosProductosApartado, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_producto_apartado">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_producto_apartado"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosProductosApartado({ ...permisosProductosApartado, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission sales quote */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="cotizacion_venta">
                                            Proforma
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="cotizacion_venta"
                                            checked={permission.cotizacion_venta ? true : false}
                                            onChange={(e) => {
                                                permission.cotizacion_venta = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cotizacion_venta: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.cotizacion_venta == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_cotizacion_venta.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_cotiizacion_venta">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_cotiizacion_venta"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosCotizacionVenta({ ...permisosCotizacionVenta, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_cuenta_corriente">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_cuenta_corriente"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosCotizacionVenta({ ...permisosCotizacionVenta, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_cuenta_corriente">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_cuenta_corriente"
                                                                        checked={permisionCRUD.eliminar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosCotizacionVenta({ ...permisosCotizacionVenta, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_cuenta_corriente">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_cuenta_corriente"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosCotizacionVenta({ ...permisosCotizacionVenta, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission pre-invoicing */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="prefacturacion">
                                            Prefacturación
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="prefacturacion"
                                            checked={permission.prefacturacion ? true : false}
                                            onChange={(e) => {
                                                permission.prefacturacion = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, prefacturacion: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.prefacturacion == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_prefacturacion.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_devolucion_compra">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_devolucion_compra"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosPrefacturacion({ ...permisosPrefacturacion, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_devolucion_compra">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_devolucion_compra"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosPrefacturacion({ ...permisosPrefacturacion, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission billing */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="venta">
                                            Facturación
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="venta"
                                            checked={permission.venta ? true : false}
                                            onChange={(e) => {
                                                permission.venta = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, venta: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.venta == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_venta.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_venta">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_venta"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosVentas({ ...permisosVentas, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_venta">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_venta"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosVentas({ ...permisosVentas, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission return billing */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="devolucion_venta">
                                            Devolución Facturación
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="devolucion_venta"
                                            checked={permission.devolucion_venta ? true : false}
                                            onChange={(e) => {
                                                permission.devolucion_venta = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, devolucion_venta: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.devolucion_venta == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_devolucion_venta.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_devolucion_venta">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_devolucion_venta"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosDevolucionVenta({ ...permisosDevolucionVenta, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_devolucion_venta">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_devolucion_venta"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosDevolucionVenta({ ...permisosDevolucionVenta, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission kardex */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="kardex">
                                            Kardex
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="kardex"
                                            checked={permission.kardex ? true : false}
                                            onChange={(e) => {
                                                permission.kardex = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, kardex: +e.target.checked });
                                            }}
                                        />
                                    </div>

                                    {/* Pemission reports inventory */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="reportes_inventario">
                                            Reportes inventario
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="reportes_inventario"
                                            checked={permission.reportes_inventario ? true : false}
                                            onChange={(e) => {
                                                permission.reportes_inventario = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, reportes_inventario: +e.target.checked });
                                            }}
                                        />
                                    </div>

                                    {/* Pemission current account */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="cuenta_corriente">
                                            Cuenta corriente
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="cuenta_corriente"
                                            checked={permission.cuenta_corriente ? true : false}
                                            onChange={(e) => {
                                                permission.cuenta_corriente = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cuenta_corriente: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-40 ml-4">
                                        {
                                            permission.cuenta_corriente == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_cuenta_corriente.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_cuenta_corriente">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_cuenta_corriente"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosCuentaCorriente({ ...permisosCuentaCorriente, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_cuenta_corriente">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_cuenta_corriente"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosCuentaCorriente({ ...permisosCuentaCorriente, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_cuenta_corriente">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_cuenta_corriente"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosCuentaCorriente({ ...permisosCuentaCorriente, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_cuenta_corriente">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_cuenta_corriente"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosCuentaCorriente({ ...permisosCuentaCorriente, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission receivable */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="cuenta_xcobrar">
                                            Cuenta por cobrar
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="cuenta_xcobrar"
                                            checked={permission.cuenta_xcobrar ? true : false}
                                            onChange={(e) => {
                                                permission.cuenta_xcobrar = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cuenta_xcobrar: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="ml-4 w-56">
                                        {
                                            permission.cuenta_xcobrar == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_cuenta_xcobrar.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="estado_cuenta_xcobrar">
                                                                        Estado cuenta
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="estado_cuenta_xcobrar"
                                                                        checked={permisionCRUD.estado_cuenta ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.estado_cuenta = +e.target.checked;
                                                                            setPermisosCuentaXCobrar({ ...permisosCuentaXCobrar, estado_cuenta: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_cuenta_xcobrar">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_cuenta_xcobrar"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosCuentaXCobrar({ ...permisosCuentaXCobrar, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="cartera_cuenta_xcobrar">
                                                                        Cartera
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="cartera_cuenta_xcobrar"
                                                                        checked={permisionCRUD.cartera ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.cartera = +e.target.checked;
                                                                            setPermisosCuentaXCobrar({ ...permisosCuentaXCobrar, cartera: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                {
                                                                    permisionCRUD.cartera == 1 && (
                                                                        <div className="ml-4 w-full">
                                                                            {
                                                                                permisionCRUD.permisos_cartera.map(permissionsWallet => (
                                                                                    <div
                                                                                        className="flex items-start flex-col"
                                                                                        key={permissionsWallet.key}
                                                                                    >
                                                                                        <div className="border border-gray-400 w-[90%]"></div>

                                                                                        <div className="flex flex-row-reverse items-center gap-x-4">
                                                                                            <label className="text-left text-cyan-600 font-bold" htmlFor="permisos_cartera_pagos">
                                                                                                Pagos
                                                                                            </label>
                                                                                            <input
                                                                                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                                                type="checkbox"
                                                                                                id="permisos_cartera_pagos"
                                                                                                checked={permissionsWallet.pagos ? true : false}
                                                                                                onChange={(e) => {
                                                                                                    permissionsWallet.pagos = +e.target.checked;
                                                                                                    const nuevoPermiso = +e.target.checked;
                                                                                                    const nuevaCartera = [...permisosCuentaXCobrar.permisos_cartera];
                                                                                                    nuevaCartera[0] = {
                                                                                                        ...nuevaCartera[0],
                                                                                                        pagos: nuevoPermiso
                                                                                                    };

                                                                                                    setPermisosCuentaXCobrar({
                                                                                                        ...permisosCuentaXCobrar,
                                                                                                        permisos_cartera: nuevaCartera
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>

                                                                                        <div className="flex flex-row-reverse items-center gap-x-4">
                                                                                            <label className="text-left text-red-500 font-bold" htmlFor="permisos_cartera_anular">
                                                                                                Anular
                                                                                            </label>
                                                                                            <input
                                                                                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-500"
                                                                                                type="checkbox"
                                                                                                id="permisos_cartera_anular"
                                                                                                checked={permissionsWallet.anular ? true : false}
                                                                                                onChange={(e) => {
                                                                                                    permissionsWallet.anular = +e.target.checked;
                                                                                                    const nuevoPermiso = +e.target.checked;
                                                                                                    const nuevaCartera = [...permisosCuentaXCobrar.permisos_cartera];
                                                                                                    nuevaCartera[0] = {
                                                                                                        ...nuevaCartera[0],
                                                                                                        anular: nuevoPermiso
                                                                                                    };

                                                                                                    setPermisosCuentaXCobrar({
                                                                                                        ...permisosCuentaXCobrar,
                                                                                                        permisos_cartera: nuevaCartera
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>

                                                                                        <div className="flex flex-row-reverse items-center gap-x-4">
                                                                                            <label className="text-left text-red-500 font-bold" htmlFor="permisos_cartera_eliminar">
                                                                                                Eliminar
                                                                                            </label>
                                                                                            <input
                                                                                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-500"
                                                                                                type="checkbox"
                                                                                                id="permisos_cartera_eliminar"
                                                                                                checked={permissionsWallet.eliminar ? true : false}
                                                                                                onChange={(e) => {
                                                                                                    permissionsWallet.eliminar = +e.target.checked;
                                                                                                    const nuevoPermiso = +e.target.checked;
                                                                                                    const nuevaCartera = [...permisosCuentaXCobrar.permisos_cartera];
                                                                                                    nuevaCartera[0] = {
                                                                                                        ...nuevaCartera[0],
                                                                                                        eliminar: nuevoPermiso
                                                                                                    };

                                                                                                    setPermisosCuentaXCobrar({
                                                                                                        ...permisosCuentaXCobrar,
                                                                                                        permisos_cartera: nuevaCartera
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>

                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    )
                                                                }

                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission account payable */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="cuenta_xpagar">
                                            Cuenta por pagar
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="cuenta_xpagar"
                                            checked={permission.cuenta_xpagar ? true : false}
                                            onChange={(e) => {
                                                permission.cuenta_xpagar = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cuenta_xpagar: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-56 ml-4">
                                        {
                                            permission.cuenta_xpagar == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_cuenta_xpagar.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="estado_cuenta_xpagar">
                                                                        Estado cuenta
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="estado_cuenta_xpagar"
                                                                        checked={permisionCRUD.estado_cuenta ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.estado_cuenta = +e.target.checked;
                                                                            setPermisosCuentaXPagar({ ...permisosCuentaXPagar, estado_cuenta: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>


                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_cuenta_xpagar">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_cuenta_xpagar"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosCuentaXPagar({ ...permisosCuentaXPagar, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="cartera_cuenta_xpagar">
                                                                        Cartera
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="cartera_cuenta_xpagar"
                                                                        checked={permisionCRUD.cartera ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.cartera = +e.target.checked;
                                                                            setPermisosCuentaXPagar({ ...permisosCuentaXPagar, cartera: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                {
                                                                    permisionCRUD.cartera == 1 && (
                                                                        <div className="ml-4 w-full">
                                                                            {
                                                                                permisionCRUD.permisos_cartera.map(permissionsWallet => (
                                                                                    <div
                                                                                        className="flex items-start flex-col"
                                                                                        key={permissionsWallet.key}
                                                                                    >
                                                                                        <div className="border border-gray-400 w-[90%]"></div>

                                                                                        <div className="flex flex-row-reverse items-center gap-x-4">
                                                                                            <label className="text-left text-cyan-600 font-bold" htmlFor="permisos_cartera_pagos">
                                                                                                Pagos
                                                                                            </label>
                                                                                            <input
                                                                                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                                                type="checkbox"
                                                                                                id="permisos_cartera_pagos"
                                                                                                checked={permissionsWallet.pagos ? true : false}
                                                                                                onChange={(e) => {
                                                                                                    permissionsWallet.pagos = +e.target.checked;
                                                                                                    const nuevoPermiso = +e.target.checked;
                                                                                                    const nuevaCartera = [...permisosCuentaXPagar.permisos_cartera];
                                                                                                    nuevaCartera[0] = {
                                                                                                        ...nuevaCartera[0],
                                                                                                        pagos: nuevoPermiso
                                                                                                    };

                                                                                                    setPermisosCuentaXPagar({
                                                                                                        ...permisosCuentaXPagar,
                                                                                                        permisos_cartera: nuevaCartera
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>

                                                                                        <div className="flex flex-row-reverse items-center gap-x-4">
                                                                                            <label className="text-left text-red-500 font-bold" htmlFor="permisos_cartera_anular">
                                                                                                Anular
                                                                                            </label>
                                                                                            <input
                                                                                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-500"
                                                                                                type="checkbox"
                                                                                                id="permisos_cartera_anular"
                                                                                                checked={permissionsWallet.anular ? true : false}
                                                                                                onChange={(e) => {
                                                                                                    permissionsWallet.anular = +e.target.checked;
                                                                                                    const nuevoPermiso = +e.target.checked;
                                                                                                    const nuevaCartera = [...permisosCuentaXPagar.permisos_cartera];
                                                                                                    nuevaCartera[0] = {
                                                                                                        ...nuevaCartera[0],
                                                                                                        anular: nuevoPermiso
                                                                                                    };

                                                                                                    setPermisosCuentaXPagar({
                                                                                                        ...permisosCuentaXPagar,
                                                                                                        permisos_cartera: nuevaCartera
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>

                                                                                        <div className="flex flex-row-reverse items-center gap-x-4">
                                                                                            <label className="text-left text-red-500 font-bold" htmlFor="permisos_cartera_eliminar">
                                                                                                Eliminar
                                                                                            </label>
                                                                                            <input
                                                                                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-500"
                                                                                                type="checkbox"
                                                                                                id="permisos_cartera_eliminar"
                                                                                                checked={permissionsWallet.eliminar ? true : false}
                                                                                                onChange={(e) => {
                                                                                                    permissionsWallet.eliminar = +e.target.checked;
                                                                                                    const nuevoPermiso = +e.target.checked;
                                                                                                    const nuevaCartera = [...permisosCuentaXPagar.permisos_cartera];
                                                                                                    nuevaCartera[0] = {
                                                                                                        ...nuevaCartera[0],
                                                                                                        eliminar: nuevoPermiso
                                                                                                    };

                                                                                                    setPermisosCuentaXPagar({
                                                                                                        ...permisosCuentaXPagar,
                                                                                                        permisos_cartera: nuevaCartera
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>

                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission accounting */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="contabilidad">
                                            Contabilidad
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="contabilidad"
                                            checked={permission.contabilidad ? true : false}
                                            onChange={(e) => {
                                                permission.contabilidad = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, contabilidad: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.contabilidad == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_contabilidad.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_contabilidad">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_contabilidad"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosContabilidad({ ...permisosContabilidad, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_contabilidad">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_contabilidad"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosContabilidad({ ...permisosContabilidad, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-red-600 font-bold" htmlFor="eliminar_contabilidad">
                                                                        Eliminar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                        type="checkbox"
                                                                        id="eliminar_contabilidad"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.eliminar = +e.target.checked;
                                                                            setPermisosContabilidad({ ...permisosContabilidad, eliminar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-amber-500 font-bold" htmlFor="reporte_contabilidad">
                                                                        Reporte
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                        type="checkbox"
                                                                        id="reporte_contabilidad"
                                                                        checked={permisionCRUD.reporte ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.reporte = +e.target.checked;
                                                                            setPermisosContabilidad({ ...permisosContabilidad, reporte: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Pemission general reports */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="reportes">
                                            Reportes generales
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="reportes"
                                            checked={permission.reportes ? true : false}
                                            onChange={(e) => {
                                                permission.reportes = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, reportes: +e.target.checked });
                                            }}
                                        />
                                    </div>

                                    {/* Pemission company */}
                                    <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                        <label className="text-left text-black font-bold" htmlFor="empresa">
                                            Empresa
                                        </label>
                                        <input
                                            className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                            type="checkbox"
                                            id="empresa"
                                            checked={permission.empresa ? true : false}
                                            onChange={(e) => {
                                                permission.empresa = +e.target.checked;
                                                setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, empresa: +e.target.checked });
                                            }}
                                        />
                                    </div>
                                    <div className="w-36 ml-4">
                                        {
                                            permission.empresa == 1 && (
                                                <div className="bg-slate-50 h-auto border border-gray-300 rounded-b-md w-auto px-4">
                                                    {
                                                        permission.permisos_empresa.map((permisionCRUD) => (
                                                            <div
                                                                className="flex items-start flex-col"
                                                                key={permisionCRUD.key}
                                                            >

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-cyan-600 font-bold" htmlFor="guardar_empresa">
                                                                        Guardar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600"
                                                                        type="checkbox"
                                                                        id="guardar_empresa"
                                                                        checked={permisionCRUD.guardar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.guardar = +e.target.checked;
                                                                            setPermisosEmpresa({ ...permisosEmpresa, guardar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                                    <label className="text-left text-green-600 font-bold" htmlFor="modificar_empresa">
                                                                        Modificar
                                                                    </label>
                                                                    <input
                                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                        type="checkbox"
                                                                        id="modificar_empresa"
                                                                        checked={permisionCRUD.modificar ? true : false}
                                                                        onChange={(e) => {
                                                                            permisionCRUD.modificar = +e.target.checked;
                                                                            setPermisosEmpresa({ ...permisosEmpresa, modificar: +e.target.checked });
                                                                        }}
                                                                    />
                                                                </div>

                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        <button
                            type="submit"
                            className="w-full mt-4 md:w-auto mx-auto border border-gray-500 py-2 px-4 bg-gray-100 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-gray-300 transition-all duration-200"
                            aria-label="Close"
                            onClick={() => {
                                setTimeout(() => {
                                    setOpen(false)
                                }, 100);
                            }}
                        >
                            <Save className="size-5" />
                            Guardar cambios
                        </button>

                    </form>

                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                            onClick={() => {
                                navigate(location.pathname, { replace: true })
                                setOpen(false)
                            }}
                        >
                            <X />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>

        </>
    )
}