import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search, Trash2 } from "lucide-react"
import { Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { getUnitOfMeasurements } from "../../apis/UnitOfMeasureAPI"
import { UnitOfMeasureFormDataDelete, UnitOfMeasureFormDataInfo } from "../../types/unitOfMeasureData"
import ToogleFieldsDialogUnitOfMeasure from "../../components/UnitOfMeasure/ToogleFieldsDialogUnitOfMeasure"
import DeleteUnitOfMeasureAlertDialog from "../../components/UnitOfMeasure/DeleteUnitOfMeasureAlertDialog"
import CreateUnitOfMeasure from "../../components/UnitOfMeasure/CreateUnitOfMeasure"
import EditUnitOfMeasure from "../../components/UnitOfMeasure/EditUnitOfMeasure"

export default function UnitOfMeasurementsView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalEditUnitOfMeasure = queryParams.get("editUnitOfMeasure");
  const showEditModal = modalEditUnitOfMeasure ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["unitOfMeasurements"],
    queryFn: getUnitOfMeasurements,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [openDialogEditUnitOfmeasure, setOpenDialogEditUnitOfmeasure] = useState(showEditModal)


  const [editingUnitOfMeasure, setEditingUnitOfMeasure] = useState<UnitOfMeasureFormDataInfo | null>(null)
  const [deletedUnitOfMeasure, setDeletedUnitOfMeasure] = useState<UnitOfMeasureFormDataDelete | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "unidad_medida",
    "abreviatura",
    "fecha_creacion",
    "nombre_usuario_creador",
"nombre_usuario_modificador"
  ])

  const filteredUnitOfMeasure = data?.filter(unitOfMeasure =>
    Object.values(unitOfMeasure).some(value =>
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
                    dataAuth?.permisos_empresa[0].guardar == 1 && (<CreateUnitOfMeasure />)
                  }

                  <ToogleFieldsDialogUnitOfMeasure showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("unidad_medida") && <Table.ColumnHeaderCell>Unidad de medida</Table.ColumnHeaderCell>}
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
                      filteredUnitOfMeasure?.map(unitOfMeasure => (
                        <Table.Row key={unitOfMeasure.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {unitOfMeasure.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("unidad_medida") &&
                            <Table.Cell>
                              {unitOfMeasure.unidad_medida}
                            </Table.Cell>
                          }
                          {
                            showFields.includes("abreviatura") &&
                            <Table.Cell>
                              {unitOfMeasure.abreviatura}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(unitOfMeasure.fecha_creacion)}
                            </Table.Cell>
                          }

                            {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {unitOfMeasure.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                              {unitOfMeasure.nombre_usuario_modificador}
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
                                                setEditingUnitOfMeasure(unitOfMeasure)
                                                setOpenDialogEditUnitOfmeasure(!openDialogEditUnitOfmeasure)
                                                refetch()

                                                if (openDialogEditUnitOfmeasure) {
                                                  navigate(location.pathname, { replace: true })
                                                  setOpenDialogEditUnitOfmeasure(!openDialogEditUnitOfmeasure)
                                                  refetch()
                                                }
                                                else {
                                                  navigate(location.pathname + `?editUnitOfMeasure=${unitOfMeasure.id}`)
                                                  refetch()
                                                }
                                              }}
                                            >
                                              <Edit className="size-4" />
                                              Modificar unidad de medida
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
                                              setDeletedUnitOfMeasure(unitOfMeasure)
                                            }}
                                          >
                                            <Trash2 className="size-4 text-red hover:text-white" />
                                            Eliminar unidad de medida
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
                        filteredUnitOfMeasure?.length == 0 &&
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
                      deletedUnitOfMeasure && (
                        <DeleteUnitOfMeasureAlertDialog unitOfMeasure={deletedUnitOfMeasure} onClose={() => setDeletedUnitOfMeasure(null)} />
                      )
                    }

                    {
                      editingUnitOfMeasure && (
                        <Dialog.Root open={openDialogEditUnitOfmeasure} onOpenChange={() => {
                          setOpenDialogEditUnitOfmeasure(!openDialogEditUnitOfmeasure)
                          refetch()
                          if (openDialogEditUnitOfmeasure) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          <EditUnitOfMeasure unitOfMeasure={{ ...editingUnitOfMeasure, usuario_modificador: "default_value" }} onClose={() => setEditingUnitOfMeasure(null)} />
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