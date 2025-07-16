import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search } from "lucide-react"
import { Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { getAlltypeAccount } from "../../api/TypeAccountAPI"
import { TypeAccountFormDataInfo } from "../../types/typeAccontData"
import ToogleFieldsDialogTypeAccount from "../../components/TypeAccount/ToogleFieldsDialogTYpeAccount"
import CreateTypeAccount from "../../components/TypeAccount/CreateTypeAccount"
import EditTypeAccount from "../../components/TypeAccount/EditTypeAccount"

export default function TypeAccountView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalEditAccountAccounting = queryParams.get("editTypeAccount");
    const showEditModal = modalEditAccountAccounting ? true : false;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["typeAccount"],
        queryFn: getAlltypeAccount,
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [openDialogTypeEditAccount, setOpenDialogTypeEditAccount] = useState(showEditModal)


    const [editingTypeAccount, setEditingTypeAccount] = useState<TypeAccountFormDataInfo | null>(null)    
    const [showFields, setShowFields] = useState<string[]>([
        "nombre",
        "descripcion",        
        "fecha_creacion"
    ])

    const filteredTypeAccount = data?.filter(typeAccount =>
        Object.values(typeAccount).some(value =>
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
                                        dataAuth?.permisos_contabilidad[0].guardar == 1 && (<CreateTypeAccount />)
                                    }

                                    <ToogleFieldsDialogTypeAccount showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                                    <Table.Header className="top-0 sticky bg-white">
                                        <Table.Row align="center">
                                            {showFields.includes("nombre") && <Table.ColumnHeaderCell>N. cuenta</Table.ColumnHeaderCell>}
                                            {showFields.includes("descripcion") && <Table.ColumnHeaderCell>Descripción</Table.ColumnHeaderCell>}                                            
                                            {showFields.includes("fecha_creacion") && <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>}

                                            {
                                                dataAuth?.permisos_contabilidad[0].modificar == 1 ||
                                                    dataAuth?.permisos_contabilidad[0].eliminar == 1 ?
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
                                            filteredTypeAccount?.map(typeAccount => (
                                                <Table.Row key={typeAccount.id} className="hover:bg-gray-100/85 transition-all duration-200">
                                                    {
                                                        showFields.includes("id") &&
                                                        <Table.Cell>
                                                            {typeAccount.id}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("nombre") &&
                                                        <Table.Cell>
                                                            {typeAccount.nombre}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("descripcion") &&
                                                        <Table.Cell>
                                                            {typeAccount.descripcion}
                                                        </Table.Cell>
                                                    }                                                                                                     

                                                    {
                                                        showFields.includes("fecha_creacion") &&
                                                        <Table.Cell>
                                                            {formatDate(typeAccount.fecha_creacion)}
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
                                                                                                setEditingTypeAccount(typeAccount)
                                                                                                setOpenDialogTypeEditAccount(!openDialogTypeEditAccount)
                                                                                                refetch()

                                                                                                if (openDialogTypeEditAccount) {
                                                                                                    navigate(location.pathname, { replace: true })
                                                                                                    setOpenDialogTypeEditAccount(!openDialogTypeEditAccount)
                                                                                                    refetch()
                                                                                                }
                                                                                                else {
                                                                                                    navigate(location.pathname + `?editTypeAccount=${typeAccount.id}`)
                                                                                                    refetch()
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <Edit className="size-4" />
                                                                                            Modificar tipo de cuenta
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
                                                filteredTypeAccount?.length == 0 &&
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
                                            editingTypeAccount && (
                                                <Dialog.Root open={openDialogTypeEditAccount} onOpenChange={() => {
                                                    setOpenDialogTypeEditAccount(!openDialogTypeEditAccount)
                                                    refetch()
                                                    if (openDialogTypeEditAccount) {
                                                        navigate(location.pathname, { replace: true })
                                                    }
                                                }}>
                                                    <EditTypeAccount typeAccount={{ ...editingTypeAccount, usuario_modificador: "default_value" }} onClose={() => setEditingTypeAccount(null)} />
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