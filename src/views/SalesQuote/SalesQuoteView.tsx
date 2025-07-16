import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import Loader from "../../components/Loader"
import { AppWindow, ArrowLeftRight, Edit, Ellipsis, Loader2, Search, Trash2 } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatCurrency, formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { SalesQuoteFormDataDelete, SalesQuoteFormDataInfo } from "../../types/salesQuoteData"
import { getSalesQuote } from "../../api/SalesQuoteAPI"
import ToogleFieldsDialogSalesQuote from "../../components/SalesQuote/ToogleFieldsDialogSalesQuote"
import CreateSalesQuote from "../../components/SalesQuote/CreateSalesQuote"
import ModalViewSalesQuote from "../../components/SalesQuote/ModalViewSalesQuote"
import EditSalesQuote from "../../components/SalesQuote/EditSalesQuote"
import DeleteSalesQuoteAlertDialog from "../../components/SalesQuote/DeleteSalesQuoteAlertDialog"
import ReportSalesQuoteById from "../../components/SalesQuote/Report/ReportSalesQuoteById"
import ExcelSalesQuoteById from "../../components/SalesQuote/Excel/ExcelSalesQuoteById"
import CreateSalesFromSalesQuote from "../../components/SalesQuote/CreateSalesFromSalesQuote"
import ReactivateSalesQuoteAlertDialog from "../../components/SalesQuote/ReactivateSalesQuote"
import CreatePreInvoicingFromSalesQuote from "../../components/SalesQuote/CreatePreInvoicingFromSalesQuote"

