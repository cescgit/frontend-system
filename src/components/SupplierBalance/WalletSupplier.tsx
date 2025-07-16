import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppWindow, Ban, Computer, Ellipsis, Search, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { Button, DropdownMenu, Table } from "@radix-ui/themes";
import { getSupplierBalanceByIdSupplierDetails } from "../../apis/SupplierBalanceAPI";
import { SupplierFormDataInfo } from "../../types/supplierData";
import { getSupplier } from "../../apis/SupplierAPI";
import NotFoundEmpty from "../NotFoundEmpty";
import { formatCurrency, formatDate } from "../../utils/utils";
import { AuthPermissions } from "../../types/authData";
import AdvanceOrPaymentBalance from "./AdvanceOrPaymentBalance";
import DetailsByIdSupplierBalanceModal from "./DetailsByIdSupplierBalanceModal";
import CancelAdvanceOrPayment from "./CancelAdvanceOrPayment";


export default function WalletSupplier({ nameSupplier, dataAuth }: { nameSupplier: string, dataAuth: AuthPermissions }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get("walletSupplier")!;
    const showModalAdvanceOrPayment = id ? true : false;

    const modalBalanceSupplir = queryParams.get("viewBalanceSupplir")!;
    const showModalBalanceSupplir = modalBalanceSupplir ? true : false;

    const modalCancelBalanceSupplir = queryParams.get("cancelAdvanceOrPayment")!;
    const showModalCancelBalanceSupplir = modalCancelBalanceSupplir ? true : false;    
    
    // const existsAdvanceOrPayment = queryParams.has("createAdvanceOrPaymentSupplierBalance")!;    

    const [totalBalance, setTotalBalance] = useState(0)
    const [idBalanceProveedor, setIdBalanceProveedor] = useState("")

    const [openDialogAdvanceOrPayment, setOpenDialogAdvanceOrPayment] = useState(showModalAdvanceOrPayment);
    const [openDialogDetailsSupplirBalance, setOpenDialogDetailsSupplirBalance] = useState(showModalBalanceSupplir);
    const [openDialogDetailsSupplirBalanceCancel, setOpenDialogDetailsSupplirBalanceCancel] = useState(showModalCancelBalanceSupplir);

    const [searchTerm, setSearchTerm] = useState("")
    const [balanceSupplier, setBalanceSupplier] = useState(0)
    const [idProveedor, setIdProveedor] = useState("")
    const [supplierIdValue, setSupplierIdValue] = useState<SupplierFormDataInfo | null>(null)

    const { isError, data, refetch } = useQuery({
        queryKey: ["supplierBalance", id],
        queryFn: () => getSupplierBalanceByIdSupplierDetails({ id }),
        enabled: !!id,
        retry: false
    })

    const { data: dataSupplier } = useQuery({
        queryKey: ["suppliers"],
        queryFn: getSupplier,
    })

    useEffect(() => {
        if (dataSupplier && data) {
            dataSupplier?.map(suppliersData => {
                if (suppliersData.id === data![0].id_proveedor) {
                    const result = suppliersData;
                    setSupplierIdValue(result)
                    setIdProveedor(result.id)
                }
            });
        }

        if (data) {
            data.map(suppliersData => {
                if (suppliersData.id_proveedor === data![0].id_proveedor) {
                    const result = suppliersData;
                    setIdBalanceProveedor(result.id_balance_proveedor)
                }
            });

            data.map(dataSupplierBalance => {                
                setBalanceSupplier(parseFloat(dataSupplierBalance.balance));
            })
        }

    }, [id, dataSupplier, supplierIdValue, data])    

    // useEffect(() => {
    //   if(!existsAdvanceOrPayment) {
    //     setOpenDialogAdvanceOrPayment(false);
    //   }
    // }, [existsAdvanceOrPayment]);
    

    const filteredDataSupplierBalance = data?.filter(supplierBalance =>
        Object.values(supplierBalance).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    useEffect(() => {
        if (filteredDataSupplierBalance && filteredDataSupplierBalance.length > 0) {
            // Filtrar por estado === 1
            const filtrados = filteredDataSupplierBalance.filter(item => item.estado === 1);

            // Obtener el último (asumiendo orden cronológico)
            const ultimoObjeto = filtrados[filtrados.length - 1];

            if (ultimoObjeto) {
                const balance = +ultimoObjeto.balance;
                setTotalBalance(balance);
            }
        }
    }, [filteredDataSupplierBalance]);

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
                        Cartera del proveedor: <span className="text-gray-800 font-bold">{nameSupplier}</span>
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-gray-600 text-center">
                        Gestiona los pagos, anticipos y saldos del proveedor.
                    </Dialog.Description>

                    <div className="border border-gray-600 rounded-md h-auto mx-auto w-full p-4">
                        <div className="w-full flex items-center justify-center flex-col gap-y-2 md:flex-row md:gap-x-2">

                            <div className="w-full flex items-center justify-center flex-col gap-y-2 md:flex-row md:gap-x-2">
                                <div className="w-full gap-Y-2 flex-col flex items-start">
                                    <label htmlFor="nombre_proveedor" className="font-bold mb-1">Proveedor:</label>
                                    <input
                                        className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                        id="nombre_proveedor"
                                        defaultValue={supplierIdValue == undefined || supplierIdValue == null ? "" : supplierIdValue!.nombre_proveedor}
                                        type="text"
                                        disabled
                                    />
                                </div>

                                <div className="w-full gap-Y-2 flex-col flex items-start">
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

                            <div className="w-full flex items-center justify-center flex-col gap-y-2 md:flex-row md:gap-x-2">
                                <div className="w-full gap-Y-2 flex-col flex items-start">
                                    <label htmlFor="telefono_proveedor" className="font-bold mb-1">Telefono:</label>
                                    <input
                                        className="w-full border border-gray-400 hover:border-gray-600  outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                        id="telefono_proveedor"
                                        defaultValue={supplierIdValue == undefined || supplierIdValue == null ? "" : supplierIdValue!.telefono_proveedor}
                                        type="text"
                                        disabled
                                    />
                                </div>

                                <div className="w-full gap-Y-2 flex-col flex items-start">
                                    <label htmlFor="celular_proveedor" className="font-bold mb-1">Celular:</label>
                                    <input
                                        className="w-full border border-gray-400 hover:border-gray-600  outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                        id="celular_proveedor"
                                        defaultValue={supplierIdValue == undefined || supplierIdValue == null ? "" : supplierIdValue!.celular_proveedor}
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
                                    <Table.ColumnHeaderCell>Número compra</Table.ColumnHeaderCell>
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
                                    filteredDataSupplierBalance?.map(supplierBalance => (
                                        <Table.Row key={supplierBalance.id} className="hover:bg-gray-100/85 transition-all duration-200 p-2">

                                            <Table.Cell className={`${supplierBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : "text-green-700"}`}>
                                                {
                                                    formatDate(supplierBalance.fecha_emision)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${supplierBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : ""}`}>
                                                {
                                                    supplierBalance.descripcion
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${supplierBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : ""}`}>
                                                {
                                                    supplierBalance.numero_compra
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${supplierBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : "text-red-500"}`}>
                                                {
                                                    supplierBalance.fecha_vencimiento == null ? "" : formatDate(supplierBalance.fecha_vencimiento)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${supplierBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : "text-cyan-700"}`}>
                                                {
                                                    supplierBalance.debito == null ? "" : formatCurrency(supplierBalance.debito)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${supplierBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : "text-red-500"}`}>
                                                {
                                                    formatCurrency(supplierBalance.credito)
                                                }
                                            </Table.Cell>

                                            <Table.Cell className={`${supplierBalance.estado == 0 ? "text-gray-400 hover:text-gray-600" : ""}`}>
                                                {
                                                    formatCurrency(supplierBalance.balance)
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
                                                                supplierBalance.estado == 1 && balanceSupplier > 0 && !supplierBalance.fecha_vencimiento
                                                                &&
                                                                (
                                                                    <>
                                                                        <DropdownMenu.Item
                                                                            color="red"
                                                                            className="flex items-center justify-center"
                                                                            onClick={() => {
                                                                                setOpenDialogDetailsSupplirBalanceCancel(!openDialogDetailsSupplirBalanceCancel)
                                                                                refetch()

                                                                                if (openDialogDetailsSupplirBalanceCancel) {
                                                                                    navigate(location.pathname, { replace: true })
                                                                                    setOpenDialogDetailsSupplirBalanceCancel(!openDialogDetailsSupplirBalanceCancel)
                                                                                }
                                                                                else {
                                                                                    navigate(location.pathname + `?supplierBalance=${supplierBalance!.id}&cancelAdvanceOrPaymentSupplierBalance`)

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
                                                                            setOpenDialogDetailsSupplirBalance(!openDialogDetailsSupplirBalance)
                                                                            refetch()

                                                                            if (openDialogDetailsSupplirBalance) {
                                                                                navigate(location.pathname, { replace: true })
                                                                                setOpenDialogDetailsSupplirBalance(!openDialogDetailsSupplirBalance)
                                                                            }
                                                                            else {
                                                                                navigate(location.pathname + `?viewBalanceSupplir=${supplierBalance!.id}&detailsBalanceSupplier&supplierBalanceDetails`)

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
                                        filteredDataSupplierBalance?.length === 0 && (
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
                                            <AdvanceOrPaymentBalance 
                                                totalBalance={totalBalance} 
                                                idBalanceProveedor={idBalanceProveedor} 
                                                id_proveedor={idProveedor}
                                                onClose={() => setOpenDialogAdvanceOrPayment(false)} 
                                            />
                                        }
                                    </Dialog.Root>
                                )
                            }

                            {
                                openDialogDetailsSupplirBalance && (
                                    <Dialog.Root open={openDialogDetailsSupplirBalance} onOpenChange={() => {
                                        setOpenDialogDetailsSupplirBalance(!openDialogDetailsSupplirBalance)
                                    }}>
                                        {
                                            openDialogDetailsSupplirBalance &&
                                            <DetailsByIdSupplierBalanceModal id={id} />
                                        }
                                    </Dialog.Root>
                                )
                            }

                            {
                                openDialogDetailsSupplirBalanceCancel && (
                                    <Dialog.Root open={openDialogDetailsSupplirBalanceCancel} onOpenChange={() => {
                                        setOpenDialogDetailsSupplirBalanceCancel(!openDialogDetailsSupplirBalanceCancel)
                                    }}>
                                        {
                                            openDialogDetailsSupplirBalanceCancel &&
                                            <CancelAdvanceOrPayment 
                                                id={id} 
                                                onClose={() => setOpenDialogDetailsSupplirBalanceCancel(false)}
                                            />
                                        }
                                    </Dialog.Root>
                                )
                            }
                        </Table.Root>

                        <div>
                            {
                                dataAuth?.permisos_cuenta_xpagar[0].permisos_cartera[0].pagos == 1 &&  
                                balanceSupplier > 0 &&                             
                                (
                                    <div className="w-full mt-4 flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-x-4 border border-gray-500 hover:border-gray-700 hover:bg-gray-200/85 transition-all duration-200 rounded-lg py-2 px-4 w-auto"
                                            onClick={() => {
                                                setOpenDialogAdvanceOrPayment(!openDialogAdvanceOrPayment)
                                                refetch()

                                                if (openDialogAdvanceOrPayment) {
                                                    navigate(location.pathname + `?walletSupplier=${id}`);
                                                    setOpenDialogAdvanceOrPayment(!openDialogAdvanceOrPayment)                                                    
                                                    refetch()
                                                }
                                                else {
                                                    navigate(location.pathname + `?walletSupplier=${id}&createAdvanceOrPaymentSupplierBalance`)
                                                    refetch()
                                                }
                                            }}
                                        >
                                            <Computer className="size-5" />
                                            Crear un pago o un anticipo al proveedor
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