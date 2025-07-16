import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { AppWindowIcon, Ellipsis, Loader2, Search } from "lucide-react"
import { Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatCurrency, formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { getSales } from "../../apis/SalesAPI"
import { SalesFormDataInfo } from "../../types/salesData"
import ToogleFieldsDialogSales from "../../components/Sales/ToogleFieldsDialogSales"
import ModalViewSales from "../../components/Sales/ModalViewSales"
import CreateSales from "../../components/Sales/CreateSales"

export default function SalesView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const modalViewSales = queryParams.get("viewSales");
  const showViewModal = modalViewSales ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  })


  const [openDialogViewSales, setOpenDialogViewSales] = useState(showViewModal)


  const [searchTerm, setSearchTerm] = useState("")

  const [viewSales, setViewSales] = useState<SalesFormDataInfo | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "numero_venta",
    "termino",
    "observaciones",
    "impuesto",
    "total",
    "cliente",
    "fecha_creacion",
    "nombre_usuario_creador"
  ])

  const filteredSales = data?.filter(sales =>
    Object.values(sales).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
                    dataAuth?.permisos_venta[0].guardar == 1 && (<CreateSales dataAuth={dataAuth} />)
                  }

                  <ToogleFieldsDialogSales showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("numero_venta") && <Table.ColumnHeaderCell>N. factura</Table.ColumnHeaderCell>}
                      {showFields.includes("termino") && <Table.ColumnHeaderCell>Termino</Table.ColumnHeaderCell>}
                      {showFields.includes("observaciones") && <Table.ColumnHeaderCell>Observaciones</Table.ColumnHeaderCell>}
                      {showFields.includes("impuesto") && <Table.ColumnHeaderCell>Impuesto</Table.ColumnHeaderCell>}
                      {showFields.includes("total") && <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>}
                      {showFields.includes("cliente") && <Table.ColumnHeaderCell>Cliente</Table.ColumnHeaderCell>}
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
                        dataAuth?.permisos_venta[0].reporte == 1 ?
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
                      filteredSales?.map(sales => (
                        <Table.Row key={sales.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {sales.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("numero_venta") &&
                            <Table.Cell>
                              {sales.numero_venta}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("termino") &&
                            <Table.Cell>
                              {sales.termino}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("observaciones") &&
                            <Table.Cell>
                              {sales.observaciones}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("impuesto") &&
                            <Table.Cell>
                              {sales.impuesto_manual![0].porcentaje}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("total") &&
                            <Table.Cell>
                              {formatCurrency(sales.total)}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("cliente") &&
                            <Table.Cell>
                              {sales.cliente}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(sales.fecha_creacion)}
                            </Table.Cell>
                          }

                            {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {sales.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_compra[0].reporte == 1 ?
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
                                    <DropdownMenu.Content color="gray">
                                      <DropdownMenu.Item
                                        color="gray"
                                        className="flex items-center justify-center"
                                        onClick={() => {
                                          setViewSales({ ...sales, detalles_venta: [] })

                                          setOpenDialogViewSales(!openDialogViewSales)
                                          refetch()

                                          if (openDialogViewSales) {
                                            navigate(location.pathname, { replace: true })
                                            setOpenDialogViewSales(!openDialogViewSales)
                                            refetch()
                                          }
                                          else {
                                            navigate(location.pathname + `?viewSales=${sales.id}`)
                                          }
                                        }}
                                      >
                                        <AppWindowIcon className="size-5" />
                                        <span>Ver Factura</span>
                                      </DropdownMenu.Item>

                                      <DropdownMenu.Separator />

                                      {/* {
                                        dataAuth?.permisos_compra[0].reporte == 1 &&
                                        (
                                          <ReportBuysById sales={{ ...sales, detalles_compra: [] }} />
                                        )
                                      } */}
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
                        filteredSales?.length == 0 &&
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
                      openDialogViewSales && (
                        <Dialog.Root open={openDialogViewSales} onOpenChange={() => {
                          setOpenDialogViewSales(!openDialogViewSales)
                          refetch()
                          if (openDialogViewSales) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          {
                            modalViewSales &&
                            <ModalViewSales sales={viewSales!} />
                          }
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