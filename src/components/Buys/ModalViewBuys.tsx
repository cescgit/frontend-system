import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { getDetailsBuysById } from "../../apis/BuysAPI";
import { BuysFormDataInfo, TempPurchasingFormDataDetails } from "../../types/buysData";
import { formatCurrency, formatDate } from "../../utils/utils";
import { Table } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import { SupplierFormDataInfo } from "../../types/supplierData";
import { getSupplier } from "../../apis/SupplierAPI";


export default function ModalViewBuys({ buys }: { buys: BuysFormDataInfo }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const buysId = queryParams.get("viewBuys")!
    const id = buysId;

    const [dataProducts, setDataProducts] = useState<TempPurchasingFormDataDetails[]>(sessionStorage.getItem("tempProductsView") ? JSON.parse(sessionStorage.getItem("tempProductsView")!) : [])
    const [supplierIdValue, setSupplierIdValue] = useState<SupplierFormDataInfo | null>(null)

    const { isError, data } = useQuery({
        queryKey: ["buys", buysId],
        queryFn: () => getDetailsBuysById({ id }),
        enabled: !!buysId,
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


    const { data: dataSupplier } = useQuery({
        queryKey: ["suppliers"],
        queryFn: getSupplier,
    })

    useEffect(() => {

        if (dataSupplier) {

            dataSupplier?.map(suppliersData => {
                if (suppliersData.id === buys.id_proveedor) {
                    const result = suppliersData;
                    setSupplierIdValue(result)
                }
            });
        }

    }, [buys.id_proveedor, dataSupplier, supplierIdValue])


    const [searchTerm, setSearchTerm] = useState("")

    const filtereddataProducts = dataProducts?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    if (isError) return <Navigate to={"/404"} />

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                <Dialog.Content className={`fixed left-1/2 top-1/2 h-[98%] w-full sm:w-[96%] sm:mx-auto px-2 py-4 md:p-6 touch-pan-x touch-pan-y scroll-smooth overflow-scroll -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Vista de compra <span className="text-red-500">{buys.numero_compra}</span>
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Datos de la compra {buys.numero_compra} el día {formatDate(buys.fecha_creacion)}...
                    </Dialog.Description>

                    <div className="border border-gray-600 rounded-md h-auto mx-auto touch-pan-y scroll-smooth w-full px-1 sm:p-4">
                        <div className="flex flex-col md:flex-row items-start justify-start gap-x-4">

                            <div className="flex h-full w-full flex-col items-center">

                                <div className="w-full">
                                    <label htmlFor="numero_factura_proveedor" className="font-bold">Número Factura Proveedor:</label>
                                    <input
                                        id="numero_factura_proveedor"
                                        className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                        defaultValue={buys.numero_factura_proveedor}
                                        disabled
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-1 w-full items-center justify-center">
                                    <div className="w-full">
                                        <label htmlFor="observaciones" className="font-bold">Observaciones:</label>
                                        <textarea
                                            id="observaciones"
                                            className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                            defaultValue={buys.observaciones}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-1 w-full items-center justify-center">
                                    <div className="w-full">
                                        <label htmlFor="termino" className="font-bold">Termino:</label>
                                        <input
                                            id="termino"
                                            className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                            defaultValue={buys.termino}
                                            disabled
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="flex flex-1 w-full items-center justify-center mt-4 border border-gray-400 rounded-lg px-1 py-2 sm:p-4">
                                    <div className="w-full flex items-center justify-center flex-col">
                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label htmlFor="nombre_proveedor" className="font-bold mb-1">Proveedor:</label>
                                            <input
                                                className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                                id="nombre_proveedor"
                                                defaultValue={supplierIdValue == undefined || supplierIdValue == null ? "" : supplierIdValue!.nombre_proveedor}
                                                type="text"
                                                disabled
                                            />
                                        </div>

                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label htmlFor="ruc" className="font-bold mb-1">RUC:</label>
                                            <input
                                                className="w-full border border-gray-400 hover:border-gray-600  outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                                id="ruc"
                                                defaultValue={supplierIdValue == undefined || supplierIdValue == null ? "" : supplierIdValue!.ruc}
                                                type="text"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='w-full lg:w-[74%] mx-auto md:mx-0 mt-4 flex items-center justify-center gap-x-1 border border-gray-400 hover:border-gray-600 py-1 px-2'>
                        <Search className="size-5" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full outline-none"
                        />
                    </div>

                    <div className="h-auto w-full lg:w-full flex-col lg:flex-row flex md:gap-x-4 gap-y-4 items-start justify-center mx-auto">
                        <div className="w-full sm:w-full lg:w-[75%] h-96 touch-pan-x touch-pan-y scroll-smooth">

                            <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x w-full">
                                <Table.Header className="top-0 sticky bg-white">
                                    <Table.Row align="center">
                                        <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Cantidad</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>P. Unitario</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="text-center md:text-start">Subtotal</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        filtereddataProducts?.map(product => (
                                            <Table.Row key={product.id_producto} className="hover:bg-gray-100/85 transition-all duration-200 p-2">

                                                <Table.Cell className="text-start">
                                                    {
                                                        product.nombre_producto
                                                    }
                                                </Table.Cell>

                                                <Table.Cell className="text-center">
                                                    {
                                                        product.cantidad
                                                    }
                                                </Table.Cell>

                                                <Table.Cell className="text-start md:text-start">
                                                    {
                                                        product.precio_compra === undefined ? 0 : formatCurrency(product.precio_compra)
                                                    }
                                                </Table.Cell>

                                                <Table.Cell className="text-center md:text-start">
                                                    {
                                                        formatCurrency(product.subtotal)
                                                    }
                                                </Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                                    <Table.Row>
                                        {
                                            filtereddataProducts?.length === 0 && (
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

                        <div className="w-full lg:w-[25%] flex items-end gap-y-2 flex-col mt-2 border border-gray-500 rounded-lg py-4 px-2 h-auto touch-pan-y scroll-smooth">

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
                                <label htmlFor="subtotal_compra" className="font-bold text-gray-600 w-full">Subtotal de compra:</label>
                                <input
                                    id="subtotal_compra"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 text-green-800 cursor-not-allowed"
                                    value={formatCurrency(buys.subtotal)}
                                    type="text"
                                    disabled
                                    placeholder="Subtotal de compra..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="value_tax" className="font-bold text-start text-gray-600 w-full">IVA:</label>
                                <input
                                    id="value_tax"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                    value={formatCurrency(buys.impuesto_manual![0].valor_cantidad.toString())}
                                    type="text"
                                    disabled
                                    placeholder="Impuesto..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="impuesto" className="font-bold text-start text-gray-600 w-full">% del impuesto:</label>
                                <input
                                    id="impuesto"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                    value={buys.impuesto_manual![0].porcentaje}
                                    disabled
                                    type="text"
                                    placeholder="Impuesto..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="total_compra" className="font-bold text-gray-600 w-full ">Total de compra:</label>
                                <input
                                    id="total_compra"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 text-green-800 cursor-not-allowed"
                                    value={formatCurrency(buys.total)}
                                    type="text"
                                    disabled
                                    placeholder="Total de compra..." />
                            </div>
                        </div>
                    </div>

                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                            onClick={() => navigate(location.pathname, { replace: true })}
                        >
                            <X />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </>
    )
}