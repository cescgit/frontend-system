import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Ellipsis, Loader2, LucideChartNoAxesCombined, Search, Wallet2Icon } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatCurrency, formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { getSupplierBalance } from "../../api/SupplierBalanceAPI"
import ToogleFieldsDialogSupplierBalance from "../../components/SupplierBalance/ToogleFieldsDialogSupplierBalance"
import StatementOfAccountSupplierBalance from "../../components/SupplierBalance/StatementOfAccountSupplierBalance"
import WalletSupplier from "../../components/SupplierBalance/WalletSupplier"

export default function SupplierBalanceView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const modalStatementOfAccount = queryParams.get("supplierStatementOfAccount");
    const showStatementOfAccountModal = modalStatementOfAccount ? true : false;

    const modalWalletSupplier = queryParams.get("walletSupplier");
    const showWalletSupplierModal = modalWalletSupplier ? true : false;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["supplierBalance"],
        queryFn: getSupplierBalance,
    })

    const [openDialogStatementOfAccount, setOpenDialogStatementOfAccount] = useState(showStatementOfAccountModal)
    const [openDialogWalletSupplier, setOpenDialogWalletSupplier] = useState(showWalletSupplierModal)
    const [nameSupplier, setNameSupplier] = useState("")

    const [searchTerm, setSearchTerm] = useState("")

    const [showFields, setShowFields] = useState<string[]>([
        "codigo_proveedor",
        "nombre_proveedor",
        "estado",
        "estado_credito",
        "credito",
        "debito",
        "balance",
        "fecha_emision"
    ])

    const filteredSupplierBalance = data?.filter(supplierBalance =>
        Object.values(supplierBalance).some(value =>
            value!.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    return (
        <div className="w-full flex items-center justify-center">
            {
                isLoading ? (<Loader />) :
                    (
                        <div className="h-full flex flex-col items-center justify-center w-full px-4">
                            <section className="h-[10%] w-full flex flex-col-reverse md:flex-row items-center justify-center gap-x-10">
                                <div className="w-full md:w-[50%] border border-gray-400 py-1 px-2 mt-3 md:mt-0 rounded-lg flex items-center gap-x-1">
                                    <Search className="size-5 text-gray-400" href="search" />
                                    <input
                                        id="search"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar..."
                                        className="w-full border-none outline-none placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                                    <Tooltip content="Clic para actualizar la información">
                                        <button
                                            className="w-full md:w-auto border border-gray-300 rounded-md flex items-center justify-center gap-x-4 py-1 px-4 bg-gray-100/50 hover:bg-gray-100/60 font-medium text-base"
                                            color="gray"
                                            onClick={() => refetch()}
                                        >
                                            <Loader2 className="size-5" />
                                            <span className="md:hidden">Actualizar</span>
                                        </button>
                                    </Tooltip>

                                    <ToogleFieldsDialogSupplierBalance showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                                    <Table.Header className="top-0 sticky bg-white">
                                        <Table.Row align="center">
                                            {showFields.includes("codigo_proveedor") && <Table.ColumnHeaderCell>Código proveedor</Table.ColumnHeaderCell>}
                                            {showFields.includes("nombre_proveedor") && <Table.ColumnHeaderCell>Proveedor</Table.ColumnHeaderCell>}
                                            {showFields.includes("estado") && <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>}
                                            {showFields.includes("credito") && <Table.ColumnHeaderCell>Crédito</Table.ColumnHeaderCell>}
                                            {showFields.includes("debito") && <Table.ColumnHeaderCell>Debito</Table.ColumnHeaderCell>}
                                            {showFields.includes("balance") && <Table.ColumnHeaderCell>Balance</Table.ColumnHeaderCell>}
                                            {showFields.includes("fecha_emision") && <Table.ColumnHeaderCell>Fecha de emisión</Table.ColumnHeaderCell>}

                                            {
                                                dataAuth?.permisos_cuenta_xpagar[0].estado_cuenta == 1 ||
                                                    dataAuth?.permisos_cuenta_xpagar[0].cartera == 1 ?
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
                                            filteredSupplierBalance?.map(supplierBalance => (
                                                <Table.Row key={supplierBalance.id} className="hover:bg-gray-100/85 transition-all duration-200">
                                                    {
                                                        showFields.includes("id") &&
                                                        <Table.Cell>
                                                            {supplierBalance.id}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("codigo_proveedor") &&
                                                        <Table.Cell>
                                                            {supplierBalance.codigo_proveedor}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("nombre_proveedor") &&
                                                        <Table.Cell>
                                                            {supplierBalance.nombre_proveedor}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("estado") &&
                                                        <Table.Cell>
                                                            <Badge color={`${supplierBalance.estado_credito == 0 ? "red" : "green"}`}>
                                                                {supplierBalance.estado_credito == 0 ? "Abierto" : "Cerrado"}
                                                            </Badge>
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("credito") &&
                                                        <Table.Cell className="text-red-500">
                                                            {
                                                                formatCurrency(supplierBalance.credito)
                                                            }
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("credito") &&
                                                        <Table.Cell className="text-cyan-800">
                                                            {
                                                                formatCurrency(supplierBalance.debito)
                                                            }
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("credito") &&
                                                        <Table.Cell className="text-cyan-700">
                                                            {
                                                                formatCurrency(supplierBalance.balance)
                                                            }
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("fecha_emision") &&
                                                        <Table.Cell className="text-red-500">
                                                            {formatDate(supplierBalance.fecha_emision)}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        dataAuth!.permisos_cuenta_xpagar[0].estado_cuenta == 1 ||
                                                            dataAuth!.permisos_cuenta_xpagar[0].cartera == 1 ?
                                                            (
                                                                <Table.Cell>
                                                                    <DropdownMenu.Root>
                                                                        <DropdownMenu.Trigger>
                                                                            <Button
                                                                                color="gray"
                                                                                variant="surface"
                                                                            >
                                                                                <Ellipsis className="size-5" />
                                                                            </Button>
                                                                        </DropdownMenu.Trigger>
                                                                        <DropdownMenu.Content>

                                                                            {
                                                                                dataAuth?.permisos_cuenta_xpagar[0].estado_cuenta == 1 &&
                                                                                (
                                                                                    <>
                                                                                        <DropdownMenu.Item
                                                                                            color="gray"
                                                                                            className="flex items-center justify-center"
                                                                                            onClick={() => {
                                                                                                setOpenDialogStatementOfAccount(!openDialogStatementOfAccount)
                                                                                                refetch()

                                                                                                if (openDialogStatementOfAccount) {
                                                                                                    navigate(location.pathname, { replace: true })
                                                                                                    setOpenDialogStatementOfAccount(!openDialogStatementOfAccount)
                                                                                                    refetch()
                                                                                                }
                                                                                                else {                                                                                                    
                                                                                                    navigate(location.pathname + `?supplierStatementOfAccount=${supplierBalance.id}`)
                                                                                                    setNameSupplier(supplierBalance.nombre_proveedor);
                                                                                                    refetch()
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <LucideChartNoAxesCombined className="size-4" />
                                                                                            Estado de cuenta
                                                                                        </DropdownMenu.Item>
                                                                                        <DropdownMenu.Separator />
                                                                                    </>
                                                                                )
                                                                            }

                                                                            {
                                                                                dataAuth?.permisos_cuenta_xpagar[0].cartera == 1 &&                                                                                
                                                                                (
                                                                                    <DropdownMenu.Item
                                                                                        color="gray"
                                                                                        className="flex items-center justify-center"
                                                                                        onClick={() => {
                                                                                            setOpenDialogWalletSupplier(!openDialogWalletSupplier)
                                                                                            refetch()

                                                                                            if (openDialogWalletSupplier) {
                                                                                                navigate(location.pathname, { replace: true })
                                                                                                setOpenDialogWalletSupplier(!openDialogWalletSupplier)
                                                                                                refetch()
                                                                                            }
                                                                                            else {                                                                                                
                                                                                                navigate(location.pathname + `?walletSupplier=${supplierBalance.id}`)
                                                                                                setNameSupplier(supplierBalance.nombre_proveedor);
                                                                                                refetch()
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <Wallet2Icon className="size-4 text-red hover:text-white" />
                                                                                        Cartera proveedor
                                                                                    </DropdownMenu.Item>
                                                                                )
                                                                            }
                                                                        </DropdownMenu.Content>
                                                                    </DropdownMenu.Root>
                                                                </Table.Cell>
                                                            )
                                                            :
                                                            (null)
                                                    }

                                                </Table.Row>
                                            ))
                                        }

                                        <Table.Row>
                                            {
                                                filteredSupplierBalance?.length == 0 &&
                                                (
                                                    <Table.Cell colSpan={12}>
                                                        <div className="flex items-center flex-col justify-center">
                                                            <NotFoundEmpty />
                                                            <p className='text-center font-bold text-3xl'>No se encontraron resultados...</p>
                                                        </div>
                                                    </Table.Cell>
                                                )
                                            }
                                        </Table.Row>

                                        {
                                            openDialogStatementOfAccount && (
                                                <Dialog.Root open={openDialogStatementOfAccount} onOpenChange={() => {
                                                    setOpenDialogStatementOfAccount(!openDialogStatementOfAccount)
                                                    refetch()
                                                    if (openDialogStatementOfAccount) {
                                                        navigate(location.pathname, { replace: true })
                                                    }
                                                }}>
                                                    {
                                                        openDialogStatementOfAccount &&
                                                        <StatementOfAccountSupplierBalance nameSupplier={nameSupplier} />
                                                    }
                                                </Dialog.Root>
                                            )
                                        }

                                        {
                                            openDialogWalletSupplier && (
                                                <Dialog.Root open={openDialogWalletSupplier} onOpenChange={() => {
                                                    setOpenDialogWalletSupplier(!openDialogWalletSupplier)
                                                    refetch()
                                                    if (openDialogWalletSupplier) {
                                                        navigate(location.pathname, { replace: true })
                                                    }
                                                }}>
                                                    {
                                                        openDialogWalletSupplier &&
                                                        <WalletSupplier nameSupplier={nameSupplier} dataAuth={dataAuth} />
                                                    }
                                                </Dialog.Root>
                                            )
                                        }
                                    </Table.Body>
                                </Table.Root>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}