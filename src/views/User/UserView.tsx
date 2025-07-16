import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../../api/UserAPI"
import { useState } from "react"
import { PermissionsUserFormData, UserFormDataDelete, UserFormDataInfo } from "../../types/userData"
import Loader from "../../components/Loader"
import { Ellipsis, Loader2, Search, Trash2, UserPenIcon, UserRoundCog } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import CreateUser from "../../components/User/CreateUser"
import { formatDate } from "../../utils/utils"
import DeleteUserAlertDialog from "../../components/User/DeleteUserAlertDialog"
import EditUser from "../../components/User/EditUser"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import CreateOrEditPermissionsUser from "../../components/User/CreateOrEditPermissionsUser"
import { AuthPermissions } from "../../types/authData"
import ToogleFieldsDialogUser from "../../components/User/ToogleFieldsDialogUser"

export default function UserView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalEditUser = queryParams.get("editUser");
  const showEditModal = modalEditUser ? true : false;
  const modalPermissionsUser = queryParams.get("permissionsUser");
  const showPermissionsModal = modalPermissionsUser ? true : false;


  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [openDialogEditUser, setOpenDialogEditUser] = useState(showEditModal)
  const [openDialogPermissionsUser, setOpenDialogPermissionsUser] = useState(showPermissionsModal)


  const [editingUser, setEditingUser] = useState<UserFormDataInfo | null>(null)
  const [deletedUser, setDeletedUser] = useState<UserFormDataDelete | null>(null)
  const [permissionsUser, setPermissionsUser] = useState<PermissionsUserFormData | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "nombre_usuario",
    "cedula_usuario",
    "celular_usuario",
    "correo_usuario",
    "tipo_usuario",
    "estado",
    "fecha_creacion",
    "nombre_usuario_creador",
    "nombre_usuario_modificador",
  ])

  const filteredUsers = data?.filter(user =>
    Object.values(user).some(value =>
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
                    dataAuth?.permisos_usuario[0].guardar == 1 && (<CreateUser />)
                  }

                  <ToogleFieldsDialogUser showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("nombre_usuario") && <Table.ColumnHeaderCell>Usuario</Table.ColumnHeaderCell>}
                      {showFields.includes("cedula_usuario") && <Table.ColumnHeaderCell>Cédula</Table.ColumnHeaderCell>}
                      {showFields.includes("celular_usuario") && <Table.ColumnHeaderCell>Celular</Table.ColumnHeaderCell>}
                      {showFields.includes("correo_usuario") && <Table.ColumnHeaderCell>Correo</Table.ColumnHeaderCell>}
                      {showFields.includes("tipo_usuario") && <Table.ColumnHeaderCell>Rol</Table.ColumnHeaderCell>}
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
                        dataAuth?.permisos_usuario[0].modificar == 1 ||
                          dataAuth?.permisos_usuario[0].eliminar == 1 ?
                          (
                            <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                          )
                          :
                          (null)
                      }
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {
                      filteredUsers?.map(user => (
                        <Table.Row key={user.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {user.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("nombre_usuario") &&
                            <Table.Cell>
                              {user.nombre_usuario}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("cedula_usuario") &&
                            <Table.Cell>
                              {user.cedula_usuario}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("celular_usuario") &&
                            <Table.Cell>
                              {user.celular_usuario}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("correo_usuario") &&
                            <Table.Cell>
                              {user.correo_usuario}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("tipo_usuario") &&
                            <Table.Cell>
                              {user.tipo_usuario}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("estado") &&
                            <Table.Cell>
                              <Badge color={`${user.estado == 1 ? "green" : "red"}`}>
                                {
                                  user.estado == 1 ? "Activo" : "Inactivo"
                                }
                              </Badge>
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(user.fecha_creacion)}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {user.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                              {user.nombre_usuario_modificador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_usuario[0].modificar == 1 ||
                              dataAuth!.permisos_usuario[0].eliminar == 1 ?
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
                                        dataAuth?.permisos_usuario[0].modificar == 1 &&
                                        (
                                          <DropdownMenu.Item
                                            color="gray"
                                            className="flex items-center justify-center"
                                            onClick={() => {
                                              setEditingUser(user)
                                              setOpenDialogEditUser(!openDialogEditUser)
                                              refetch()

                                              if (openDialogEditUser) {
                                                navigate(location.pathname, { replace: true })
                                                setOpenDialogEditUser(!openDialogEditUser)
                                                refetch()
                                              }
                                              else {
                                                navigate(location.pathname + `?editUser=${user.id}`)
                                                refetch()
                                              }
                                            }}
                                          >
                                            <UserPenIcon className="size-4" />
                                            Modificar usuario
                                          </DropdownMenu.Item>
                                        )
                                      }


                                      {
                                        dataAuth?.permisos_usuario[0].guardar == 1 || dataAuth!.permisos_usuario[0].modificar == 1 ?
                                          (
                                            <>
                                              <DropdownMenu.Separator />
                                              <DropdownMenu.Item
                                                color="gray"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  setPermissionsUser(permissionsUser)
                                                  setOpenDialogPermissionsUser(!openDialogPermissionsUser)
                                                  refetch()

                                                  if (openDialogPermissionsUser) {
                                                    navigate(location.pathname, { replace: true })
                                                    setOpenDialogPermissionsUser(!openDialogPermissionsUser)
                                                    refetch()
                                                  }
                                                  else {
                                                    navigate(location.pathname + `?permissionsUser=${user.id}`)
                                                    refetch()
                                                  }
                                                }}
                                              >
                                                <UserRoundCog className="size-4" />
                                                Asignar permisos
                                              </DropdownMenu.Item>
                                            </>
                                          )
                                          :
                                          (null)
                                      }

                                      {                                        
                                          user.tipo_usuario != import.meta.env.VITE_TYPEFROM_USER &&
                                            dataAuth!.permisos_usuario[0].eliminar == 1 ?
                                            (
                                              <>
                                                <DropdownMenu.Separator />
                                                <DropdownMenu.Item
                                                  color="red"
                                                  className="flex items-center justify-center"
                                                  onClick={() => {
                                                    setDeletedUser(user)
                                                  }}
                                                >
                                                  <Trash2 className="size-4 text-red hover:text-white" />
                                                  Eliminar usuario
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
                        filteredUsers?.length == 0 &&
                        (
                          <Table.Cell colSpan={8}>
                            <div className="flex items-center flex-col justify-center">
                              <NotFoundEmpty />
                              <p className='text-center font-bold text-3xl'>No se encontraron resultados...</p>
                            </div>
                          </Table.Cell>
                        )
                      }
                    </Table.Row>

                    {
                      deletedUser && (
                        <DeleteUserAlertDialog user={deletedUser} onClose={() => setDeletedUser(null)} />
                      )
                    }

                    {
                      editingUser && (
                        <Dialog.Root open={openDialogEditUser} onOpenChange={() => {
                          setOpenDialogEditUser(!openDialogEditUser)
                          refetch()

                          if (openDialogEditUser) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          <EditUser user={{ ...editingUser, usuario_modificador: "default_value" }} onClose={() => setEditingUser(null)} />
                        </Dialog.Root>
                      )
                    }

                    {
                      openDialogPermissionsUser && (
                        <Dialog.Root open={openDialogPermissionsUser} onOpenChange={() => {
                          setOpenDialogPermissionsUser(!openDialogPermissionsUser)
                          refetch()

                          if (openDialogPermissionsUser) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          <CreateOrEditPermissionsUser />
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