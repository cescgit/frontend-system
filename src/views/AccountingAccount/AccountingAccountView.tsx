import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search } from "lucide-react"
import { Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { getAllAccountingAccount } from "../../api/AccountingAccountAPI"
import { AccountingAccountFormDataInfo } from "../../types/acountingAccountData"
import ToogleFieldsDialogAccountAccounting from "../../components/AccountingAccount/ToogleFieldsDialogAccountAccounting"
import CreateAccountingAccount from "../../components/AccountingAccount/CreateAccountingAccount"
import EditAccountingAccount from "../../components/AccountingAccount/EditAccountingAccount"

export default function AccountingAccountView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalEditAccountAccounting = queryParams.get("editAccountingAccount");
    const showEditModal = modalEditAccountAccounting ? true : false;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["accountingAccount"],
        queryFn: getAllAccountingAccount,
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [openDialogEditAccountAccounting, setOpenDialogEditAccountAccounting] = useState(showEditModal)


    const [editingAccountAccounting, setEditingAccountAccounting] = useState<AccountingAccountFormDataInfo | null>(null)    
    const [showFields, setShowFields] = useState<string[]>([
        "numero_cuenta",
        "descripcion",
        "tipo_cuenta",
        "nivel_cuenta",
        "ruc",
        "centro_costo",
        "balance",
        "fecha_creacion"
    ])

    const filteredAccountAccounting = data?.filter(accountAccounting =>
        Object.values(accountAccounting).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
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

                                    {
                                        dataAuth?.permisos_contabilidad[0].guardar == 1 && (<CreateAccountingAccount />)
                                    }

                                    <ToogleFieldsDialogAccountAccounting showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                                    <Table.Header className="top-0 sticky bg-white">
                                        <Table.Row align="center">
                                            {showFields.includes("numero_cuenta") && <Table.ColumnHeaderCell>N. cuenta</Table.ColumnHeaderCell>}
                                            {showFields.includes("descripcion") && <Table.ColumnHeaderCell>Descripción</Table.ColumnHeaderCell>}
                                            {showFields.includes("tipo_cuenta") && <Table.ColumnHeaderCell>Tipo de cuenta</Table.ColumnHeaderCell>}
                                            {showFields.includes("nivel_cuenta") && <Table.ColumnHeaderCell>Nivel de cuenta</Table.ColumnHeaderCell>}
                                            {showFields.includes("ruc") && <Table.ColumnHeaderCell>RUC</Table.ColumnHeaderCell>}
                                            {showFields.includes("centro_costo") && <Table.ColumnHeaderCell>Centro de costo</Table.ColumnHeaderCell>}
                                            {showFields.includes("balance") && <Table.ColumnHeaderCell>Balance</Table.ColumnHeaderCell>}
                                            {showFields.includes("fecha_creacion") && <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>}

                                            {
                                                dataAuth?.permisos_contabilidad[0].modificar == 1 ?
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
                                            filteredAccountAccounting?.map(accountAccounting => (
                                                <Table.Row key={accountAccounting.id} className="hover:bg-gray-100/85 transition-all duration-200">
                                                    {
                                                        showFields.includes("id") &&
                                                        <Table.Cell>
                                                            {accountAccounting.id}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("numero_cuenta") &&
                                                        <Table.Cell>
                                                            {
                                                                accountAccounting.numero_cuenta
                                                            }
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("descripcion") &&
                                                        <Table.Cell>
                                                            {
                                                                accountAccounting.nivel_cuenta === 'DETALLE' ?
                                                                    <pre className="font-medium text-gray-600">
                                                                        {"      " + accountAccounting.descripcion}
                                                                    </pre>
                                                                    :
                                                                    <div className="font-bold text-gray-900">
                                                                        {accountAccounting.descripcion}
                                                                    </div>
                                                            }
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("tipo_cuenta") &&
                                                        <Table.Cell>
                                                            {accountAccounting.tipo_cuenta}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("nivel_cuenta") &&
                                                        <Table.Cell>
                                                            {
                                                                accountAccounting.nivel_cuenta === "DE GRUPO" ?
                                                                    <div className="font-bold text-gray-900">
                                                                        {accountAccounting.nivel_cuenta}
                                                                    </div>
                                                                    :
                                                                    <div className="font-medium text-gray-600">
                                                                        {accountAccounting.nivel_cuenta}
                                                                    </div>
                                                            }
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("ruc") &&
                                                        <Table.Cell>
                                                            {accountAccounting.ruc}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("centro_costo") &&
                                                        <Table.Cell>
                                                            {accountAccounting.centro_costo}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("balance") &&
                                                        <Table.Cell>
                                                            {accountAccounting.balance}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("fecha_creacion") &&
                                                        <Table.Cell>
                                                            {formatDate(accountAccounting.fecha_creacion)}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        dataAuth!.permisos_contabilidad[0].modificar == 1 ||
                                                            dataAuth!.permisos_contabilidad[0].eliminar == 1 ?
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
                                                                                dataAuth?.permisos_proveedor[0].modificar == 1 &&
                                                                                (
                                                                                    <>
                                                                                        <DropdownMenu.Item
                                                                                            color="gray"
                                                                                            className="flex items-center justify-center"
                                                                                            onClick={() => {
                                                                                                setEditingAccountAccounting(accountAccounting)
                                                                                                setOpenDialogEditAccountAccounting(!openDialogEditAccountAccounting)
                                                                                                refetch()

                                                                                                if (openDialogEditAccountAccounting) {
                                                                                                    navigate(location.pathname, { replace: true })
                                                                                                    setOpenDialogEditAccountAccounting(!openDialogEditAccountAccounting)
                                                                                                    refetch()
                                                                                                }
                                                                                                else {
                                                                                                    navigate(location.pathname + `?editAccountingAccount=${accountAccounting.id}`)
                                                                                                    refetch()
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <Edit className="size-4" />
                                                                                            Modificar cuenta contable
                                                                                        </DropdownMenu.Item>
                                                                                        <DropdownMenu.Separator />
                                                                                    </>
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
                                                filteredAccountAccounting?.length == 0 &&
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
                                            editingAccountAccounting && (
                                                <Dialog.Root open={openDialogEditAccountAccounting} onOpenChange={() => {
                                                    setOpenDialogEditAccountAccounting(!openDialogEditAccountAccounting)
                                                    refetch()
                                                    if (openDialogEditAccountAccounting) {
                                                        navigate(location.pathname, { replace: true })
                                                    }
                                                }}>
                                                    <EditAccountingAccount accountAccounting={{ ...editingAccountAccounting, usuario_modificador: "default_value" }} onClose={() => setEditingAccountAccounting(null)} />
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