import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import SideBar from "../components/Sidebar/SideBar";
import { SidebarUser } from "../components/Sidebar/SideBarUser";

export function AppLayout() {
  const location = useLocation();
  const { dataAuth, isError, isLoadingAuth } = useAuth();

  const [getPathname, setgetPathname] = useState("")

  useEffect(() => {
    setgetPathname(location.pathname);
  }, [location.pathname])

  if (isError) {
    return <Navigate to="/auth/login" />
  }

  if (dataAuth)
    return (
      <>
        <div className="h-96 w-full mx-auto bg-white">
          {isLoadingAuth ? (
            <div className="flex items-center md:my-40 my-16 justify-center">
              <Loader />
            </div>
          ) : (

            <>
              <div className="flex flex-col lg:flex-row h-lvh items-center justify-center">
                <div className="w-full lg:w-[18%]">
                  <SideBar
                    empresa={dataAuth?.empresa}
                    usuario={dataAuth.usuario}
                    proveedor={dataAuth?.proveedor}
                    cliente={dataAuth?.cliente}
                    marca={dataAuth?.marca}
                    categoria={dataAuth?.categoria}
                    producto={dataAuth?.producto}
                    inventario={dataAuth?.inventario}
                    remisiones={dataAuth?.remisiones}
                    compra={dataAuth?.compra}
                    devolucion_compra={dataAuth?.devolucion_compra}
                    cotizacion_venta={dataAuth?.cotizacion_venta}
                    producto_apartado={dataAuth?.producto_apartado}
                    prefacturacion={dataAuth?.prefacturacion}
                    venta={dataAuth?.venta}
                    devolucion_venta={dataAuth?.devolucion_venta}
                    kardex={dataAuth?.kardex}
                    reportes_inventario={dataAuth?.reportes_inventario}
                    cuenta_corriente={dataAuth?.cuenta_corriente}
                    cuenta_xcobrar={dataAuth?.cuenta_xcobrar}
                    cuenta_xpagar={dataAuth?.cuenta_xpagar}
                    contabilidad={dataAuth?.contabilidad}
                    reportes={dataAuth?.reportes}
                  />
                </div>
                <div className="flex w-full lg:w-[82%] h-lvh items-center justify-center flex-col">
                  <div className="h-[10%] w-full mt-4 flex items-center justify-between px-12 md:px-8">
                    <div className="flex flex-1 items-start gap-x-2">
                      <Link to="/">Inicio</Link>
                      {
                        getPathname != "/" && <div className="border border-r border-gray-200 h-5"></div>
                      }
                      <h2>
                        {
                          getPathname == "/users" && "Usuario" ||
                          getPathname == "/suppliers" && "Proveedores" ||
                          getPathname == "/customers" && "Clientes" ||
                          getPathname == "/brands" && "Marcas" ||
                          getPathname == "/categories" && "Categorías" ||
                          getPathname == "/products" && "Productos" ||
                          getPathname == "/inventory" && "Inventario" ||
                          getPathname == "/remissions" && "Remisiones" ||
                          getPathname == "/buys" && "Compras" ||
                          getPathname == "/purchaseReturn" && "Devolución de Compras" ||
                          getPathname == "/salesQuote" && "Proforma" ||
                          getPathname == "/separatedProducts" && "Apartado de producto" ||
                          getPathname == "/preInvoicing" && "Prefacturación" ||
                          getPathname == "/billing" && "Facturación" ||
                          getPathname == "/salesReturn" && "Devolución de Ventas" ||
                          getPathname == "/kardex" && "Kardex" ||
                          getPathname == "/reportsInventory" && "Reportes" ||
                          getPathname == "/wallet" && "Chequera" ||
                          getPathname == "/depositsWithDrawals" && "Depositos-Retiros" ||
                          getPathname == "/query" && "Consulta" ||
                          getPathname == "/cashedChecks" && "Cheques Cobrados" ||
                          getPathname == "/reportsCurrentAccount" && "Reportes" ||
                          getPathname == "/supplierBalance" && "Balance del Proveedor" ||                          
                          getPathname == "/reportsAccountsPayable" && "Reportes" ||
                          getPathname == "/customerBalance" && "Balance del Cliente" ||                          
                          getPathname == "/reportsAccountsReceivable" && "Reportes" ||
                          getPathname == "/chartOfAccounts" && "Plan de cuentas" ||
                          getPathname == "/closingPeriod" && "Cierre del Periodo" ||
                          getPathname == "/generalDiary" && "Diario Géneral" ||
                          getPathname == "/ledger" && "Libro Mayor" ||
                          getPathname == "/auxiliaryBooksdger" && "Libros Auxiliares" ||
                          getPathname == "/reportAccounting" && "Reportes" ||
                          getPathname == "/company" && "Empresa" ||
                          getPathname == "/taxes" && "Impuestos" ||
                          getPathname == "/unitOfMeasurements" && "Unidad de Medida" ||
                          getPathname == "/weight" && "Peso del Producto" ||
                          getPathname == "/accountingAccount" && "Plan de cuentas" ||
                          getPathname == "/typeAccount" && "Tipo de cuenta" ||
                          getPathname == "/auxiliaryBooksdgerRegister" && "Libros auxiliares" ||
                          getPathname == "/accountingSources" && "Fuente contable"
                        }
                      </h2>
                    </div>
                    <div className="flex-1 flex items-end justify-end">
                      <SidebarUser
                        nombre_usuario={dataAuth.nombre_usuario}
                        corrreo_usuario={dataAuth.correo_usuario}
                        tipo_usuario={dataAuth.tipo_usuario}
                      />
                    </div>
                  </div>

                  <main className="h-[90%] w-full flex items-center justify-center">
                    <Outlet />                    
                  </main>
                </div>
              </div>
            </>
          )
          }
        </div>
      </>
    );
}
