import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search, Trash2 } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { getSupplier } from "../../api/SupplierAPI"
import { SupplierFormDataDelete, SupplierFormDataInfo } from "../../types/supplierData"
import ToogleFieldsDialogSupplier from "../../components/Supplier/ToogleFieldsDialogSupplier"
import CreateSupplier from "../../components/Supplier/CreateSupplier"
import DeleteSupplierAlertDialog from "../../components/Supplier/DeleteSupplierAlertDialog"
import EditSupplier from "../../components/Supplier/EditSupplier"
import { AuthPermissions } from "../../types/authData"

export default function SupplierView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalEditSupplier = queryParams.get("editSupplier");
  const showEditModal = modalEditSupplier ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getSupplier,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [openDialogEditSupplier, setOpenDialogEditSupplier] = useState(showEditModal)


  const [editingSupplier, setEditingSupplier] = useState<SupplierFormDataInfo | null>(null)
  const [deletedSupplier, setDeletedSupplier] = useState<SupplierFormDataDelete | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "codigo_proveedor",
    "nombre_proveedor",
    "direccion_proveedor",
    "correo_proveedor",
    "telefono_proveedor",
    "celular_proveedor",
    "ruc",
    "contacto",
    "estado",
    "termino_compra",
    "fecha_creacion",
    "nombre_usuario_creador",
    "nombre_usuario_modificador",
  ])

  const filteredSuppliers = data?.filter(supplier =>
    Object.values(supplier).some(value =>
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
                    dataAuth?.permisos_proveedor[0].guardar == 1 && (<CreateSupplier />)
                  }

                  <ToogleFieldsDialogSupplier showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("codigo_proveedor") && <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>}
                      {showFields.includes("nombre_proveedor") && <Table.ColumnHeaderCell>Proveedor</Table.ColumnHeaderCell>}
                      {showFields.includes("direccion_proveedor") && <Table.ColumnHeaderCell>Dirección</Table.ColumnHeaderCell>}
                      {showFields.includes("correo_proveedor") && <Table.ColumnHeaderCell>Correo</Table.ColumnHeaderCell>}
                      {showFields.includes("telefono_proveedor") && <Table.ColumnHeaderCell>Teléfono</Table.ColumnHeaderCell>}
                      {showFields.includes("celular_proveedor") && <Table.ColumnHeaderCell>Celular</Table.ColumnHeaderCell>}
                      {showFields.includes("ruc") && <Table.ColumnHeaderCell>RUC</Table.ColumnHeaderCell>}
                      {showFields.includes("contacto") && <Table.ColumnHeaderCell>Contacto</Table.ColumnHeaderCell>}
                      {showFields.includes("estado") && <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>}
                      {showFields.includes("termino_compra") && <Table.ColumnHeaderCell>Termino</Table.ColumnHeaderCell>}
                      {showFields.includes("fecha_creacion") && <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>}

                      {
                        dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                        showFields.includes("nombre_usuario_creador") && <Table.ColumnHeaderCell>Creador</Table.ColumnHeaderCell>
                      }

                      {
                        dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                        showFields.includes("nombre_usuario_modificador") && <Table.ColumnHeaderCell>Modificador</Table.ColumnHeaderCell>
                      }


                      {
                        dataAuth?.permisos_proveedor[0].modificar == 1 ||
                          dataAuth?.permisos_proveedor[0].eliminar == 1 ?
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
                      filteredSuppliers?.map(supplier => (
                        <Table.Row key={supplier.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {supplier.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("codigo_proveedor") &&
                            <Table.Cell>
                              {supplier.codigo_proveedor}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("nombre_proveedor") &&
                            <Table.Cell>
                              {supplier.nombre_proveedor}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("direccion_proveedor") &&
                            <Table.Cell>
                              {supplier.direccion_proveedor}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("correo_proveedor") &&
                            <Table.Cell>
                              {supplier.correo_proveedor}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("telefono_proveedor") &&
                            <Table.Cell>
                              {supplier.telefono_proveedor}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("celular_proveedor") &&
                            <Table.Cell>
                              {supplier.celular_proveedor}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("ruc") &&
                            <Table.Cell>
                              {supplier.ruc}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("contacto") &&
                            <Table.Cell>
                              {supplier.contacto}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("estado") &&
                            <Table.Cell>
                              <Badge color={`${supplier.estado == 1 ? "green" : "red"}`}>
                                {
                                  supplier.estado == 1 ? "Activo" : "Inactivo"
                                }
                              </Badge>
                            </Table.Cell>
                          }

                          {
                            showFields.includes("termino_compra") &&
                            <Table.Cell>
                              {supplier.termino_compra}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(supplier.fecha_creacion)}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {supplier.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                                {supplier.nombre_usuario_modificador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_proveedor[0].modificar == 1 ||
                              dataAuth!.permisos_proveedor[0].eliminar == 1 ?
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
                                                setEditingSupplier(supplier)
                                                setOpenDialogEditSupplier(!openDialogEditSupplier)
                                                refetch()

                                                if (openDialogEditSupplier) {
                                                  navigate(location.pathname, { replace: true })
                                                  setOpenDialogEditSupplier(!openDialogEditSupplier)
                                                  refetch()
                                                }
                                                else {
                                                  navigate(location.pathname + `?editSupplier=${supplier.id}`)
                                                  refetch()
                                                }
                                              }}
                                            >
                                              <Edit className="size-4" />
                                              Modificar proveedor
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
                                              setDeletedSupplier(supplier)
                                            }}
                                          >
                                            <Trash2 className="size-4 text-red hover:text-white" />
                                            Eliminar proveedor
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
                        filteredSuppliers?.length == 0 &&
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
                      deletedSupplier && (
                        <DeleteSupplierAlertDialog supplier={deletedSupplier} onClose={() => setDeletedSupplier(null)} />
                      )
                    }

                    {
                      editingSupplier && (
                        <Dialog.Root open={openDialogEditSupplier} onOpenChange={() => {
                          setOpenDialogEditSupplier(!openDialogEditSupplier)
                          refetch()
                          if (openDialogEditSupplier) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          <EditSupplier supplier={{ ...editingSupplier, usuario_modificador: "default_value" }} onClose={() => setEditingSupplier(null)} />
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