export default function SalesQuoteView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const dateNow = new Date();

  const modalViewSalesQuote = queryParams.get("viewSalesQuote");
  const showViewModalSalesQuote = modalViewSalesQuote ? true : false;

  const modalEditSalesQuote = queryParams.get("editSalesQuote");
  const showEditModal = modalEditSalesQuote ? true : false;

  const modalCreateSalesFromSalesQuote = queryParams.get("createBilling");
  const showCreateSaleModal = modalCreateSalesFromSalesQuote ? true : false;

  const modalCreatePreInvoicingFromSalesQuote = queryParams.get("createPreInvoicing");
  const showCreatePreInvoicingModal = modalCreatePreInvoicingFromSalesQuote ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["salesQuote"],
    queryFn: getSalesQuote,
  })

  const [numeroCotizacion, setNumeroCotizacion] = useState("")

  const [openDialogEditSalesQuote, setOpenDialogEditSalesQuote] = useState(showEditModal)
  const [openDialogCreateSalesFromSalesQuote, setOpenDialogCreateSalesFromSalesQuote] = useState(showCreateSaleModal)
  const [openDialogCreatePreInvoicingFromSalesQuote, setOpenDialogCreatePreInvoicingFromSalesQuote] = useState(showCreatePreInvoicingModal)
  const [openDialogViewSalesQuote, setOpenDialogViewSalesQuote] = useState(showViewModalSalesQuote)

  const [searchTerm, setSearchTerm] = useState("")

  const [viewSalesQuote, setViewSalesQuote] = useState<SalesQuoteFormDataInfo | null>(null);
  const [editingSalesQuote, setEditingSalesQuote] = useState<SalesQuoteFormDataInfo | null>(null);
  const [createSalesFromSalesQuote, setCreateSalesFromSalesQuote] = useState<SalesQuoteFormDataInfo | null>(null);
  const [createPreInvoicingFromSalesQuote, setCreatePreInvoicingFromSalesQuote] = useState<SalesQuoteFormDataInfo | null>(null);
  const [deletedSalesQuote, setDeletedSalesQuote] = useState<SalesQuoteFormDataDelete | null>(null);
  const [reactivateSalesQuote, setReactivateSalesQuote] = useState<SalesQuoteFormDataDelete | null>(null);
  const [showFields, setShowFields] = useState<string[]>([
    "numero_cotizacion",
    "termino",
    "observaciones",
    "subtotal",
    "total",
    "dias",
    "fecha_finalizacion",
    "estado",
    "prefacturacion",
    "facturacion",
    "impuesto",
    "cliente",
    "fecha_creacion",
    "nombre_usuario_creador",
    "nombre_usuario_modificador"
  ])

  useEffect(() => {
    if (!modalCreateSalesFromSalesQuote) {
      setOpenDialogCreateSalesFromSalesQuote(false);
    }

  }, [modalCreateSalesFromSalesQuote])

  const filteredSalesQuote = data?.filter(salesQuote =>
    Object.values(salesQuote).some(value =>
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
                    dataAuth?.permisos_cotizacion_venta[0].guardar == 1 && (<CreateSalesQuote dataAuth={dataAuth} />)
                  }

                  <ToogleFieldsDialogSalesQuote showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("numero_cotizacion") && <Table.ColumnHeaderCell>N. de proforma</Table.ColumnHeaderCell>}
                      {showFields.includes("termino") && <Table.ColumnHeaderCell>Termino</Table.ColumnHeaderCell>}
                      {showFields.includes("observaciones") && <Table.ColumnHeaderCell>Observaciones</Table.ColumnHeaderCell>}
                      {showFields.includes("total") && <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>}
                      {showFields.includes("dias") && <Table.ColumnHeaderCell>Días</Table.ColumnHeaderCell>}
                      {showFields.includes("fecha_finalizacion") && <Table.ColumnHeaderCell>Fecha vencimiento</Table.ColumnHeaderCell>}
                      {showFields.includes("estado") && <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>}
                      {showFields.includes("prefacturacion") && <Table.ColumnHeaderCell>Prefacturación</Table.ColumnHeaderCell>}
                      {showFields.includes("facturacion") && <Table.ColumnHeaderCell>Facturación</Table.ColumnHeaderCell>}
                      {showFields.includes("impuesto") && <Table.ColumnHeaderCell>Impuesto</Table.ColumnHeaderCell>}
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
                        dataAuth?.permisos_cotizacion_venta[0].modificar == 1 ||
                          dataAuth?.permisos_cotizacion_venta[0].eliminar == 1 ||
                          dataAuth?.permisos_cotizacion_venta[0].reporte == 1 ?
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
                      filteredSalesQuote?.map(salesQuote => (
                        <Table.Row key={salesQuote.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {salesQuote.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("numero_cotizacion") &&
                            <Table.Cell>
                              {salesQuote.numero_cotizacion}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("termino") &&
                            <Table.Cell>
                              {salesQuote.termino}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("observaciones") &&
                            <Table.Cell>
                              {salesQuote.observaciones}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("total") &&
                            <Table.Cell>
                              {formatCurrency(salesQuote.total)}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("dias") &&
                            <Table.Cell>
                              {salesQuote.dias}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_finalizacion") &&
                            <Table.Cell className="text-red-500">
                              {formatDate(salesQuote.fecha_finalizacion)}
                            </Table.Cell>
                          }                          

                          {
                            showFields.includes("estado") &&
                            <Table.Cell>
                              <Badge color={`${salesQuote.estado == 1 && salesQuote.facturacion == 1 || salesQuote.estado == 1 && salesQuote.prefacturacion == 1 || salesQuote.estado == 1 ? "green" : "red"}`}>
                                {
                                  salesQuote.estado == 1 && salesQuote.facturacion == 0 && salesQuote.prefacturacion == 0 ? "Vigente"
                                    :
                                    salesQuote.estado == 1 && salesQuote.facturacion == 1 ? "Facturado"
                                      :
                                      salesQuote.estado == 1 && salesQuote.prefacturacion == 1 ? "Prefacturado"
                                        :
                                        salesQuote.estado == 0 && formatDate(dateNow.toString()) > formatDate(salesQuote.fecha_finalizacion) ? "Vencida"
                                          :
                                          salesQuote.estado == 0 && "Anulada"
                                }
                              </Badge>
                            </Table.Cell>
                          }

                          {
                            showFields.includes("prefacturacion") &&
                            <Table.Cell>
                              <input
                                className={`cursor-not-allowed ${salesQuote.prefacturacion == 1 ? "accent-cyan-600" : ""}`}
                                type="checkbox"
                                name=""
                                id=""
                                checked={salesQuote.prefacturacion == 1 ? true : false}
                                readOnly
                              />
                            </Table.Cell>
                          }

                          {
                            showFields.includes("facturacion") &&
                            <Table.Cell>
                              <input
                                className={`cursor-not-allowed ${salesQuote.facturacion == 1 ? "accent-cyan-600" : ""}`}
                                type="checkbox"
                                name=""
                                id=""
                                checked={salesQuote.facturacion == 1 ? true : false}
                                readOnly
                              />
                            </Table.Cell>
                          }

                          {
                            showFields.includes("impuesto") &&
                            <Table.Cell>
                              {salesQuote.impuesto_manual![0].porcentaje}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("cliente") &&
                            <Table.Cell>
                              {salesQuote.cliente}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(salesQuote.fecha_creacion)}
                            </Table.Cell>
                          }

                           {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {salesQuote.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                              {salesQuote.nombre_usuario_modificador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_cotizacion_venta[0].modificar == 1 ||
                              dataAuth.permisos_cotizacion_venta[0].eliminar == 1 ||
                              dataAuth.permisos_cotizacion_venta[0].reporte == 1 ?
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
                                          setViewSalesQuote({ ...salesQuote, detalle_cotizacion_venta: [] })

                                          setOpenDialogViewSalesQuote(!openDialogViewSalesQuote)
                                          refetch()

                                          if (openDialogViewSalesQuote) {
                                            navigate(location.pathname, { replace: true })
                                            setOpenDialogViewSalesQuote(!openDialogViewSalesQuote)
                                            refetch()
                                          }
                                          else {
                                            navigate(location.pathname + `?viewSalesQuote=${salesQuote.id}`)
                                          }
                                        }}
                                      >
                                        <AppWindow className="size-5" />
                                        <span>Ver proforma</span>
                                      </DropdownMenu.Item>

                                      {
                                        dataAuth.permisos_cotizacion_venta[0].modificar == 1 &&
                                          salesQuote.facturacion == 0 && salesQuote.prefacturacion == 0 ||
                                          salesQuote.estado == 1 && salesQuote.facturacion == 0 && salesQuote.prefacturacion == 0 ||
                                          salesQuote.estado == 0 && formatDate(dateNow.toString()) < formatDate(salesQuote.fecha_finalizacion) &&
                                          dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER
                                          ?
                                          (
                                            <>
                                              <DropdownMenu.Separator />

                                              <DropdownMenu.Item
                                                color="gray"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  setEditingSalesQuote({ ...salesQuote, detalle_cotizacion_venta: [] })

                                                  setOpenDialogEditSalesQuote(!openDialogEditSalesQuote)
                                                  refetch()

                                                  if (openDialogEditSalesQuote) {
                                                    navigate(location.pathname, { replace: true })
                                                    setOpenDialogEditSalesQuote(!openDialogEditSalesQuote)
                                                    refetch()
                                                  }
                                                  else {
                                                    navigate(location.pathname + `?editSalesQuote=${salesQuote.id}`)
                                                  }
                                                }}
                                              >
                                                <Edit className="size-4" />
                                                <span>Editar proforma</span>
                                              </DropdownMenu.Item>
                                            </>
                                          )
                                          :
                                          (null)
                                      }

                                      {
                                        dataAuth.permisos_cotizacion_venta[0].eliminar == 1 &&
                                          salesQuote.facturacion == 0 && salesQuote.prefacturacion == 0 &&
                                          salesQuote.estado == 1
                                          ?
                                          (
                                            <>
                                              <DropdownMenu.Separator />
                                              <DropdownMenu.Item
                                                color="red"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  refetch();
                                                  setDeletedSalesQuote(salesQuote)
                                                }}
                                              >
                                                <Trash2 className="size-4 text-red hover:text-white" />
                                                Anular proforma
                                              </DropdownMenu.Item>
                                            </>
                                          )
                                          :
                                          (
                                            null
                                          )
                                      }

                                      {
                                        dataAuth.permisos_cotizacion_venta[0].eliminar == 1 &&
                                          salesQuote.facturacion == 0 && salesQuote.prefacturacion == 0 &&
                                          salesQuote.estado == 0 && formatDate(dateNow.toString()) < formatDate(salesQuote.fecha_finalizacion) &&
                                          dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER
                                          ?
                                          (
                                            <>
                                              <DropdownMenu.Separator />
                                              <DropdownMenu.Item
                                                color="green"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  refetch();
                                                  setReactivateSalesQuote(salesQuote)
                                                }}
                                              >
                                                <Trash2 className="size-4 text-red hover:text-white" />
                                                Reactivar proforma
                                              </DropdownMenu.Item>
                                            </>
                                          )
                                          :
                                          (
                                            null
                                          )
                                      }

                                      {
                                        dataAuth?.permisos_cotizacion_venta[0].reporte == 1 &&
                                        (
                                          <>
                                            <DropdownMenu.Separator />
                                            <ReportSalesQuoteById salesQuote={{ ...salesQuote, detalle_cotizacion_venta: [] }} />
                                            <DropdownMenu.Separator />
                                            <ExcelSalesQuoteById salesQuote={{ ...salesQuote, detalle_cotizacion_venta: [] }} />
                                          </>
                                        )
                                      }

                                      {
                                        salesQuote.facturacion == 0 && salesQuote.prefacturacion == 0 &&
                                        salesQuote.estado == 1 &&
                                        (
                                          <>
                                            <DropdownMenu.Separator />

                                            <DropdownMenu.Item
                                              color="gray"
                                              className="flex items-center justify-center"
                                              onClick={() => {
                                                setCreateSalesFromSalesQuote({ ...salesQuote, detalle_cotizacion_venta: [] })                                                
                                                setNumeroCotizacion(salesQuote.numero_cotizacion);
                                                setOpenDialogCreateSalesFromSalesQuote(!openDialogCreateSalesFromSalesQuote)
                                                refetch()

                                                if (openDialogCreateSalesFromSalesQuote) {
                                                  navigate(location.pathname, { replace: true })
                                                  setOpenDialogCreateSalesFromSalesQuote(!openDialogCreateSalesFromSalesQuote)
                                                  refetch()
                                                }
                                                else {
                                                  navigate(location.pathname + `?createBilling=${salesQuote.id}&salesQuote`)
                                                }
                                              }}
                                            >
                                              <ArrowLeftRight className="size-4" />
                                              <span>Convertir proforma a facturación</span>
                                            </DropdownMenu.Item>
                                          </>
                                        )
                                      }

                                      {
                                        salesQuote.facturacion == 0 && salesQuote.prefacturacion == 0 &&
                                        salesQuote.estado == 1 &&
                                        (
                                          <>
                                            <DropdownMenu.Separator />

                                            <DropdownMenu.Item
                                              color="gray"
                                              className="flex items-center justify-center"
                                              onClick={() => {
                                                setCreatePreInvoicingFromSalesQuote({ ...salesQuote, detalle_cotizacion_venta: [] })                                                
                                                setNumeroCotizacion(salesQuote.numero_cotizacion);
                                                setOpenDialogCreatePreInvoicingFromSalesQuote(!openDialogCreatePreInvoicingFromSalesQuote)
                                                refetch()

                                                if (openDialogCreatePreInvoicingFromSalesQuote) {
                                                  navigate(location.pathname, { replace: true })
                                                  setOpenDialogCreatePreInvoicingFromSalesQuote(!openDialogCreatePreInvoicingFromSalesQuote)
                                                  refetch()
                                                }
                                                else {
                                                  navigate(location.pathname + `?createPreInvoicing=${salesQuote.id}&salesQuote`)
                                                }
                                              }}
                                            >
                                              <ArrowLeftRight className="size-4" />
                                              <span>Convertir proforma a prefacturación</span>
                                            </DropdownMenu.Item>
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
                        filteredSalesQuote?.length == 0 &&
                        (
                          <Table.Cell colSpan={11}>
                            <div className="flex items-center flex-col justify-center">
                              <NotFoundEmpty />
                              <p className='text-center font-bold text-3xl'>No se encontraron resultados...</p>
                            </div>
                          </Table.Cell>
                        )
                      }
                    </Table.Row>

                    {
                      openDialogEditSalesQuote && (
                        <Dialog.Root open={openDialogEditSalesQuote} onOpenChange={() => {
                          setOpenDialogEditSalesQuote(!openDialogEditSalesQuote)
                          refetch()
                          if (openDialogEditSalesQuote) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          {
                            editingSalesQuote &&
                            <EditSalesQuote
                              salesQuote={{ ...editingSalesQuote, usuario_modificador: "default_values", detalle_cotizacion_venta: [] }}
                              onClose={() => setEditingSalesQuote(null)}
                              dataAuth={dataAuth}
                            />
                          }
                        </Dialog.Root>
                      )
                    }

                    {
                      openDialogCreateSalesFromSalesQuote && (
                        <Dialog.Root open={openDialogCreateSalesFromSalesQuote} onOpenChange={() => {
                          setOpenDialogCreateSalesFromSalesQuote(!openDialogCreateSalesFromSalesQuote)
                          refetch()
                          if (openDialogCreateSalesFromSalesQuote) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          {
                            createSalesFromSalesQuote &&
                            <CreateSalesFromSalesQuote
                              salesQuote={createSalesFromSalesQuote!}
                              numero_cotizacion={numeroCotizacion}
                              dataAuth={dataAuth}
                            />
                          }
                        </Dialog.Root>
                      )
                    }

                    {
                      openDialogCreatePreInvoicingFromSalesQuote && (
                        <Dialog.Root open={openDialogCreatePreInvoicingFromSalesQuote} onOpenChange={() => {
                          setOpenDialogCreatePreInvoicingFromSalesQuote(!openDialogCreatePreInvoicingFromSalesQuote)
                          refetch()
                          if (openDialogCreatePreInvoicingFromSalesQuote) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          {
                            createPreInvoicingFromSalesQuote &&
                            <CreatePreInvoicingFromSalesQuote
                              salesQuote={createPreInvoicingFromSalesQuote!}
                              numero_cotizacion={numeroCotizacion}
                              dataAuth={dataAuth}
                            />
                          }
                        </Dialog.Root>
                      )
                    }

                    {
                      deletedSalesQuote && (
                        <DeleteSalesQuoteAlertDialog salesQuote={deletedSalesQuote} onClose={() => setDeletedSalesQuote(null)} />
                      )
                    }

                    {
                      reactivateSalesQuote && (
                        <ReactivateSalesQuoteAlertDialog salesQuote={reactivateSalesQuote} onClose={() => setDeletedSalesQuote(null)} />
                      )
                    }

                    {
                      openDialogViewSalesQuote && (
                        <Dialog.Root open={openDialogViewSalesQuote} onOpenChange={() => {
                          setOpenDialogViewSalesQuote(!openDialogViewSalesQuote)
                          refetch()
                          if (openDialogViewSalesQuote) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          {
                            viewSalesQuote &&
                            <ModalViewSalesQuote salesQuote={viewSalesQuote!} />
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