import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Ellipsis, Loader2, LucideChartNoAxesCombined, Search, Wallet2Icon } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatCurrency, formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { getCustomerBalance } from "../../apis/CustomerBalanceAPI"
import ToogleFieldsDialogCustomerBalance from "../../components/CustomerBalance/ToogleFieldsDialogCustomerBalance"
import StatementOfAccountCustomerBalance from "../../components/CustomerBalance/StatementOfAccountCustomerBalance"
import WalletCustomer from "../../components/CustomerBalance/WalletCustomer"

export default function CustomerBalanceView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const modalStatementOfAccount = queryParams.get("customerStatementOfAccount");
    const showStatementOfAccountModal = modalStatementOfAccount ? true : false;

    const modalWalletCustomer = queryParams.get("walletCustomer");
    const showWalletCustomerModal = modalWalletCustomer ? true : false;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["customerBalance"],
        queryFn: getCustomerBalance,
    })

    const [openDialogStatementOfAccount, setOpenDialogStatementOfAccount] = useState(showStatementOfAccountModal)
    const [openDialogWalletCustomer, setOpenDialogWalletCustomer] = useState(showWalletCustomerModal)
    const [nameCustomer, setNameCustomer] = useState("")

    const [searchTerm, setSearchTerm] = useState("")

    const [showFields, setShowFields] = useState<string[]>([
        "codigo_cliente",
        "nombre_cliente",
        "estado",
        "estado_credito",
        "credito",
        "debito",
        "balance",
        "fecha_emision"
    ])

    const filteredCustomerBalance = data?.filter(customerBalance =>
        Object.values(customerBalance).some(value =>
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

                                    <ToogleFieldsDialogCustomerBalance showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                                    <Table.Header className="top-0 sticky bg-white">
                                        <Table.Row align="center">
                                            {showFields.includes("codigo_cliente") && <Table.ColumnHeaderCell>Código cliente</Table.ColumnHeaderCell>}
                                            {showFields.includes("nombre_cliente") && <Table.ColumnHeaderCell>Cliente</Table.ColumnHeaderCell>}
                                            {showFields.includes("estado") && <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>}
                                            {showFields.includes("credito") && <Table.ColumnHeaderCell>Crédito</Table.ColumnHeaderCell>}
                                            {showFields.includes("debito") && <Table.ColumnHeaderCell>Debito</Table.ColumnHeaderCell>}
                                            {showFields.includes("balance") && <Table.ColumnHeaderCell>Balance</Table.ColumnHeaderCell>}
                                            {showFields.includes("fecha_emision") && <Table.ColumnHeaderCell>Fecha de emisión</Table.ColumnHeaderCell>}

                                            {
                                                dataAuth?.permisos_cuenta_xcobrar[0].estado_cuenta == 1 ||
                                                    dataAuth?.permisos_cuenta_xcobrar[0].cartera == 1 ?
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
                                            filteredCustomerBalance?.map(customerBalance => (
                                                <Table.Row key={customerBalance.id} className="hover:bg-gray-100/85 transition-all duration-200">
                                                    {
                                                        showFields.includes("id") &&
                                                        <Table.Cell>
                                                            {customerBalance.id}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("codigo_cliente") &&
                                                        <Table.Cell>
                                                            {customerBalance.codigo_cliente}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("nombre_cliente") &&
                                                        <Table.Cell>
                                                            {customerBalance.nombre_cliente}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("estado") &&
                                                        <Table.Cell>
                                                            <Badge color={`${customerBalance.estado_credito == 0 ? "red" : "green"}`}>
                                                                {customerBalance.estado_credito == 0 ? "Abierto" : "Cerrado"}
                                                            </Badge>
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("credito") &&
                                                        <Table.Cell className="text-red-500">
                                                            {
                                                                formatCurrency(customerBalance.credito)
                                                            }
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("credito") &&
                                                        <Table.Cell className="text-cyan-800">
                                                            {
                                                                formatCurrency(customerBalance.debito)
                                                            }
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("credito") &&
                                                        <Table.Cell className="text-cyan-700">
                                                            {
                                                                formatCurrency(customerBalance.balance)
                                                            }
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("fecha_emision") &&
                                                        <Table.Cell className="text-red-500">
                                                            {formatDate(customerBalance.fecha_emision)}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        dataAuth!.permisos_cuenta_xcobrar[0].estado_cuenta == 1 ||
                                                            dataAuth!.permisos_cuenta_xcobrar[0].cartera == 1 ?
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
                                                                                                    navigate(location.pathname + `?customerStatementOfAccount=${customerBalance.id}`)
                                                                                                    setNameCustomer(customerBalance.nombre_cliente);
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
                                                                                            setOpenDialogWalletCustomer(!openDialogWalletCustomer)
                                                                                            refetch()

                                                                                            if (openDialogWalletCustomer) {
                                                                                                navigate(location.pathname, { replace: true })
                                                                                                setOpenDialogWalletCustomer(!openDialogWalletCustomer)
                                                                                                refetch()
                                                                                            }
                                                                                            else {                                                                                                
                                                                                                navigate(location.pathname + `?walletCustomer=${customerBalance.id}`)
                                                                                                setNameCustomer(customerBalance.nombre_cliente);
                                                                                                refetch()
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <Wallet2Icon className="size-4 text-red hover:text-white" />
                                                                                        Cartera cliente
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
                                                filteredCustomerBalance?.length == 0 &&
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
                                                        <StatementOfAccountCustomerBalance nameCustomer={nameCustomer} />
                                                    }
                                                </Dialog.Root>
                                            )
                                        }

                                        {
                                            openDialogWalletCustomer && (
                                                <Dialog.Root open={openDialogWalletCustomer} onOpenChange={() => {
                                                    setOpenDialogWalletCustomer(!openDialogWalletCustomer)
                                                    refetch()
                                                    if (openDialogWalletCustomer) {
                                                        navigate(location.pathname, { replace: true })
                                                    }
                                                }}>
                                                    {
                                                        openDialogWalletCustomer &&
                                                        <WalletCustomer nameCustomer={nameCustomer} dataAuth={dataAuth} />
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