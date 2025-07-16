import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { Table } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import { formatCurrency, formatDate } from "../../utils/utils";
import { getCustomerBalanceByIdCustomer } from "../../api/CustomerBalanceAPI";
import { getCustomers } from "../../api/CustomerAPI";
import { CustomerFormDataInfo } from "../../types/customerData";


export default function StatementOfAccountCustomerBalance({ nameCustomer }: { nameCustomer: string }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get("customerStatementOfAccount")!;

    const [totalDebit, setTotalDebit] = useState(0)
    const [totalCredit, setTotalCredit] = useState(0)
    const [totalBalance, setTotalBalance] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [customerIdValue, setCustomerIdValue] = useState<CustomerFormDataInfo | null>(null)

    const { isError, data } = useQuery({
        queryKey: ["customerBalance", id],
        queryFn: () => getCustomerBalanceByIdCustomer({ id }),
        enabled: !!id,
        retry: false
    })

    const { isError: isErrorCustomers, data: dataCustomer } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    })

    useEffect(() => {
        if (dataCustomer != undefined && data != undefined) {
            dataCustomer?.map(suppliersData => {
                if (suppliersData.id === data![0].id_cliente) {
                    const result = suppliersData;
                    setCustomerIdValue(result)
                }
            });
        }

    }, [id, dataCustomer, customerIdValue, data])

    const filteredDataCustomerBalance = data?.filter(supplierBalance =>
        Object.values(supplierBalance).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )


    useEffect(() => {
        if (filteredDataCustomerBalance) {
            const totalDebito = filteredDataCustomerBalance.reduce((acc, item) => acc + Number(item.debito), 0);
            setTotalDebit(totalDebito);

            const totalCredito = filteredDataCustomerBalance.reduce((acc, item) => acc + Number(item.credito), 0);
            setTotalCredit(totalCredito);

            const ultimoObjeto = filteredDataCustomerBalance[filteredDataCustomerBalance.length - 1];
            const balance = ultimoObjeto.balance;

            setTotalBalance(+balance)
        }
    }, [filteredDataCustomerBalance])

    if (isError) return <Navigate to={"/404"} />
    if (isErrorCustomers) return <Navigate to={"/404"} />

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/65 data-[state=open]:animate-overlayShow" />
                <Dialog.Content
                    onPointerDownOutside={(event) => event.preventDefault()}
                    onInteractOutside={(event) => event.preventDefault()}
                    className="fixed left-1/2 top-1/2 h-[90%] w-full sm:w-[90%] sm:mx-auto px-2 py-4 md:p-6 touch-pan-x touch-pan-y scroll-smooth -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="text-gray-500 text-2xl text-center">
                        Estado de cuenta del cliente: <span className="text-gray-800 font-bold">{nameCustomer}</span>
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-gray-600 text-center">
                        Movimiento  de cuenta del cliente
                    </Dialog.Description>

                    <div className="border border-gray-600 rounded-md h-auto mx-auto w-full p-4">
                        <div className="w-full flex items-center justify-center flex-col gap-y-2 md:flex-row md:gap-x-2">

                            <div className="w-full flex items-center justify-center flex-col gap-y-2 md:flex-row md:gap-x-2">
                                <div className="w-full gap-Y-2 flex-col flex items-start">
                                    <label htmlFor="nombre_proveedor" className="font-bold mb-1">Proveedor:</label>
                                    <input
                                        className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                        id="nombre_proveedor"
                                        defaultValue={customerIdValue == undefined || customerIdValue == null ? "" : customerIdValue!.nombre_cliente}
                                        type="text"
                                        disabled
                                    />
                                </div>

                                <div className="w-full gap-Y-2 flex-col flex items-start">
                                    <label htmlFor="ruc" className="font-bold mb-1">RUC:</label>
                                    <input
                                        className="w-full border border-gray-400 hover:border-gray-600  outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                        id="ruc"
                                        defaultValue={customerIdValue == undefined || customerIdValue == null ? "" : customerIdValue!.ruc}
                                        type="text"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="w-full flex items-center justify-center flex-col gap-y-2 md:flex-row md:gap-x-2">
                                <div className="w-full gap-Y-2 flex-col flex items-start">
                                    <label htmlFor="telefono_proveedor" className="font-bold mb-1">Telefono:</label>
                                    <input
                                        className="w-full border border-gray-400 hover:border-gray-600  outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                        id="telefono_proveedor"
                                        defaultValue={customerIdValue == undefined || customerIdValue == null ? "" : customerIdValue!.telefono_cliente}
                                        type="text"
                                        disabled
                                    />
                                </div>

                                <div className="w-full gap-Y-2 flex-col flex items-start">
                                    <label htmlFor="celular_proveedor" className="font-bold mb-1">Celular:</label>
                                    <input
                                        className="w-full border border-gray-400 hover:border-gray-600  outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                        id="celular_proveedor"
                                        defaultValue={customerIdValue == undefined || customerIdValue == null ? "" : customerIdValue!.celular_cliente}
                                        type="text"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full mx-auto mt-4 top-0 sticky flex items-center justify-center gap-x-1 border border-gray-400 hover:border-gray-600 py-1 px-2'>
                        <label htmlFor="searchSupplierBalance">
                            <Search className="size-5" />
                        </label>
                        <input
                            id="searchSupplierBalance"
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full outline-none"
                        />
                    </div>

                    <div className="w-full md:h-[55%] lg:h-[65%] touch-pan-x touch-pan-y scroll-smooth mx-auto">
                        <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x w-full">
                            <Table.Header className="top-0 sticky bg-white">
                                <Table.Row align="center">
                                    <Table.ColumnHeaderCell>Fecha emisión</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Descripcion</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Número compra</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Fecha vencimiento</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Débito</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Crédito</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Balance</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    filteredDataCustomerBalance?.map(supplierBalance => (
                                        <Table.Row key={supplierBalance.id} className="hover:bg-gray-100/85 transition-all duration-200 p-2">

                                            <Table.Cell className="text-green-700">
                                                {
                                                    formatDate(supplierBalance.fecha_emision)
                                                }
                                            </Table.Cell>

                                            <Table.Cell>
                                                {
                                                    supplierBalance.descripcion
                                                }
                                            </Table.Cell>

                                            <Table.Cell>
                                                {
                                                    supplierBalance.numero_venta
                                                }
                                            </Table.Cell>

                                            <Table.Cell className="text-red-500">
                                                {
                                                    supplierBalance.fecha_vencimiento == null ? "" : formatDate(supplierBalance.fecha_vencimiento)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className="text-cyan-700">
                                                {
                                                    supplierBalance.debito == null ? formatCurrency("0.00") : formatCurrency(supplierBalance.debito)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className="text-red-400">
                                                {
                                                    formatCurrency(supplierBalance.credito)
                                                }
                                            </Table.Cell>

                                            <Table.Cell>
                                                {
                                                    formatCurrency(supplierBalance.balance)
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                }
                                <Table.Row className="bg-green-100 hover:bg-green-200/60 transition-all duration-200 p-2">
                                    <Table.Cell colSpan={4} className="text-end font-black">
                                        <p className="mr-10">BALANCE TOTAL</p>
                                    </Table.Cell>
                                    <Table.Cell colSpan={1} className="font-bold">
                                        <p className="text-cyan-700">{formatCurrency(totalDebit.toString())}</p>
                                    </Table.Cell>
                                    <Table.Cell colSpan={1} className="text-red-400 font-bold">
                                        <p>{formatCurrency(totalCredit.toString())}</p>
                                    </Table.Cell>
                                    <Table.Cell colSpan={1} className="font-bold">
                                        <p>{formatCurrency(totalBalance.toString())}</p>
                                    </Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    {
                                        filteredDataCustomerBalance?.length === 0 && (
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