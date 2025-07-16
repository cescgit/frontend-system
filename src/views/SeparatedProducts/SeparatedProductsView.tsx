import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import Loader from "../../components/Loader"
import { AppWindow, ArrowLeftRight, Edit, Ellipsis, ListRestart, Loader2, Search, Trash2 } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatCurrency, formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { AuthPermissions } from "../../types/authData"
import { SeparatedProductFormDataDelete, SeparatedProductFormDataInfo } from "../../types/separatedProductsData"
import { getSeparatedProducts } from "../../api/SeparatedProductAPI"
import ToogleFieldsDialogSeparatedProducts from "../../components/SeparatedProducts/ToogleFieldsDialogSeparatedProducts"
import ModalViewSeparatedProduct from "../../components/SeparatedProducts/ModalViewSeparatedProduct"
import DeleteSeparatedProductAlertDialog from "../../components/SeparatedProducts/DeleteSeparatedProductAlertDialog"
import CreateSeparatedProduct from "../../components/SeparatedProducts/CreateSeparatedProduct"
import EditSeparatedProduct from "../../components/SeparatedProducts/EditSeparatedProduct"
import CreateSalesFromSeparatedProduct from "../../components/SeparatedProducts/CreateSalesFromSeparatedProduct"
import RestoredSeparatedProductAlertDialog from "../../components/SeparatedProducts/RestoredSeparatedProductAlertDialog"

