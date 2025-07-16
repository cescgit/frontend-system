import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppWindow, Ban, Computer, Ellipsis, Search, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { Button, DropdownMenu, Table } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import { formatCurrency, formatDate } from "../../utils/utils";
import { AuthPermissions } from "../../types/authData";
import { getCustomerBalanceByIdCustomerDetails } from "../../apis/CustomerBalanceAPI";
import { getCustomers } from "../../apis/CustomerAPI";
import { CustomerFormDataInfo } from "../../types/customerData";
import AdvanceOrPaymentBalanceCustomer from "./AdvanceOrPaymentBalanceCustomer";
import DetailsByIdCustomerBalanceModal from "./DetailsByIdCustomerBalanceModal";
import CancelAdvanceOrPaymentCustomer from "./CancelAdvanceOrPaymentCustomer";


export default function WalletCustomer({ nameCustomer, dataAuth }: { nameCustomer: string, dataAuth: AuthPermissions }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get("walletCustomer")!;
    const showModalAdvanceOrPayment = id ? true : false;

    const modalBalanceCustomer = queryParams.get("viewBalanceCustomer")!;
    const showModalBalanceCustomer = modalBalanceCustomer ? true : false;

    const modalCancelBalanceCustomer = queryParams.get("cancelAdvanceOrPayment")!;
    const showModalCancelBalanceCustomer = modalCancelBalanceCustomer ? true : false;    

    const [totalBalance, setTotalBalance] = useState(0)
    const [idBalanceCliente, setIdBalanceCliente] = useState("")

    const [openDialogAdvanceOrPayment, setOpenDialogAdvanceOrPayment] = useState(showModalAdvanceOrPayment);
    const [openDialogDetailsCustomerBalance, setOpenDialogDetailsCustomerBalance] = useState(showModalBalanceCustomer);
    const [openDialogDetailsCustomerBalanceCancel, setOpenDialogDetailsCustomerBalanceCancel] = useState(showModalCancelBalanceCustomer);

    const [searchTerm, setSearchTerm] = useState("")
    const [balanceCustomer, setBalanceCustomer] = useState(0)
    const [idCliente, setIdCliente] = useState("")
    const [customerIdValue, setCustomerIdValue] = useState<CustomerFormDataInfo | null>(null)

    const { isError, data, refetch } = useQuery({
        queryKey: ["customerBalance", id],
        queryFn: () => getCustomerBalanceByIdCustomerDetails({ id }),
        enabled: !!id,
        retry: false
    })

    const { data: dataCustomer } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    })

    useEffect(() => {
        if (dataCustomer && data) {
            dataCustomer?.map(customersData => {
                if (customersData.id === data![0].id_cliente) {
                    const result = customersData;
                    setCustomerIdValue(result)
                    setIdCliente(result.id)
                }
            });
        }

        if (data) {
            data.map(customersData => {
                if (customersData.id_cliente === data![0].id_cliente) {
                    const result = customersData;
                    setIdBalanceCliente(result.id_balance_cliente)
                }
            });

            data.map(dataCustomerBalance => {                
                setBalanceCustomer(parseFloat(dataCustomerBalance.balance));
            })
        }

    }, [id, dataCustomer, customerIdValue, data])    

    const filteredDataCustomerBalance = data?.filter(customerBalance =>
        Object.values(customerBalance).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    useEffect(() => {
        if (filteredDataCustomerBalance && filteredDataCustomerBalance.length > 0) {
            // Filtrar por estado === 1
            const filtrados = filteredDataCustomerBalance.filter(item => item.estado === 1);

            // Obtener el último (asumiendo orden cronológico)
            const ultimoObjeto = filtrados[filtrados.length - 1];

            if (ultimoObjeto) {
                const balance = +ultimoObjeto.balance;
                setTotalBalance(balance);
            }
        }
    }, [filteredDataCustomerBalance]);

    if (isError) return <Navigate to={"/404"} />    

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/65 data-[state=open]:animate-overlayShow" />
                <Dialog.Content
                    onPointerDownOutside={(event) => event.preventDefault()}
                    onInteractOutside={(event) => event.preventDefault()}
                    className="fixed left-1/2 top-1/2 h-[95%] w-full sm:w-[95%] sm:mx-auto px-2 py-4 md:p-6 touch-pan-x touch-pan-y scroll-smooth -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="text-gray-500 text-2xl text-center">
                        Cartera del cliente: <span className="text-gray-800 font-bold">{nameCustomer}</span>
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-gray-600 text-center">
                        Gestiona los pagos, anticipos y saldos del cliente.
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

                    <div className="w-full md:h-[50%] lg:h-[60%] touch-pan-x touch-pan-y scroll-smooth mx-auto">
                        <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x w-full">
                            <Table.Header className="top-0 sticky bg-white">
                                <Table.Row align="center">
                                    <Table.ColumnHeaderCell>Fecha emisión</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Descripcion</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Número Fact/Pref</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Fecha vencimiento</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Débito</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Crédito</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Balance</Table.ColumnHeaderCell>

                                    {
                                        dataAuth?.permisos_cuenta_xpagar[0].permisos_cartera[0].anular == 1 ?
                                            (
                                                <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                                            )
                                            :
                                            (
                                                null
                                            )
                                    }
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    filteredDataCustomerBalance?.map(customerBalance => (
                                        <Table.Row key={customerBalance.id} className="hover:bg-gray-100/85 transition-all duration-200 p-2">

                                            <Table.Cell className={`${customerBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : "text-green-700"}`}>
                                                {
                                                    formatDate(customerBalance.fecha_emision)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${customerBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : ""}`}>
                                                {
                                                    customerBalance.descripcion
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${customerBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : ""}`}>
                                                {
                                                    customerBalance.numero_venta
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${customerBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : "text-red-500"}`}>
                                                {
                                                    customerBalance.fecha_vencimiento == null ? "" : formatDate(customerBalance.fecha_vencimiento)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${customerBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : "text-cyan-700"}`}>
                                                {
                                                    customerBalance.debito == null ? "" : formatCurrency(customerBalance.debito)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${customerBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : "text-red-500"}`}>
                                                {
                                                    formatCurrency(customerBalance.credito)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${customerBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : ""}`}>
                                                {
                                                    formatCurrency(customerBalance.balance)
                                                }
                                            </Table.Cell>

                                            <Table.Cell>
                                                {
                                                    <DropdownMenu.Root>
                                                        <DropdownMenu.Trigger>
                                                            <Button
                                                                color="gray"
                                                                variant="surface"
                                                            >
                                                                <Ellipsis className="size-7" />
                                                            </Button>
                                                        </DropdownMenu.Trigger>
                                                        <DropdownMenu.Content>

                                                            {
                                                                dataAuth?.permisos_cuenta_xpagar[0].permisos_cartera[0].anular == 1 && 
                                                                customerBalance.estado == 1 && balanceCustomer > 0
                                                                &&
                                                                (
                                                                    <>
                                                                        <DropdownMenu.Item
                                                                            color="red"
                                                                            className="flex items-center justify-center"
                                                                            onClick={() => {
                                                                                setOpenDialogDetailsCustomerBalanceCancel(!openDialogDetailsCustomerBalanceCancel)
                                                                                refetch()

                                                                                if (openDialogDetailsCustomerBalanceCancel) {
                                                                                    navigate(location.pathname, { replace: true })
                                                                                    setOpenDialogDetailsCustomerBalanceCancel(!openDialogDetailsCustomerBalanceCancel)
                                                                                }
                                                                                else {
                                                                                    navigate(location.pathname + `?customerBalance=${customerBalance!.id}&cancelAdvanceOrPaymentCustomerBalance`)

                                                                                }
                                                                            }}
                                                                        >
                                                                            <Ban className="size-4" />
                                                                            Anular registro
                                                                        </DropdownMenu.Item>
                                                                        <DropdownMenu.Separator />
                                                                    </>
                                                                )
                                                            }

                                                            {
                                                                (
                                                                    <DropdownMenu.Item
                                                                        color="gray"
                                                                        className="flex items-center justify-center"
                                                                        onClick={() => {
                                                                            setOpenDialogDetailsCustomerBalance(!openDialogDetailsCustomerBalance)
                                                                            refetch()

                                                                            if (openDialogDetailsCustomerBalance) {
                                                                                navigate(location.pathname, { replace: true })
                                                                                setOpenDialogDetailsCustomerBalance(!openDialogDetailsCustomerBalance)
                                                                            }
                                                                            else {
                                                                                navigate(location.pathname + `?viewBalanceCustomer=${customerBalance!.id}&detailsBalanceCustomer&customerBalanceDetails`)

                                                                            }
                                                                        }}
                                                                    >
                                                                        <AppWindow className="size-4 text-red hover:text-white" />
                                                                        Ver detalle del pago
                                                                    </DropdownMenu.Item>
                                                                )
                                                            }
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Root>
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                }

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

                            {
                                openDialogAdvanceOrPayment && (
                                    <Dialog.Root open={openDialogAdvanceOrPayment} onOpenChange={() => {
                                        setOpenDialogAdvanceOrPayment(!openDialogAdvanceOrPayment)
                                        refetch()
                                    }}>
                                        {
                                            openDialogAdvanceOrPayment &&
                                            <AdvanceOrPaymentBalanceCustomer 
                                                totalBalance={totalBalance} 
                                                idBalanceCliente={idBalanceCliente} 
                                                id_cliente={idCliente}
                                                onClose={() => setOpenDialogAdvanceOrPayment(false)} 
                                            />
                                        }
                                    </Dialog.Root>
                                )
                            }

                            {
                                openDialogDetailsCustomerBalance && (
                                    <Dialog.Root open={openDialogDetailsCustomerBalance} onOpenChange={() => {
                                        setOpenDialogDetailsCustomerBalance(!openDialogDetailsCustomerBalance)
                                    }}>
                                        {
                                            openDialogDetailsCustomerBalance &&
                                            <DetailsByIdCustomerBalanceModal id={id} />
                                        }
                                    </Dialog.Root>
                                )
                            }

                            {
                                openDialogDetailsCustomerBalanceCancel && (
                                    <Dialog.Root open={openDialogDetailsCustomerBalanceCancel} onOpenChange={() => {
                                        setOpenDialogDetailsCustomerBalanceCancel(!openDialogDetailsCustomerBalanceCancel)
                                    }}>
                                        {
                                            openDialogDetailsCustomerBalanceCancel &&
                                            <CancelAdvanceOrPaymentCustomer 
                                                id={id} 
                                                onClose={() => setOpenDialogDetailsCustomerBalanceCancel(false)}
                                            />
                                        }
                                    </Dialog.Root>
                                )
                            }
                        </Table.Root>

                        <div>
                            {
                                dataAuth?.permisos_cuenta_xpagar[0].permisos_cartera[0].pagos == 1 &&  
                                balanceCustomer > 0 &&                             
                                (
                                    <div className="w-full mt-4 flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-x-4 border border-gray-500 hover:border-gray-700 hover:bg-gray-200/85 transition-all duration-200 rounded-lg py-2 px-4 w-auto"
                                            onClick={() => {
                                                setOpenDialogAdvanceOrPayment(!openDialogAdvanceOrPayment)
                                                refetch()

                                                if (openDialogAdvanceOrPayment) {
                                                    navigate(location.pathname + `?walletCustomer=${id}`);
                                                    setOpenDialogAdvanceOrPayment(!openDialogAdvanceOrPayment)                                                    
                                                    refetch()
                                                }
                                                else {
                                                    navigate(location.pathname + `?walletCustomer=${id}&createAdvanceOrPaymentCustomerrBalance`)
                                                    refetch()
                                                }
                                            }}
                                        >
                                            <Computer className="size-5" />
                                            Crear un pago o un anticipo del cliente
                                        </button>
                                    </div>
                                )
                            }
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