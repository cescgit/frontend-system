import { Home, Users, Truck, UserCheck } from "lucide-react";
import SidebarMenu from "./SidebarMenu";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getDataInitial } from "../../api/QuerysAPI";
import { Navigate } from "react-router-dom";
import { permissionsUser } from "../../types/authData";
import { AccordionSidebar } from "../UI/Acordion";

export default function SidebarNav({    
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
    const { dataAuth, isError } = useAuth();

    const { data } = useQuery({
        queryKey: ["/"],
        queryFn: getDataInitial,
    })

    if (isError) {
        return <Navigate to="/auth/login" />;
    }

    if (dataAuth) return (
        <nav className="flex flex-col">
            <div className="top-0 sticky bg-white">
                {
                    (data ?? []).length > 0 ? (

                        data?.map(info => (
                            <div
                                key={info.logotipo}
                                className="flex items-center justify-center mb-4 border-b border-gray-600 py-4"
                            >
                                <img src={info.logotipo} alt="logo" className="size-40 object-contain" />
                            </div>
                        ))

                    )
                        :
                        (
                            <div
                                className="flex items-center justify-center top-0 sticky bg-slate-200 mb-4 border-b border-gray-600 py-4"
                            >
                                <img src="https://i.ibb.co/cb71m98/your-logo-here.webp" alt="logo" className="size-40 object-contain" />
                            </div>
                        )
                }
            </div>
            <SidebarMenu icon={Home} label="Inicio" to="/" />
            { usuario ? <SidebarMenu icon={Users} label="Usuario" to="/users" /> : (null)}
            { proveedor ? <SidebarMenu icon={Truck} label="Proveedor" to="/suppliers" /> : (null)}
            { cliente ? <SidebarMenu icon={UserCheck} label="Cliente" to="/customers" /> : (null)}
            <AccordionSidebar 
                empresa={empresa}
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
                usuario={usuario}
                proveedor={proveedor}
                cliente={cliente}
                contabilidad={contabilidad}
                reportes={reportes}
            />
        </nav>
    )
}