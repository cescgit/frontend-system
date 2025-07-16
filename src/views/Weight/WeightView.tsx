import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search, Trash2 } from "lucide-react"
import { Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { getWeight } from "../../api/WeightAPI"
import { WeightFormDataDelete, WeightFormDataInfo } from "../../types/weightData"
import ToogleFieldsDialogWeight from "../../components/Weight/ToogleFieldsDialogWeight"
import DeleteWeightAlertDialog from "../../components/Weight/DeleteWeight"
import CreateWeight from "../../components/Weight/CreateWeight"
import EditWeight from "../../components/Weight/EditWeight"

export default function WeightView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalEditWeight = queryParams.get("editWeight");
  const showEditModal = modalEditWeight ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["weight"],
    queryFn: getWeight,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [openDialogEditWeight, setOpenDialogEditWeight] = useState(showEditModal)


  const [editingWeight, setEditingWeight] = useState<WeightFormDataInfo | null>(null)
  const [deletedWeight, setDeletedWeight] = useState<WeightFormDataDelete | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "peso",
    "abreviatura",
    "fecha_creacion",
    "nombre_usuario_creador",
    "nombre_usuario_modificador"
  ])

  const filteredWeight = data?.filter(weight =>
    Object.values(weight).some(value =>
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
                    dataAuth?.permisos_empresa[0].guardar == 1 && (<CreateWeight />)
                  }

                  <ToogleFieldsDialogWeight showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("peso") && <Table.ColumnHeaderCell>Peso</Table.ColumnHeaderCell>}
                      {showFields.includes("abreviatura") && <Table.ColumnHeaderCell>Abreviatura</Table.ColumnHeaderCell>}
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
                        dataAuth?.permisos_empresa[0].modificar == 1 ||
                          dataAuth?.permisos_empresa[0].eliminar == 1 ?
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
                      filteredWeight?.map(weight => (
                        <Table.Row key={weight.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {weight.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("peso") &&
                            <Table.Cell>
                              {weight.peso}
                            </Table.Cell>
                          }
                          {
                            showFields.includes("abreviatura") &&
                            <Table.Cell>
                              {weight.abreviatura}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(weight.fecha_creacion)}
                            </Table.Cell>
                          }

                            {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {weight.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                              {weight.nombre_usuario_modificador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_empresa[0].modificar == 1 ||
                              dataAuth!.permisos_empresa[0].eliminar == 1 ?
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
                                                setEditingWeight(weight)
                                                setOpenDialogEditWeight(!openDialogEditWeight)
                                                refetch()

                                                if (openDialogEditWeight) {
                                                  navigate(location.pathname, { replace: true })
                                                  setOpenDialogEditWeight(!openDialogEditWeight)
                                                  refetch()
                                                }
                                                else {
                                                  navigate(location.pathname + `?editWeight=${weight.id}`)
                                                  refetch()
                                                }
                                              }}
                                            >
                                              <Edit className="size-4" />
                                              Modificar peso
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Separator />
                                          </>
                                        )
                                      }

                                      {
                                        dataAuth?.permisos_proveedor[0].eliminar == 1 &&
                                        (
                                          <DropdownMenu.Item
                                            color="red"
                                            className="flex items-center justify-center"
                                            onClick={() => {
                                              setDeletedWeight(weight)
                                            }}
                                          >
                                            <Trash2 className="size-4 text-red hover:text-white" />
                                            Eliminar peso
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
                        filteredWeight?.length == 0 &&
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
                      deletedWeight && (
                        <DeleteWeightAlertDialog weight={deletedWeight} onClose={() => setDeletedWeight(null)} />
                      )
                    }

                    {
                      editingWeight && (
                        <Dialog.Root open={openDialogEditWeight} onOpenChange={() => {
                          setOpenDialogEditWeight(!openDialogEditWeight)
                          refetch()
                          if (openDialogEditWeight) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          <EditWeight weight={{ ...editingWeight, usuario_modificador: "default_value" }} onClose={() => setEditingWeight(null)} />
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