import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search, Trash2 } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatCurrency, formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { getCustomers } from "../../apis/CustomerAPI"
import { CustomerFormDataDelete, CustomerFormDataInfo } from "../../types/customerData"
import ToogleFieldsDialogCustomer from "../../components/Customer/ToogleFiledsDialogCustomer"
import DeleteCustomerAlertDialog from "../../components/Customer/DeleteCustomerAlertDialog"
import CreateCustomer from "../../components/Customer/CreateCustomer"
import EditCustomer from "../../components/Customer/EditCustomer"
import { AuthPermissions } from "../../types/authData"

export default function CustomersView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalEditCustomer = queryParams.get("editCustomers");
  const showEditModal = modalEditCustomer ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [openDialogEditCustomer, setOpenDialogEditCustomer] = useState(showEditModal)


  const [editingCustomer, setEditingCustomer] = useState<CustomerFormDataInfo | null>(null)
  const [deletedCustomer, setDeletedCustomer] = useState<CustomerFormDataDelete | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "codigo_cliente",    
    "nombre_cliente",
    "telefono_cliente",
    "celular_cliente",
    "correo_cliente",
    "direccion_cliente",
    "ruc",
    "contacto",
    "estado",
    "termino_venta",
    "limite_credito",
    "fecha_creacion",
    "nombre_usuario_creador",
    "nombre_usuario_modificador"
  ])

  const filteredCustomer = data?.filter(customer =>
    Object.values(customer).some(value =>
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
                    dataAuth?.permisos_cliente[0].guardar == 1 && (<CreateCustomer />)
                  }

                  <ToogleFieldsDialogCustomer showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("codigo_cliente") && <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>}
                      {showFields.includes("nombre_cliente") && <Table.ColumnHeaderCell>Cliente</Table.ColumnHeaderCell>}                      
                      {showFields.includes("direccion_cliente") && <Table.ColumnHeaderCell>Dirección</Table.ColumnHeaderCell>}
                      {showFields.includes("correo_cliente") && <Table.ColumnHeaderCell>Correo</Table.ColumnHeaderCell>}
                      {showFields.includes("telefono_cliente") && <Table.ColumnHeaderCell>Teléfono</Table.ColumnHeaderCell>}
                      {showFields.includes("celular_cliente") && <Table.ColumnHeaderCell>Celular</Table.ColumnHeaderCell>}
                      {showFields.includes("ruc") && <Table.ColumnHeaderCell>RUC</Table.ColumnHeaderCell>}
                      {showFields.includes("contacto") && <Table.ColumnHeaderCell>Contacto</Table.ColumnHeaderCell>}
                      {showFields.includes("estado") && <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>}
                      {showFields.includes("termino_venta") && <Table.ColumnHeaderCell>Termino</Table.ColumnHeaderCell>}
                      {showFields.includes("limite_credito") && <Table.ColumnHeaderCell>Limite crédito</Table.ColumnHeaderCell>}
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
                        dataAuth?.permisos_cliente[0].modificar == 1 ||
                          dataAuth?.permisos_cliente[0].eliminar == 1 ?
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
                      filteredCustomer?.map(customer => (
                        <Table.Row key={customer.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {customer.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("codigo_cliente") &&
                            <Table.Cell>
                              {customer.codigo_cliente}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("nombre_cliente") &&
                            <Table.Cell>
                              {customer.nombre_cliente}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("direccion_cliente") &&
                            <Table.Cell>
                              {customer.direccion_cliente}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("correo_cliente") &&
                            <Table.Cell>
                              {customer.correo_cliente}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("telefono_cliente") &&
                            <Table.Cell>
                              {customer.telefono_cliente}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("celular_cliente") &&
                            <Table.Cell>
                              {customer.celular_cliente}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("ruc") &&
                            <Table.Cell>
                              {customer.ruc}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("contacto") &&
                            <Table.Cell>
                              {customer.contacto}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("estado") &&
                            <Table.Cell>
                              <Badge color={`${customer.estado == 1 ? "green" : "red"}`}>
                                {
                                  customer.estado == 1 ? "Activo" : "Inactivo"
                                }
                              </Badge>
                            </Table.Cell>
                          }

                          {
                            showFields.includes("termino_venta") &&
                            <Table.Cell>
                              {customer.termino_venta}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("limite_credito") &&
                            <Table.Cell>
                              {formatCurrency(customer.limite_credito)}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(customer.fecha_creacion)}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {customer.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                              {customer.nombre_usuario_modificador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_cliente[0].modificar == 1 ||
                              dataAuth!.permisos_cliente[0].eliminar == 1 ?
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
                                        dataAuth?.permisos_cliente[0].modificar == 1 &&
                                        (
                                          <>
                                            <DropdownMenu.Item
                                              color="gray"
                                              className="flex items-center justify-center"
                                              onClick={() => {
                                                setEditingCustomer(customer)
                                                setOpenDialogEditCustomer(!openDialogEditCustomer)
                                                refetch()

                                                if (openDialogEditCustomer) {
                                                  navigate(location.pathname, { replace: true })
                                                  setOpenDialogEditCustomer(!openDialogEditCustomer)
                                                  refetch()
                                                }
                                                else {
                                                  navigate(location.pathname + `?editCustomers=${customer.id}`)
                                                  refetch()
                                                }
                                              }}
                                            >
                                              <Edit className="size-4" />
                                              Modificar cliente
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Separator />
                                          </>
                                        )
                                      }

                                      {
                                        dataAuth?.permisos_cliente[0].eliminar == 1 &&
                                        (
                                          <DropdownMenu.Item
                                            color="red"
                                            className="flex items-center justify-center"
                                            onClick={() => {
                                              setDeletedCustomer(customer)
                                            }}
                                          >
                                            <Trash2 className="size-4 text-red hover:text-white" />
                                            Eliminar cliente
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
                        filteredCustomer?.length == 0 &&
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
                      deletedCustomer && (
                        <DeleteCustomerAlertDialog customer={deletedCustomer} onClose={() => setDeletedCustomer(null)} />
                      )
                    }

                    {
                      editingCustomer && (
                        <Dialog.Root open={openDialogEditCustomer} onOpenChange={() => {
                          setOpenDialogEditCustomer(!openDialogEditCustomer)
                          refetch()
                          if (openDialogEditCustomer) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          <EditCustomer customer={{ ...editingCustomer, usuario_modificador: "default_value" }} onClose={() => setEditingCustomer(null)} />
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