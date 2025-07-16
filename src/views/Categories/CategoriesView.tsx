import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search, Trash2 } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { getCategories } from "../../apis/CategoryAPI"
import { CategoryFormDataDelete, CategoryFormDataInfo } from "../../types/categoryData"
import ToogleFieldsDialogCategory from "../../components/Category/ToogleFieldsDialogCategory"
import DeleteCategoryAlertDialog from "../../components/Category/DeleteCategoryAlertDialog"
import CreateCategory from "../../components/Category/CreateCategory"
import EditCategory from "../../components/Category/EditCategory"
import { AuthPermissions } from "../../types/authData"

export default function CategoriesView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalEditCategory = queryParams.get("editCategories");
  const showEditModal = modalEditCategory ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [openDialogEditCategory, setOpenDialogEditCategory] = useState(showEditModal)


  const [editingCategory, setEditingCategory] = useState<CategoryFormDataInfo | null>(null)
  const [deletedCategory, setDeletedCategory] = useState<CategoryFormDataDelete | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "nombre_categoria",
    "descripcion",
    "estado",
    "fecha_creacion",
    "nombre_usuario_creador",
    "nombre_usuario_modificador"
  ])

  const filteredCategories = data?.filter(category =>
    Object.values(category).some(value =>
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
                    dataAuth?.permisos_categoria[0].guardar == 1 && (<CreateCategory />)
                  }

                  <ToogleFieldsDialogCategory showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("nombre_categoria") && <Table.ColumnHeaderCell>Categoría</Table.ColumnHeaderCell>}
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
                        dataAuth?.permisos_categoria[0].modificar == 1 ||
                          dataAuth?.permisos_categoria[0].eliminar == 1 ?
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
                      filteredCategories?.map(category => (
                        <Table.Row key={category.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {category.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("nombre_categoria") &&
                            <Table.Cell>
                              {category.nombre_categoria}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("descripcion") &&
                            <Table.Cell>
                              {category.descripcion}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("estado") &&
                            <Table.Cell>
                              <Badge color={`${category.estado == 1 ? "green" : "red"}`}>
                                {
                                  category.estado == 1 ? "Activo" : "Inactivo"
                                }
                              </Badge>
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(category.fecha_creacion)}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {category.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                              {category.nombre_usuario_modificador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_categoria[0].modificar == 1 ||
                              dataAuth!.permisos_categoria[0].eliminar == 1 ?
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
                                        dataAuth?.permisos_categoria[0].modificar == 1 &&
                                        (
                                          <>
                                            <DropdownMenu.Item
                                              color="gray"
                                              className="flex items-center justify-center"
                                              onClick={() => {
                                                setEditingCategory(category)
                                                setOpenDialogEditCategory(!openDialogEditCategory)
                                                refetch()

                                                if (openDialogEditCategory) {
                                                  navigate(location.pathname, { replace: true })
                                                  setOpenDialogEditCategory(!openDialogEditCategory)
                                                  refetch()
                                                }
                                                else {
                                                  navigate(location.pathname + `?editCategories=${category.id}`)
                                                  refetch()
                                                }
                                              }}
                                            >
                                              <Edit className="size-4" />
                                              Modificar categoría
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Separator />
                                          </>
                                        )
                                      }

                                      {
                                        dataAuth?.permisos_categoria[0].eliminar == 1 &&
                                        (
                                          <DropdownMenu.Item
                                            color="red"
                                            className="flex items-center justify-center"
                                            onClick={() => {
                                              setDeletedCategory(category)
                                            }}
                                          >
                                            <Trash2 className="size-4 text-red hover:text-white" />
                                            Eliminar categoría
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
                        filteredCategories?.length == 0 &&
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
                      deletedCategory && (
                        <DeleteCategoryAlertDialog category={deletedCategory} onClose={() => setDeletedCategory(null)} />
                      )
                    }

                    {
                      editingCategory && (
                        <Dialog.Root open={openDialogEditCategory} onOpenChange={() => {
                          setOpenDialogEditCategory(!openDialogEditCategory)
                          refetch()
                          if (openDialogEditCategory) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          <EditCategory category={{ ...editingCategory, usuario_modificador: "default_value" }} onClose={() => setEditingCategory(null)} />
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