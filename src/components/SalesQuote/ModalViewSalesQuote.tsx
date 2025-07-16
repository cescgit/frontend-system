import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "../../utils/utils";
import { Table } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import { stateValue } from "../../locales/valueState";
import { TempPurchasingFormData } from "../../types/buysData";
import { getCustomers } from "../../apis/CustomerAPI";
import { CustomerFormDataInfo, DataItemCustomer } from "../../types/customerData";
import { SalesQuoteFormDataInfo } from "../../types/salesQuoteData";
import { getDetailsSalesQuoteById } from "../../apis/SalesQuoteAPI";

export default function ModalViewSalesQuote({ salesQuote }: { salesQuote: SalesQuoteFormDataInfo }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const salesQuoteId = queryParams.get("viewSalesQuote")!
    const id = salesQuoteId;

    const [dataProducts, setDataProducts] = useState<TempPurchasingFormData[]>(sessionStorage.getItem("tempProductsView") ? JSON.parse(sessionStorage.getItem("tempProductsView")!) : [])
    const [customerIdValue, setcustomerIdValue] = useState<CustomerFormDataInfo | null>(null)
    const [customerInput, setCustomerInput] = useState("");
    // * categories
    const [customerName, setCustomerName] = useState<DataItemCustomer[]>([])

    const { isError, data } = useQuery({
        queryKey: ["salesQuote", salesQuoteId],
        queryFn: () => getDetailsSalesQuoteById({ id }),
        enabled: !!salesQuoteId,
        retry: false
    })    

    useEffect(() => {
        if (data) {
            sessionStorage.setItem("tempProductsView", JSON.stringify(data));
            const storedProducts = sessionStorage.getItem("tempProductsView");
            if (storedProducts) {
                setDataProducts(JSON.parse(storedProducts));
            }
        }
    }, [data])


    const { data: dataCustomer } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    })

    useEffect(() => {

        if (dataCustomer) {

            dataCustomer?.map(customerData => {
                if (customerData.id === salesQuote.id_cliente) {
                    const result = customerData;
                    setcustomerIdValue(result)
                }
            });
        }

    }, [salesQuote.id_cliente, dataCustomer, customerIdValue])

    useEffect(() => {

        // * Weight
        if (dataCustomer === undefined) return;
        const getValueCustomer = dataCustomer?.map((customer) => customer.id)
        const labelCustomer = dataCustomer?.map((customer) => customer.nombre_cliente)
        const getDataCustomer = getValueCustomer!.map((value, index) => ({
            value,
            label: labelCustomer![index]
        }));
        setCustomerName(getDataCustomer);
    }, [dataCustomer])

    useEffect(() => {
        const currentLabel = customerName.find(item => item.value === salesQuote.id_cliente)?.label || "";
        setCustomerInput(currentLabel);
    }, [salesQuote.id_cliente, customerName]);


    const [searchTerm, setSearchTerm] = useState("")

    const filteredDataProducts = dataProducts?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    if (isError) return <Navigate to={"/404"} />

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/65 data-[state=open]:animate-overlayShow" />
                <Dialog.Content
                    onPointerDownOutside={(event) => event.preventDefault()}
                    onInteractOutside={(event) => event.preventDefault()}
                    className="fixed left-1/2 top-1/2 h-[98%] w-full sm:w-[96%] sm:mx-auto px-2 py-4 md:p-6 scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Vista de proforma <span className="text-red-500">{salesQuote.numero_cotizacion}</span>
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Datos de la proforma {salesQuote.numero_cotizacion} el día {formatDate(salesQuote.fecha_creacion)}...
                    </Dialog.Description>

                    <div className="border border-gray-600 rounded-md h-80 sm:mx-auto scrollbar-thin-custom touch-pan-y scroll-smooth w-[88%] md:w-full px-1 sm:p-4 overflow-scroll">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-x-4">

                            <div className="flex flex-1 w-full flex-col">
                                <div className="flex flex-col md:flex-row w-full items-center gap-x-4">
                                    <div className="w-full block">
                                        <label htmlFor="termino" className="font-bold w-full">Termino:</label>
                                        <input
                                            className="w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed"
                                            id="termino"
                                            value={salesQuote.termino}
                                            disabled
                                            type="text"
                                            placeholder="Ejemplo: xxxxx..."
                                        />
                                    </div>

                                    <div className="flex w-full items-start gap-y-1 md:gap-x-2 flex-col">
                                        <div className="w-full block">
                                            <label className="font-bold w-full" htmlFor="estado">Estado:</label>
                                            <select
                                                defaultValue={salesQuote.estado}
                                                disabled
                                                name=""
                                                id="estado"
                                                className="w-full border border-gray-300 hover:border-gray-500 py-1 px-2 outline-none rounded-md cursor-not-allowed">
                                                {
                                                    stateValue.map(item => (
                                                        <option className="py-0 px-4 bg-slate-50"
                                                            key={item.value}
                                                            value={item.value}
                                                        >
                                                            {
                                                                item.label
                                                            }
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full flex-col md:flex-row items-center gap-x-4 mt-2">
                                    <div className="w-full block">
                                        <label htmlFor="observaciones" className="font-bold w-full">Observaciones:</label>
                                        <textarea
                                            className="w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed"
                                            id="observaciones"
                                            value={salesQuote.observaciones}
                                            placeholder="Ejemplo: xxxxx..."
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-1 w-full items-center justify-center">
                                <div className="flex flex-col w-full items-center justify-center mt-4 border border-gray-400 rounded-lg px-1 py-2 sm:p-4">
                                    <h2 className="font-bold text-lg">Selección del cliente</h2>
                                    <div className="w-full flex flex-col items-center justify-center gap-x-2">
                                        <label className="w-full font-bold" htmlFor="categorySearch">Cliente:</label>
                                        <div className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 flex items-center justify-center w-full">
                                            <input
                                                id="customerSearch"
                                                type="text"
                                                name="searchCustomers"
                                                list="listCsustomer"
                                                placeholder="Buscar cliente..."
                                                className="outline-none w-full cursor-not-allowed"
                                                value={customerInput}
                                                disabled
                                            />
                                            <datalist id="listCsustomer">
                                                {
                                                    customerName.map(item => (
                                                        <option
                                                            key={item.value}
                                                            value={item.label}
                                                        />
                                                    ))
                                                }
                                            </datalist>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start w-full justify-center gap-x-4">

                            <div className="flex flex-col flex-1 w-full items-center mt-4 border border-gray-400 px-1 py-2 sm:p-4 rounded-lg">
                                <h2 className="font-bold text-sm md:text-lg py-2">Selecciona la fecha de finalización de la cotización</h2>
                                <div className="w-full border border-gray-400 rounded-lg py-1 px-2 flex flex-col md:flex-row gap-y-2 items-center justify-center gap-x-1">
                                    <div className="flex items-center justify-center gap-x-2">
                                        <label htmlFor="datePickEnd">Hasta:</label>
                                        <input
                                            className="border-gray-400 border outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md cursor-not-allowed"
                                            id="datePickEnd"
                                            type="text"
                                            value={formatDate(salesQuote.fecha_finalizacion)}
                                            disabled
                                        />
                                    </div>

                                    <div className="flex items-center justify-center md:space-x-1">
                                        <input
                                            type="text"
                                            value={salesQuote.dias}
                                            disabled
                                            className="w-10 text-center cursor-not-allowed border border-gray-300 hover:border-gray-400 rounded-md" />
                                        <span>días</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-center gap-x-1 lg:w-[74%] mt-2 border border-gray-300 hover:border-gray-400 py-1 px-2 outline-none'>
                        <label htmlFor="searchDataTable"><Search className="size-4" /></label>
                        <input
                            id="searchDataTable"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-0 rounded-none outline-none"
                        />
                    </div>

                    <div className="h-96 w-[85%] lg:w-full flex-col lg:flex-row flex md:gap-x-4 gap-y-4 items-start justify-center top-0">
                        <div className="w-full h-full lg:w-[75%] scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll top-0">
                            <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                                <Table.Header className="top-0 sticky bg-white">
                                    <Table.Row align="center">
                                        <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Cantidad</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>P. Unitario</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Subtotal</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        filteredDataProducts?.map(product => (
                                            <Table.Row key={product.id_producto} className="hover:bg-gray-100/85 transition-all duration-200">

                                                <Table.Cell>
                                                    {
                                                        product.nombre_producto
                                                    }
                                                </Table.Cell>

                                                <Table.Cell>
                                                    {
                                                        product.cantidad
                                                    }
                                                </Table.Cell>

                                                <Table.Cell>
                                                    {
                                                        product.precio_venta === undefined ? 0 : formatCurrency(product.precio_venta)
                                                    }
                                                </Table.Cell>

                                                <Table.Cell>
                                                    {
                                                        formatCurrency(product.subtotal)
                                                    }
                                                </Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                                    <Table.Row>
                                        {
                                            filteredDataProducts?.length === 0 && (
                                                <Table.Cell colSpan={14}>
                                                    <div className="flex items-center flex-col justify-center">
                                                        <NotFoundEmpty />
                                                        <p className='text-center font-bold text-2xl'>Aún no hay registros agregados...</p>
                                                    </div>
                                                </Table.Cell>
                                            )
                                        }
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                        </div>

                        <div className="w-full lg:w-[25%] flex items-end gap-y-2 flex-col mt-2 border border-gray-500 rounded-lg py-4 px-2 h-96 scrollbar-thin-custom touch-pan-y scroll-smooth overflow-scroll">

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="total_productos" className="font-bold text-gray-600 w-full">Total productos:</label>
                                <input
                                    id="total_productos"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                    value={dataProducts.length}
                                    type="text"
                                    disabled
                                    placeholder="Total de productos..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="subtotal_proforma" className="font-bold text-gray-600 w-full">Subtotal de compra:</label>
                                <input
                                    id="subtotal_proforma"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 text-green-800 cursor-not-allowed"
                                    value={formatCurrency(salesQuote.subtotal)}
                                    type="text"
                                    disabled
                                    placeholder="Subtotal de compra..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="value_tax" className="font-bold text-start text-gray-600 w-full">IVA:</label>
                                <input
                                    id="value_tax"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                    value={formatCurrency(salesQuote.impuesto_manual![0].valor_cantidad.toString())}
                                    type="text"
                                    disabled
                                    placeholder="Impuesto..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="impuesto" className="font-bold text-start text-gray-600 w-full">% del impuesto:</label>
                                <input
                                    id="impuesto"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                    value={salesQuote.impuesto_manual![0].valor_porcentaje}
                                    disabled
                                    type="text"
                                    placeholder="Impuesto..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="total_proforma" className="font-bold text-gray-600 w-full ">Total de compra:</label>
                                <input
                                    id="total_proforma"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 text-green-800 cursor-not-allowed"
                                    value={formatCurrency(salesQuote.total)}
                                    type="text"
                                    disabled
                                    placeholder="Total de proforma..." />
                            </div>
                        </div>
                    </div>

                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                            onClick={() => {
                                navigate(location.pathname, { replace: true })
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