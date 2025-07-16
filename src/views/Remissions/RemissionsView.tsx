import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search } from "lucide-react"
import { Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { getRemissions } from "../../api/RemissionsAPI"
import { Remissions } from "../../types/remissionsData"
import ToogleFieldsDialogRemissions from "../../components/Remissions/ToogleFieldsDialogRemissions"
import CreateRemission from "../../components/Remissions/CreateRemission"
import EditRemission from "../../components/Remissions/EditRemission"
import ReportRemissionById from "../../components/Remissions/Report/ReportRemissionById"

export default function RemissionsView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalEditRemission = queryParams.get("editRemissions");
    const showEditModal = modalEditRemission ? true : false;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["remissions"],
        queryFn: getRemissions,
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [openDialogEditRemissions, setOpenDialogEditRemissions] = useState(showEditModal)


    const [editingRemissions, setEditingRemissions] = useState<Remissions | null>(null)
    const [showFields, setShowFields] = useState<string[]>([
        "codigo",
        "nombre_cliente",
        "fecha_creacion",
        "nombre_usuario_creador",
        "nombre_usuario_modificador"
    ])

    const filteredRemissions = data?.filter(brands =>
        Object.values(brands).some(value =>
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
                                        dataAuth?.permisos_remisiones[0].guardar == 1 && (<CreateRemission />)
                                    }

                                    <ToogleFieldsDialogRemissions showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                                    <Table.Header className="top-0 sticky bg-white">
                                        <Table.Row align="center">
                                            {showFields.includes("codigo") && <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>}
                                            {showFields.includes("nombre_cliente") && <Table.ColumnHeaderCell>Cliente</Table.ColumnHeaderCell>}
                                            {showFields.includes("fecha_creacion") && <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>}

                                            {
                                                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                showFields.includes("nombre_usuario_creador") && <Table.ColumnHeaderCell>Creador</Table.ColumnHeaderCell>
                                            }
                                            {
                                                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                showFields.includes("nombre_usuario_modificador") && <Table.ColumnHeaderCell>Modificador</Table.ColumnHeaderCell>
                                            }

                                            {
                                                dataAuth!.permisos_remisiones[0].modificar == 1 ||
                                                    dataAuth!.permisos_remisiones[0].eliminar == 1 ||
                                                    dataAuth!.permisos_remisiones[0].reporte == 1 ?
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
                                            filteredRemissions?.map(remission => (
                                                <Table.Row key={remission.id} className="hover:bg-gray-100/85 transition-all duration-200">
                                                    {
                                                        showFields.includes("id") &&
                                                        <Table.Cell>
                                                            {remission.id}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("codigo") &&
                                                        <Table.Cell>
                                                            {remission.codigo}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("nombre_cliente") &&
                                                        <Table.Cell>
                                                            {remission.nombre_cliente}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        showFields.includes("fecha_creacion") &&
                                                        <Table.Cell>
                                                            {formatDate(remission.fecha_creacion)}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                                                        showFields.includes("nombre_usuario_creador") &&
                                                        <Table.Cell>
                                                            {remission.nombre_usuario_creador}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                                                        showFields.includes("nombre_usuario_modificador") &&
                                                        <Table.Cell>
                                                            {remission.nombre_usuario_modificador}
                                                        </Table.Cell>
                                                    }

                                                    {
                                                        dataAuth!.permisos_remisiones[0].modificar == 1 ||
                                                            dataAuth!.permisos_remisiones[0].eliminar == 1 ||
                                                            dataAuth!.permisos_remisiones[0].reporte == 1 ?
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
                                                                                dataAuth?.permisos_remisiones[0].modificar == 1 &&
                                                                                (
                                                                                    <>
                                                                                        <DropdownMenu.Item
                                                                                            color="gray"
                                                                                            className="flex items-center justify-center"
                                                                                            onClick={() => {
                                                                                                setEditingRemissions({ ...remission, detalle_remision: [] })
                                                                                                setOpenDialogEditRemissions(!openDialogEditRemissions)
                                                                                                refetch()

                                                                                                if (openDialogEditRemissions) {
                                                                                                    navigate(location.pathname, { replace: true })
                                                                                                    setOpenDialogEditRemissions(!openDialogEditRemissions)
                                                                                                    refetch()
                                                                                                }
                                                                                                else {
                                                                                                    navigate(location.pathname + `?editRemissions=${remission.id}`)
                                                                                                    refetch()
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <Edit className="size-4" />
                                                                                            Modificar remisión
                                                                                        </DropdownMenu.Item>
                                                                                    </>
                                                                                )
                                                                            }

                                                                            {
                                                                                dataAuth?.permisos_remisiones[0].reporte == 1 &&
                                                                                (
                                                                                    <>
                                                                                        <DropdownMenu.Separator />
                                                                                        <ReportRemissionById remission={{ ...remission, detalle_remision: [] }} />
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
                                                filteredRemissions?.length == 0 &&
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
                                            editingRemissions && (
                                                <Dialog.Root open={openDialogEditRemissions} onOpenChange={() => {
                                                    setOpenDialogEditRemissions(!openDialogEditRemissions)
                                                    refetch()
                                                    if (openDialogEditRemissions) {
                                                        navigate(location.pathname, { replace: true })
                                                    }
                                                }}>
                                                    <EditRemission remission={{ ...editingRemissions, usuario_modificador: "default_value" }} onClose={() => setEditingRemissions(null)} />
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