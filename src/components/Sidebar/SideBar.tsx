import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import SidebarNav from "./SidebarNav";
import { permissionsUser } from "../../types/authData";


export default function SideBar({    
    usuario,
    empresa,
    proveedor,
    cliente,
    inventario,
    remisiones,
    marca,
    categoria,
    producto,
    compra,
    devolucion_compra,
    cotizacion_venta,
    producto_apartado,
    prefacturacion,
    venta,
    devolucion_venta,
    kardex,
    reportes_inventario,
    cuenta_corriente,
    cuenta_xcobrar,
    cuenta_xpagar,
    contabilidad,
    reportes,
}: permissionsUser) {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full">
            {/* Botón para abrir el Sidebar en móviles */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger className="bg-white py-2 text-black rounded-lg">
                        <Menu className="size-5" />
                    </Dialog.Trigger>

                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.DialogTitle></Dialog.DialogTitle>
                        <Dialog.Content 
                            className="fixed overflow-y-auto touch-pan-y top-0 left-0 w-72 h-screen bg-white text-black"                            
                        >
                            <button onClick={() => setOpen(false)} className="absolute top-4 right-4">
                                <X className="size-5" />
                            </button>
                            <SidebarNav                                
                                empresa={empresa}
                                usuario={usuario}
                                proveedor={proveedor}
                                cliente={cliente}
                                marca={marca}
                                categoria={categoria}
                                producto={producto}
                                inventario={inventario}
                                remisiones={remisiones}
                                compra={compra}
                                devolucion_compra={devolucion_compra}
                                cotizacion_venta={cotizacion_venta}
                                producto_apartado={producto_apartado}
                                prefacturacion={prefacturacion}
                                venta={venta}
                                devolucion_venta={devolucion_venta}
                                kardex={kardex}
                                reportes_inventario={reportes_inventario}
                                cuenta_corriente={cuenta_corriente}
                                cuenta_xcobrar={cuenta_xcobrar}
                                cuenta_xpagar={cuenta_xpagar}
                                contabilidad={contabilidad}
                                reportes={reportes} />
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>

            <div className="hidden lg:flex scrollbar-thin-custom overflow-y-auto touch-pan-y flex-col border border-r border-gray-300 w-full h-screen bg-white text-black">
                <SidebarNav                    
                    empresa={empresa}
                    usuario={usuario}
                    proveedor={proveedor}
                    cliente={cliente}
                    marca={marca}
                    categoria={categoria}
                    producto={producto}
                    inventario={inventario}
                    remisiones={remisiones}
                    compra={compra}
                    devolucion_compra={devolucion_compra}
                    cotizacion_venta={cotizacion_venta}
                    producto_apartado={producto_apartado}
                    prefacturacion={prefacturacion}
                    venta={venta}
                    devolucion_venta={devolucion_venta}
                    kardex={kardex}
                    reportes_inventario={reportes_inventario}
                    cuenta_corriente={cuenta_corriente}
                    cuenta_xcobrar={cuenta_xcobrar}
                    cuenta_xpagar={cuenta_xpagar}
                    contabilidad={contabilidad}
                    reportes={reportes}
                />
            </div>
        </div>
    )
}