export default function SeparatedProductsView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const modalViewSeparetedProduct = queryParams.get("viewSeparetedProduct");
  const showViewModalSeparetedProduct = modalViewSeparetedProduct ? true : false;

  const modalEditSeparetedProduct = queryParams.get("editSeparetedProduct");
  const showEditModal = modalEditSeparetedProduct ? true : false;

  const modalCreateSalesFromSeparetedProduct = queryParams.get("createBilling");
  const showCreateSaleModal = modalCreateSalesFromSeparetedProduct ? true : false;

  const modalCreatePreInvoicingFromSeparetedProduct = queryParams.get("createPreInvoicing");
  const showCreatePreInvoicingModal = modalCreatePreInvoicingFromSeparetedProduct ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["separatedProducts"],
    queryFn: getSeparatedProducts,
  })

  const [numeroApartado, setNumeroApartado] = useState("")

  const [openDialogEditSeparatedProduct, setOpenDialogEditSeparatedProduct] = useState(showEditModal)
  const [openDialogCreateSalesFromSeparatedProduct, setOpenDialogCreateSalesFromSeparatedProduct] = useState(showCreateSaleModal)
  const [openDialogCreatePreInvoicingFromSeparatedProduct, setOpenDialogCreatePreInvoicingFromSalesQuote] = useState(showCreatePreInvoicingModal)
  const [openDialogViewSeparatedProduct, setOpenDialogViewSeparatedProduct] = useState(showViewModalSeparetedProduct)

  const [searchTerm, setSearchTerm] = useState("")

  const [viewSeparatedProduct, setViewSeparatedProduct] = useState<SeparatedProductFormDataInfo | null>(null);
  const [editingSeparatedProduct, setEditingSeparatedProduct] = useState<SeparatedProductFormDataInfo | null>(null);
  const [createSalesFromSeparatedProduct, setCreateSalesFromSeparatedProduct] = useState<SeparatedProductFormDataInfo | null>(null);
  const [createPreInvoicingFromSalesQuote, setCreatePreInvoicingFromSalesQuote] = useState<SeparatedProductFormDataInfo | null>(null);
  const [deletedSeparatedProduct, setDeletedSeparatedProduct] = useState<SeparatedProductFormDataDelete | null>(null);
  const [restoredSeparatedProduct, setRestoredSeparatedProduct] = useState<SeparatedProductFormDataDelete | null>(null);
  const [showFields, setShowFields] = useState<string[]>([
    "numero_apartado",
    "termino",
    "observaciones",
    "subtotal",
    "total",
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
    if (!modalCreateSalesFromSeparetedProduct) {
      setOpenDialogCreateSalesFromSeparatedProduct(false);
    }

  }, [modalCreateSalesFromSeparetedProduct])

  const filteredSalesQuote = data?.filter(separatedProduct =>
    Object.values(separatedProduct).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  console.log(createPreInvoicingFromSalesQuote)

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
                    dataAuth?.permisos_producto_apartado[0].guardar == 1 && (<CreateSeparatedProduct dataAuth={dataAuth} />)
                  }

                  <ToogleFieldsDialogSeparatedProducts showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("numero_apartado") && <Table.ColumnHeaderCell>N. de apartado</Table.ColumnHeaderCell>}
                      {showFields.includes("termino") && <Table.ColumnHeaderCell>Termino</Table.ColumnHeaderCell>}
                      {showFields.includes("observaciones") && <Table.ColumnHeaderCell>Observaciones</Table.ColumnHeaderCell>}
                      {showFields.includes("total") && <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>}
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
                        dataAuth?.permisos_producto_apartado[0].modificar == 1 ||
                          dataAuth?.permisos_producto_apartado[0].eliminar == 1 ||
                          dataAuth?.permisos_producto_apartado[0].reporte == 1 ?
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
                      filteredSalesQuote?.map(separatedProduct => (
                        <Table.Row key={separatedProduct.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {separatedProduct.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("numero_apartado") &&
                            <Table.Cell>
                              {separatedProduct.numero_apartado}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("termino") &&
                            <Table.Cell>
                              {separatedProduct.termino}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("observaciones") &&
                            <Table.Cell>
                              {separatedProduct.observaciones}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("total") &&
                            <Table.Cell>
                              {formatCurrency(separatedProduct.total)}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("estado") &&
                            <Table.Cell>
                              <Badge color={`${separatedProduct.estado == 1 && separatedProduct.facturacion == 1 || separatedProduct.estado == 1 && separatedProduct.prefacturacion == 1 || separatedProduct.estado == 1 ? "green" : "red"}`}>
                                {
                                  separatedProduct.estado == 1 && separatedProduct.facturacion == 0 && separatedProduct.prefacturacion == 0 ? "Vigente"
                                    :
                                    separatedProduct.estado == 1 && separatedProduct.facturacion == 1 ? "Facturado"
                                      :
                                      separatedProduct.estado == 1 && separatedProduct.prefacturacion == 1 ? "Prefacturado"
                                        :
                                        separatedProduct.estado == 0 && "Anulada"
                                }
                              </Badge>
                            </Table.Cell>
                          }

                          {
                            showFields.includes("prefacturacion") &&
                            <Table.Cell>
                              <input
                                className={`cursor-not-allowed ${separatedProduct.prefacturacion == 1 ? "accent-cyan-600" : ""}`}
                                type="checkbox"
                                name=""
                                id=""
                                checked={separatedProduct.prefacturacion == 1 ? true : false}
                                readOnly
                              />
                            </Table.Cell>
                          }

                          {
                            showFields.includes("facturacion") &&
                            <Table.Cell>
                              <input
                                className={`cursor-not-allowed ${separatedProduct.facturacion == 1 ? "accent-cyan-600" : ""}`}
                                type="checkbox"
                                name=""
                                id=""
                                checked={separatedProduct.facturacion == 1 ? true : false}
                                readOnly
                              />
                            </Table.Cell>
                          }

                          {
                            showFields.includes("impuesto") &&
                            <Table.Cell>
                              {separatedProduct.impuesto_manual![0].porcentaje}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("cliente") &&
                            <Table.Cell>
                              {separatedProduct.cliente}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(separatedProduct.fecha_creacion)}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {separatedProduct.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                              {separatedProduct.nombre_usuario_modificador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_producto_apartado[0].modificar == 1 ||
                              dataAuth.permisos_producto_apartado[0].eliminar == 1 ||
                              dataAuth.permisos_producto_apartado[0].reporte == 1 ?
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
                                          setViewSeparatedProduct({ ...separatedProduct, detalle_producto_apartado: [] })

                                          setOpenDialogViewSeparatedProduct(!openDialogViewSeparatedProduct)
                                          refetch()

                                          if (openDialogViewSeparatedProduct) {
                                            navigate(location.pathname, { replace: true })
                                            setOpenDialogViewSeparatedProduct(!openDialogViewSeparatedProduct)
                                            refetch()
                                          }
                                          else {
                                            navigate(location.pathname + `?viewSeparatedProduct=${separatedProduct.id}`)
                                          }
                                        }}
                                      >
                                        <AppWindow className="size-5" />
                                        <span>Ver apartado</span>
                                      </DropdownMenu.Item>

                                      {
                                        dataAuth.permisos_producto_apartado[0].modificar == 1 &&
                                          separatedProduct.facturacion == 0 &&
                                          separatedProduct.prefacturacion == 0
                                          ?
                                          (
                                            <>
                                              <DropdownMenu.Separator />

                                              <DropdownMenu.Item
                                                color="gray"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  setEditingSeparatedProduct({ ...separatedProduct, detalle_producto_apartado: [] })

                                                  setOpenDialogEditSeparatedProduct(!openDialogEditSeparatedProduct)
                                                  refetch()

                                                  if (openDialogEditSeparatedProduct) {
                                                    navigate(location.pathname, { replace: true })
                                                    setOpenDialogEditSeparatedProduct(!openDialogEditSeparatedProduct)
                                                    refetch()
                                                  }
                                                  else {
                                                    navigate(location.pathname + `?editSeparatedProduct=${separatedProduct.id}`)
                                                  }
                                                }}
                                              >
                                                <Edit className="size-4" />
                                                <span>Editar el apartado</span>
                                              </DropdownMenu.Item>
                                            </>
                                          )
                                          :
                                          (null)
                                      }

                                      {
                                        dataAuth.permisos_producto_apartado[0].eliminar == 1 &&
                                          separatedProduct.facturacion == 0 &&
                                          separatedProduct.prefacturacion == 0 &&
                                          separatedProduct.estado == 1
                                          ?
                                          (
                                            <>
                                              <DropdownMenu.Separator />
                                              <DropdownMenu.Item
                                                color="red"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  refetch();
                                                  setDeletedSeparatedProduct(separatedProduct)
                                                }}
                                              >
                                                <Trash2 className="size-4 text-red hover:text-white" />
                                                Anular apartado
                                              </DropdownMenu.Item>
                                            </>
                                          )
                                          :
                                          (
                                            null
                                          )
                                      }

                                      {
                                        dataAuth.permisos_producto_apartado[0].eliminar == 1 &&
                                          separatedProduct.facturacion == 0 &&
                                          separatedProduct.prefacturacion == 0 &&
                                          separatedProduct.estado == 0
                                          ?
                                          (
                                            <>
                                              <DropdownMenu.Separator />
                                              <DropdownMenu.Item
                                                color="green"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  refetch();
                                                  setRestoredSeparatedProduct(separatedProduct)
                                                }}
                                              >
                                                <ListRestart className="size-4 text-red hover:text-white" />
                                                Restaurar apartado
                                              </DropdownMenu.Item>
                                            </>
                                          )
                                          :
                                          (
                                            null
                                          )
                                      }

                                      {
                                        separatedProduct.facturacion == 0 &&
                                        separatedProduct.prefacturacion == 0 &&
                                        separatedProduct.estado == 1 &&
                                        (
                                          <>
                                            <DropdownMenu.Separator />

                                            <DropdownMenu.Item
                                              color="gray"
                                              className="flex items-center justify-center"
                                              onClick={() => {
                                                setCreateSalesFromSeparatedProduct({ ...separatedProduct, detalle_producto_apartado: [] })
                                                setNumeroApartado(separatedProduct.numero_apartado);
                                                setOpenDialogCreateSalesFromSeparatedProduct(!openDialogCreateSalesFromSeparatedProduct)
                                                refetch()

                                                if (openDialogCreateSalesFromSeparatedProduct) {
                                                  navigate(location.pathname, { replace: true })
                                                  setOpenDialogCreateSalesFromSeparatedProduct(!openDialogCreateSalesFromSeparatedProduct)
                                                  refetch()
                                                }
                                                else {
                                                  navigate(location.pathname + `?createBilling=${separatedProduct.id}&separatedProdut`)
                                                }
                                              }}
                                            >
                                              <ArrowLeftRight className="size-4" />
                                              <span>Convertir apartado a facturación</span>
                                            </DropdownMenu.Item>
                                          </>
                                        )
                                      }

                                      {
                                        separatedProduct.facturacion == 0 &&
                                          separatedProduct.prefacturacion == 0 &&
                                          separatedProduct.estado == 1 ?
                                          (
                                            <>
                                              <DropdownMenu.Separator />

                                              <DropdownMenu.Item
                                                color="gray"
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                  setCreatePreInvoicingFromSalesQuote({ ...separatedProduct, detalle_producto_apartado: [] })

                                                  setOpenDialogCreatePreInvoicingFromSalesQuote(!openDialogCreatePreInvoicingFromSeparatedProduct)
                                                  refetch()

                                                  if (openDialogCreatePreInvoicingFromSeparatedProduct) {
                                                    navigate(location.pathname, { replace: true })
                                                    setOpenDialogCreatePreInvoicingFromSalesQuote(!openDialogCreatePreInvoicingFromSeparatedProduct)
                                                    refetch()
                                                  }
                                                  else {
                                                    navigate(location.pathname + `?createPreInvoicing=${separatedProduct.id}`)
                                                  }
                                                }}
                                              >
                                                <ArrowLeftRight className="size-4" />
                                                <span>Convertir apartado a prefacturación</span>
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
                      openDialogEditSeparatedProduct && (
                        <Dialog.Root open={openDialogEditSeparatedProduct} onOpenChange={() => {
                          setOpenDialogEditSeparatedProduct(!openDialogEditSeparatedProduct)
                          refetch()
                          if (openDialogEditSeparatedProduct) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          {
                            editingSeparatedProduct &&
                            <EditSeparatedProduct
                              separatedProduct={{ ...editingSeparatedProduct, usuario_modificador: "default_values", detalle_producto_apartado: [] }}
                              dataAuth={dataAuth}
                              onClose={() => setEditingSeparatedProduct(null)}
                            />
                          }
                        </Dialog.Root>
                      )
                    }

                    {
                      openDialogCreateSalesFromSeparatedProduct && (
                        <Dialog.Root open={openDialogCreateSalesFromSeparatedProduct} onOpenChange={() => {
                          setOpenDialogCreateSalesFromSeparatedProduct(!openDialogEditSeparatedProduct)
                          refetch()
                          if (openDialogCreateSalesFromSeparatedProduct) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          {
                            createSalesFromSeparatedProduct &&
                            <CreateSalesFromSeparatedProduct
                              separatedProduct={createSalesFromSeparatedProduct}
                              numero_apartado={numeroApartado}
                              dataAuth={dataAuth}
                            />
                          }
                        </Dialog.Root>
                      )
                    }

                    {
                      deletedSeparatedProduct && (
                        <DeleteSeparatedProductAlertDialog separatedProduct={deletedSeparatedProduct} onClose={() => setDeletedSeparatedProduct(null)} />
                      )
                    }

                    {
                      restoredSeparatedProduct && (
                        <RestoredSeparatedProductAlertDialog separatedProduct={restoredSeparatedProduct} onClose={() => setRestoredSeparatedProduct(null)} />
                      )
                    }

                    {
                      openDialogViewSeparatedProduct && (
                        <Dialog.Root open={openDialogViewSeparatedProduct} onOpenChange={() => {
                          setOpenDialogViewSeparatedProduct(!openDialogViewSeparatedProduct)
                          refetch()
                          if (openDialogViewSeparatedProduct) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          {
                            viewSeparatedProduct &&
                            <ModalViewSeparatedProduct separatedProduct={viewSeparatedProduct!} />
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