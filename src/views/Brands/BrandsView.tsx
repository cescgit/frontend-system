import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search, Trash2 } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { getBrands } from "../../apis/BrandAPI"
import { BrandFormDataDelete, BrandFormDataInfo } from "../../types/brandData"
import ToogleFieldsDialogBrand from "../../components/Brand/ToogleFieldsDialogBrand"
import CreateBrand from "../../components/Brand/CreateBrand"
import DeleteBrandAlertDialog from "../../components/Brand/DeleteBrandAlertDialog"
import EditBrand from "../../components/Brand/EditBrand"
import { AuthPermissions } from "../../types/authData"

export default function BrandsView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalEditBrand = queryParams.get("editBrands");
  const showEditModal = modalEditBrand ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [openDialogEditBrand, setOpenDialogEditBrand] = useState(showEditModal)


  const [editingBrand, setEditingBrand] = useState<BrandFormDataInfo | null>(null)
  const [deletedBrand, setDeletedBrand] = useState<BrandFormDataDelete | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "nombre_marca",
    "descripcion",
    "estado",
    "fecha_creacion",
    "nombre_usuario_creador",
    "nombre_usuario_modificador"
  ])

  const filteredBrands = data?.filter(brands =>
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
                    dataAuth?.permisos_marca[0].guardar == 1 && (<CreateBrand />)
                  }

                  <ToogleFieldsDialogBrand showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("nombre_marca") && <Table.ColumnHeaderCell>Marca</Table.ColumnHeaderCell>}
                      {showFields.includes("descripcion") && <Table.ColumnHeaderCell>Descripción</Table.ColumnHeaderCell>}
                      {showFields.includes("estado") && <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>}
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
                        dataAuth?.permisos_marca[0].modificar == 1 ||
                          dataAuth?.permisos_marca[0].eliminar == 1 ?
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
                      filteredBrands?.map(brand => (
                        <Table.Row key={brand.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {brand.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("nombre_marca") &&
                            <Table.Cell>
                              {brand.nombre_marca}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("descripcion") &&
                            <Table.Cell>
                              {brand.descripcion}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("estado") &&
                            <Table.Cell>
                              <Badge color={`${brand.estado == 1 ? "green" : "red"}`}>
                                {
                                  brand.estado == 1 ? "Activo" : "Inactivo"
                                }
                              </Badge>
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(brand.fecha_creacion)}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {brand.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                              {brand.nombre_usuario_modificador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_marca[0].modificar == 1 ||
                              dataAuth!.permisos_marca[0].eliminar == 1 ?
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
                                        dataAuth!.permisos_marca[0].modificar === 1 ?
                                          (
                                            <>
                                              <DropdownMenu.Item
                                                color="gray"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  setEditingBrand(brand)
                                                  setOpenDialogEditBrand(!openDialogEditBrand)
                                                  refetch()

                                                  if (openDialogEditBrand) {
                                                    navigate(location.pathname, { replace: true })
                                                    setOpenDialogEditBrand(!openDialogEditBrand)
                                                    refetch()
                                                  }
                                                  else {
                                                    navigate(location.pathname + `?editBrands=${brand.id}`)
                                                    refetch()
                                                  }
                                                }}
                                              >
                                                <Edit className="size-4" />
                                                Modificar marca
                                              </DropdownMenu.Item>
                                            </>
                                          ) :
                                          (null)
                                      }

                                      {
                                        dataAuth!.permisos_marca[0].eliminar == 1 ?
                                          (
                                            <>
                                              <DropdownMenu.Separator />
                                              <DropdownMenu.Item
                                                color="red"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  setDeletedBrand(brand)
                                                }}
                                              >
                                                <Trash2 className="size-4 text-red hover:text-white" />
                                                Eliminar marca
                                              </DropdownMenu.Item>
                                            </>
                                          )
                                          :
                                          (null)
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
                        filteredBrands?.length == 0 &&
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
                      deletedBrand && (
                        <DeleteBrandAlertDialog brand={deletedBrand} onClose={() => setDeletedBrand(null)} />
                      )
                    }

                    {
                      editingBrand && (
                        <Dialog.Root open={openDialogEditBrand} onOpenChange={() => {
                          setOpenDialogEditBrand(!openDialogEditBrand)
                          refetch()
                          if (openDialogEditBrand) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          <EditBrand brand={{ ...editingBrand, usuario_modificador: "default_value" }} onClose={() => setEditingBrand(null)} />
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