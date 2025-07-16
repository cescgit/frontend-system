import * as Accordion from "@radix-ui/react-accordion";
import { ArrowLeftRight, BadgeCheck, Banknote, BetweenHorizonalStart, Bolt, BookOpenText, Building2, Calculator, CalendarCheck2, CalendarRange, ChevronUp, CircleDollarSign, CirclePercentIcon, ClipboardPenLine, Combine, Drill, ExternalLink, FileBarChartIcon, FileChartColumn, FileOutput, HandCoins, Handshake, IterationCcw, List, LucideIcon, MonitorDot, Notebook, NotebookText, Package, PackageOpen, PackagePlus, ReceiptText, Ruler, Scale, ShieldCheck, ShoppingCart, Store, Wallet } from "lucide-react";
import SidebarMenu from "../Sidebar/SidebarMenu";
import "../../index.css"
import { permissionsUser } from "../../types/authData";

export function AccordionSidebar({    
    empresa,
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

    return (
        <>
            <Accordion.Root type="single" collapsible className="w-full max-w-lg">
                {
                    inventario == 1 || marca == 1 || categoria == 1 || producto == 1 || compra == 1 || devolucion_compra == 1 || cotizacion_venta == 1 || prefacturacion == 1 || venta == 1 || devolucion_venta == 1 || kardex == 1 || reportes_inventario == 1
                        ?
                        <AccordionItem icon={Package} value="item-1" label="Inventario">
                            {marca ? <SidebarMenu icon={BadgeCheck} label="Marca" to="/brands" /> : (null)}
                            {categoria ? <SidebarMenu icon={Combine} label="Categoría" to="/categories" /> : (null)}
                            {producto ? <SidebarMenu icon={Drill} label="Producto" to="/products" /> : (null)}
                            {inventario ? <SidebarMenu icon={Package} label="Inventario" to="/inventory" /> : (null)}
                            {remisiones ? <SidebarMenu icon={ExternalLink} label="Remisiones" to="/remissions" /> : (null)}
                            {compra ? <SidebarMenu icon={ShoppingCart} label="Compra" to="/buys" /> : (null)}
                            {devolucion_compra ? <SidebarMenu icon={IterationCcw} label="Devolución compra" to="/purchaseReturn" /> : (null)}
                            {cotizacion_venta ? <SidebarMenu icon={FileOutput} label="Proforma" to="/salesQuote" /> : (null)}
                            {producto_apartado ? <SidebarMenu icon={PackageOpen} label="Apartado producto" to="/separatedProducts" /> : (null)}
                            {prefacturacion ? <SidebarMenu icon={ReceiptText} label="Prefacturación" to="/preInvoicing" /> : (null)}                            
                            {venta ? <SidebarMenu icon={CircleDollarSign} label="Facturación" to="/billing" /> : (null)}
                            {devolucion_venta ? <SidebarMenu icon={IterationCcw} label="Devolución venta" to="/salesReturn" /> : (null)}
                            {kardex ? <SidebarMenu icon={PackagePlus} label="Kardex" to="/kardex" /> : (null)}
                            {reportes_inventario ? <SidebarMenu icon={FileChartColumn} label="Reportes" to="/reportsINventory" /> : (null)}
                        </AccordionItem>
                        :
                        (null)
                }
            </Accordion.Root>

            <Accordion.Root type="single" collapsible className="w-full max-w-lg">

                {
                    cuenta_corriente ?
                        <AccordionItem icon={Building2} value="item-2" label="Cuenta corriente">
                            <SidebarMenu icon={Wallet} label="Chequera" to="/wallet" />
                            <SidebarMenu icon={ArrowLeftRight} label="Depositos - Retiros" to="/depositsWithDrawals" />
                            <SidebarMenu icon={MonitorDot} label="Consulta" to="/query" />
                            <SidebarMenu icon={Banknote} label="Cheque cobrados" to="/inventory" />
                            <SidebarMenu icon={FileChartColumn} label="Reportes" to="/resports/currentAccount" />
                        </AccordionItem>
                        :
                        (null)
                }
            </Accordion.Root>

            <Accordion.Root type="single" collapsible className="w-full max-w-lg">
                {
                    cuenta_xcobrar ?
                        <AccordionItem icon={Handshake} value="item-3" label="Cuenta por cobrar">
                            <SidebarMenu icon={Scale} label="Balance cliente" to="/customerBalance" />                            
                            <SidebarMenu icon={FileChartColumn} label="Reportes" to="/resports/accountPayable/customers" />
                        </AccordionItem>
                        :
                        (null)
                }
            </Accordion.Root>

            <Accordion.Root type="single" collapsible className="w-full max-w-lg">

                {
                    cuenta_xpagar ?
                        <AccordionItem icon={HandCoins} value="item-4" label="Cuenta por pagar">
                            <SidebarMenu icon={Scale} label="Balance Proveedor" to="/supplierBalance" />                            
                            <SidebarMenu icon={FileChartColumn} label="Reportes" to="/resports/accountPayable/suppliers" />
                        </AccordionItem>
                        :
                        (null)
                }
            </Accordion.Root>

            <Accordion.Root type="single" collapsible className="w-full max-w-lg">
                {
                    contabilidad ?
                        <AccordionItem icon={Calculator} value="item-5" label="Contabilidad">
                            <SidebarMenu icon={ClipboardPenLine} label="Plan de cuenta" to="/accountingAccount" />
                            <SidebarMenu icon={CalendarRange} label="Cierre del periodo" to="/closingPeriod" />
                            <SidebarMenu icon={CalendarCheck2} label="Diario géneral" to="/generalDiary" />
                            <SidebarMenu icon={NotebookText} label="Libro mayor" to="/ledger" />
                            <SidebarMenu icon={BookOpenText} label="Libros auxiliares" to="/auxiliaryBooks" />
                            <Accordion.Root type="single" collapsible className="w-full max-w-lg">
                                {
                                    contabilidad ?
                                        <AccordionItem icon={List} value="item-4" label="Opcion es contabilidad">
                                            <SidebarMenu icon={BookOpenText} label="Registro libro auxiliar" to="/auxiliaryBooksdgerRegister" />
                                            <SidebarMenu icon={ShieldCheck} label="Fuentes contables" to="/accountingSources" />
                                            <SidebarMenu icon={Notebook} label="Definir cuentas cierre" to="/closingAccounts" />
                                        </AccordionItem>
                                        :
                                        (null)
                                }
                            </Accordion.Root>
                            <SidebarMenu icon={FileChartColumn} label="Reportes" to="/resports/accountPayable/customers" />
                        </AccordionItem>
                        :
                        (null)
                }
            </Accordion.Root>

            <Accordion.Root type="single" collapsible className="w-full max-w-lg">

                {
                    reportes ?
                        <AccordionItem icon={FileBarChartIcon} value="item-6" label="Reportes génerales">
                            <SidebarMenu icon={ClipboardPenLine} label="Plan de cuenta" to="/chartAccounts" />
                            <SidebarMenu icon={CalendarRange} label="Cierre del periodo" to="/closingPeriod" />
                            <SidebarMenu icon={CalendarCheck2} label="Diario géneral" to="/generalDiary" />
                            <SidebarMenu icon={NotebookText} label="Libro mayor" to="/ledger" />
                            <SidebarMenu icon={BookOpenText} label="Libros auxiliares" to="/leauxiliaryBooksdger" />
                            <SidebarMenu icon={FileChartColumn} label="Reportes" to="/resports/accountPayable/customers" />
                        </AccordionItem>
                        :
                        (null)
                }
            </Accordion.Root>

            <Accordion.Root type="single" collapsible className="w-full max-w-lg">
                {
                    empresa ?
                        <AccordionItem icon={Bolt} value="item-7" label="Configuración">
                            <SidebarMenu icon={Store} label="Empresa" to="/company" />
                            <SidebarMenu icon={CirclePercentIcon} label="Impuesto" to="/taxes" />
                            <SidebarMenu icon={Ruler} label="Unidad de medida" to="/unitOfMeasurements" />
                            <SidebarMenu icon={Scale} label="Peso por producto" to="/weight" />
                            <SidebarMenu icon={BetweenHorizonalStart} label="Tipo de cuenta" to="/typeAccount" />
                        </AccordionItem>
                        :
                        (null)
                }
            </Accordion.Root>
        </>
    )
}

const AccordionItem = ({ icon: Icon, value, label, children }: { icon: LucideIcon, value: string; label: string; children: React.ReactNode }) => (
    <Accordion.Item value={value} className="border-b border-gray-300">
        <Accordion.Header className="w-full">
            <Accordion.Trigger className="group w-full flex justify-between items-center text-left hover:bg-gray-100 p-2">
                <div className="flex justify-center items-center gap-x-3">
                    <Icon className="size-5" />
                    {label}
                </div>
                <ChevronUp className="w-5 h-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="px-4 py-2 bg-gray-50">
            {children}
        </Accordion.Content>
    </Accordion.Item>
);

