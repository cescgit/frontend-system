import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductDataCombobox } from "../../types/productData";
import { getKardexByDate, getKardexById, getKardexByidAndDate } from "../../api/kardeKAPI";
import { useQuery } from "@tanstack/react-query";
import ToogleFieldsDialogKardex from "../../components/Kardex/ToogleFieldsDialogKardex";
import { Badge, Dialog, Table, Tooltip } from "@radix-ui/themes";
import NotFoundEmpty from "../../components/NotFoundEmpty";
import { formatCurrency } from "../../utils/utils";
import { Loader2 } from "lucide-react";
import ProductsKardexComboBox from "../../components/Product/ProductsKardexComboBox";
import ViewImageDialog from "../../components/Product/ViewImageDialog";
import KardexSearchIdRangeDate from "../../components/UI/KardexSearchIdRangeDate";
import ReportKardexById from "../../components/Kardex/Report/ReportKardexById";
import ReportKardexByRangeDate from "../../components/Kardex/Report/ReportKardexByRangeDate";

export default function KardexView() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalViewProduct = queryParams.get("viewKardex");
  const startDateValue = queryParams.get("startDate");
  const endDateValue = queryParams.get("endDate");
  const idValue = modalViewProduct;

  const [isKardexProductActive, setisKardexProductActive] = useState(false);
  const [isKardexRangeDateActive, setisKardexRangeDateActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [dataProducts, setDataProducts] = useState<ProductDataCombobox | null>(null)


  const [showFields, setShowFields] = useState<string[]>([
    "fecha_creacion",
    "descripcion",
    "nombre_producto",
    "tipo",
    "cantidad_entrada",
    "precio_entrada",
    "total_entrada",
    "cantidad_salida",
    "precio_salida",
    "precio_facturacion",
    "total_salida",
    "cantidad_disponible",
    "precio_disponible",
    "total_disponible"
  ])


  const [open, setOpen] = useState(false)
  const [imagenView, setImagenView] = useState<string>()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [daysDifference, setDaysDifference] = useState(0)
  const [id, setId] = useState("")


  useEffect(() => {
    setStartDate(startDateValue || "")
    setEndDate(endDateValue || "")
    setId(idValue || "")
  }, [startDateValue, endDateValue, idValue])

  useEffect(() => {
    if (modalViewProduct != null || modalViewProduct != undefined) {
      setisKardexProductActive(true);
    }
    else {
      setisKardexProductActive(false);
    }

    if (startDateValue != null && endDateValue != null || startDateValue != undefined && endDateValue != undefined) {
      setisKardexRangeDateActive(true);
    }
    else {
      setisKardexRangeDateActive(false);
    }

  }, [modalViewProduct, startDateValue, endDateValue])



  useEffect(() => {
    const differenceDatetime = new Date(endDate).getTime() - new Date(startDate).getTime();
    const differenceDateDays = differenceDatetime / (1000 * 3600 * 24);
    setDaysDifference(differenceDateDays)

    if (startDate !== "" && endDate !== "") {
      navigate(location.pathname + `?startDate=${startDate}&endDate=${endDate}`)
    }

  }, [endDate, startDate, location.pathname, navigate])

  const handleSelectionProducts = (dataProducts: ProductDataCombobox) => {
    setDataProducts(dataProducts);
    setStartDate("")
    setEndDate("")
    setDaysDifference(0)
    navigate(location.pathname + `?viewKardex=${dataProducts.id}`);

  }

  const { data: dataKardexRange, refetch: refreshRange } = useQuery({
    queryKey: ["kardex", startDate, endDate],
    queryFn: () => getKardexByDate({ startDate, endDate }),
    enabled: false,
    retry: false
  })


  const { data, refetch } = useQuery({
    queryKey: ["kardex", id],
    queryFn: () => getKardexById({ id }),
    enabled: !!id,
    retry: false
  })


  const { data: dataIdRangeDate, refetch: refreshIdRange } = useQuery({
    queryKey: ["kardex", id],
    queryFn: () => getKardexByidAndDate({ id, startDate, endDate }),
    enabled: !!id,
    retry: false
  })


  const filteredKardex = data?.filter(kardex =>
    Object.values(kardex).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const filteredKardexDateRange = dataKardexRange?.filter(kardex =>
    Object.values(kardex).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const filteredKardexIdDateRange = dataIdRangeDate?.filter(kardex =>
    Object.values(kardex).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <>
      <div className="w-[95%] h-[90%] overflow-y-auto scroll-smooth touch-pan-y">
        <div>
          <>
            <div className="mx-auto md:h-[60%] lg:h-[80%] w-full rounded-lg p-4 shadow-lg shadow-slate-300">
              <div className="border border-gray-400 w-full rounded-lg p-4 scrollbar-thin-custom overflow-y-auto scroll-smooth touch-pan-y overflow-scroll h-48">
                <h2 className="text-center top-0 font-bold">Información productos</h2>

                <div className=" flex flex-col items-center justify-center gap-y-4">
                  <div className="flex mx-auto top-0 h-[20%] w-full justify-center items-center mt-2">
                    <ProductsKardexComboBox onSelectionChange={handleSelectionProducts} />
                  </div>

                  <div className="flex items-center py-2 h-[80%] mt-8 md:mt-2 flex-col-reverse md:flex-row justify-center w-full">
                    <div className="flex flex-col items-center justify-end w-full md:w-[80%]">
                      <div className="flex flex-1 flex-col md:flex-row items-center gap-x-4 justify-between w-full">
                        <div className="flex flex-1 flex-col items-center gap-x-4 justify-between w-full">
                          <label className="w-full">Código:</label>
                          <input
                            className="w-full border border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md cursor-not-allowed"
                            value={dataProducts == null ? "" : dataProducts!.codigo}
                            disabled
                            placeholder="Código del producto..."
                          />
                        </div>

                        <div className="flex flex-1 flex-col items-center gap-x-4 justify-between w-full">
                          <label className="w-full">SAC:</label>
                          <input
                            className="w-full border border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md cursor-not-allowed"
                            value={dataProducts == null ? "" : dataProducts!.sac}
                            disabled
                            placeholder="SAC..."
                          />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col md:flex-row items-center gap-x-4 justify-between w-full">
                        <div className="flex flex-1 flex-col items-center gap-x-4 justify-between w-full">
                          <label className="w-full">Producto:</label>
                          <input
                            className="w-full border border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md cursor-not-allowed"
                            value={dataProducts == null ? "" : dataProducts!.nombre_producto}
                            disabled
                            placeholder="Producto..."
                          />
                        </div>

                        <div className="flex flex-1 flex-col items-center gap-x-4 justify-between w-full">
                          <label className="w-full">Marca:</label>
                          <input
                            className="w-full border border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md cursor-not-allowed"
                            value={dataProducts == null ? "" : dataProducts!.marca}
                            disabled
                            placeholder="Marca..."
                          />
                        </div>

                        <div className="flex flex-1 flex-col items-center gap-x-4 justify-between w-full">
                          <label className="w-full">Categoría:</label>
                          <input
                            className="w-full border border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md cursor-not-allowed"
                            value={dataProducts == null ? "" : dataProducts!.categoria}
                            disabled
                            placeholder="Categoría..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full md:w-[20%]">
                      <Tooltip content="Clic para ver la imagen">
                        {
                          dataProducts == null ? (
                            <img className="size-32 cursor-pointer" src="https://i.ibb.co/S76my9HK/Images-cuate.webp" alt="Sin imagen" />
                          )
                            :
                            (
                              <img
                                className="size-32 cursor-pointer"
                                src={`${dataProducts == null ? null : dataProducts!.imagen_url}`}
                                alt={`${dataProducts!.nombre_producto}`}
                                onClick={() => {
                                  setImagenView(dataProducts.imagen_url)
                                  setOpen(!open)
                                }}
                              />
                            )
                        }
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              {
                imagenView && (
                  <Dialog.Root open={open} onOpenChange={() => {
                    setOpen(!open)
                  }}>
                    <ViewImageDialog url_image={imagenView} messageImage="" onClose={() => setImagenView("")} />
                  </Dialog.Root>
                )
              }

              <div className="w-full flex m-2 flex-col md:flex-row items-center justify-between gap-y-2 md:gap-x-4 my-4">
                <div className="w-full border border-gray-400 rounded-lg py-1 px-2 flex flex-col md:flex-row gap-y-2 items-center justify-center gap-x-1 flex-1">

                  <div className="flex w-full mx-auto items-center justify-center">
                    <label htmlFor="datePickStart">Desde:</label>
                    <input
                      className="border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md"
                      id="datePickStart"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="flex w-full items-center justify-center">
                    <label htmlFor="datePickEnd">Hasta:</label>
                    <input
                      className="border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md"
                      id="datePickEnd"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  <div className="flex w-full items-center justify-center mx-auto md:flex-1 md:space-x-1">
                    <input
                      type="text"
                      value={startDate === "" && endDate === "" ? "0" : daysDifference}
                      disabled
                      className="w-10 text-center cursor-not-allowed rounded-md" />
                    <span>días</span>
                  </div>
                </div>

                <div className="w-full flex-1">
                  <KardexSearchIdRangeDate />
                </div>
              </div>


              <div className="mb-2 w-[full] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full md:w-[50%]">
                  <input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:max-w-sm border border-gray-400 rounded-md py-1 px-2 focus-visible:border-gray-600 outline-none"
                  />
                </div>

                <div className="flex flex-1 flex-col md:flex-row gap-2 items-center md:justify-end w-full">
                  <Tooltip content="Clic para actualizar la información">
                    <button
                      className="w-full md:w-auto border border-gray-300 rounded-md flex items-center justify-center gap-x-4 py-1 px-4 bg-gray-100/50 hover:bg-gray-100/60 font-medium text-base"
                      color="gray"
                      onClick={() => {
                        refetch()
                        refreshRange()
                        refreshIdRange()
                      }}
                    >
                      <Loader2 className="size-5" />
                      <span className="md:hidden">Actualizar</span>
                    </button>
                  </Tooltip>

                  <ToogleFieldsDialogKardex showFields={showFields} setShowFields={setShowFields} />

                  {
                    isKardexProductActive && data && data.length > 0 &&
                    (
                      <ReportKardexById kardex={data && data.length > 0 ? data[0] : {
                        id: null,
                        fecha_creacion: null,
                        descripcion: null,
                        nombre_producto: null,
                        tipo: null,
                        cantidad_entrada: null,
                        precio_entrada: null,
                        total_entrada: null,
                        cantidad_salida: null,
                        precio_salida: null,
                        precio_facturacion: null,
                        total_salida: null,
                        cantidad_disponible: null,
                        precio_disponible: null,
                        total_disponible: null
                      }} />
                    )
                  }

                  {
                    isKardexRangeDateActive && dataKardexRange && dataKardexRange.length > 0 &&
                    (
                      <ReportKardexByRangeDate startDate={startDate} endDate={endDate} />
                    )
                  }
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-thin-custom overflow-y-auto scroll-smooth touch-pan-y touch-pan-x overflow-scroll h-[17rem] md:h-[21rem]">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      <Table.ColumnHeaderCell className="text-center" colSpan={4}>
                        <Badge color="green">Detalles</Badge>
                      </Table.ColumnHeaderCell>

                      <Table.ColumnHeaderCell className="text-center" colSpan={3}>
                        <Badge>Entradas</Badge>
                      </Table.ColumnHeaderCell>

                      <Table.ColumnHeaderCell className="text-center" colSpan={4}>
                        <Badge color="blue">Salidas</Badge>
                      </Table.ColumnHeaderCell>

                      <Table.ColumnHeaderCell className="text-center" colSpan={3}>
                        <Badge color="orange">Saldos</Badge>
                      </Table.ColumnHeaderCell>
                    </Table.Row>

                    <Table.Row align="center">
                      {
                        showFields.includes("fecha_creacion") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="green">Fecha</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("descripcion") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="green">Descripción</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("nombre_producto") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="green">Producto</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("tipo") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="green">Tipo</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("cantidad_entrada") &&
                        <Table.ColumnHeaderCell>
                          <Badge>Entradas</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("precio_entrada") &&
                        <Table.ColumnHeaderCell>
                          <Badge>Precios</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("total_entrada") &&
                        <Table.ColumnHeaderCell>
                          <Badge>Totales</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("cantidad_salida") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="blue">Salidas</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("precio_salida") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="blue">Costo promedio</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("precio_facturacion") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="blue">Precio facturación</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("total_salida") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="blue">Totales</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("cantidad_disponible") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="orange">Disponibles</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("precio_disponible") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="orange">Precios</Badge>
                        </Table.ColumnHeaderCell>
                      }

                      {
                        showFields.includes("total_disponible") &&
                        <Table.ColumnHeaderCell>
                          <Badge color="orange">Totales</Badge>
                        </Table.ColumnHeaderCell>
                      }
                    </Table.Row>
                  </Table.Header>

                  <Table.Body className="px-2">
                    {
                      filteredKardex != undefined ?
                        filteredKardex?.map(kardex => (
                          <Table.Row key={kardex.id}>
                            {
                              showFields.includes("fecha_creacion") &&
                              <Table.Cell className="px-2 py-1">
                                {
                                  kardex!.fecha_creacion
                                }
                              </Table.Cell>

                            }

                            {
                              showFields.includes("descripcion") &&
                              <Table.Cell className="px-2 py-2">
                                {
                                  kardex.descripcion
                                }
                              </Table.Cell>
                            }

                            {
                              showFields.includes("nombre_producto") &&
                              <Table.Cell className="px-2 py-2">
                                {
                                  kardex.nombre_producto
                                }
                              </Table.Cell>
                            }

                            {
                              showFields.includes("tipo") &&
                              <Table.Cell className="px-2 py-2">
                                {
                                  kardex.tipo
                                }
                              </Table.Cell>
                            }

                            {
                              showFields.includes("cantidad_entrada") &&
                              <Table.Cell className="px-2 py-2">
                                {
                                  kardex.cantidad_entrada == null ? "0" : kardex.cantidad_entrada
                                }
                              </Table.Cell>
                            }

                            {
                              showFields.includes("precio_entrada") &&
                              <Table.Cell className="px-2 py-2">
                                {kardex.precio_entrada == null ? "0" : formatCurrency(kardex!.precio_entrada!.toString())}
                              </Table.Cell>
                            }

                            {
                              showFields.includes("total_entrada") &&
                              <Table.Cell className="px-2 py-2">
                                {kardex.total_entrada == null ? "0" : formatCurrency(kardex!.total_entrada!.toString())}
                              </Table.Cell>
                            }

                            {
                              showFields.includes("cantidad_salida") &&
                              <Table.Cell className="px-2 py-2">
                                {kardex!.cantidad_salida == null ? "0" : kardex!.cantidad_salida}
                              </Table.Cell>
                            }

                            {
                              showFields.includes("precio_salida") &&
                              <Table.Cell className="px-2 py-2">
                                {kardex.precio_salida == null ? "0" : formatCurrency(kardex!.precio_salida!.toString())}
                              </Table.Cell>
                            }

                            {
                              showFields.includes("precio_facturacion") &&
                              <Table.Cell className="px-2 py-2">
                                {kardex.precio_facturacion == null ? "0" : formatCurrency(kardex!.precio_facturacion!.toString())}
                              </Table.Cell>
                            }

                            {
                              showFields.includes("total_salida") &&
                              <Table.Cell className="px-2 py-2">
                                {kardex.total_salida == null ? "0" : formatCurrency(kardex!.total_salida!.toString())}
                              </Table.Cell>
                            }

                            {
                              showFields.includes("cantidad_disponible") &&
                              <Table.Cell className="px-2 py-2">
                                {kardex!.cantidad_disponible}
                              </Table.Cell>
                            }

                            {
                              showFields.includes("precio_disponible") &&
                              <Table.Cell className="px-2 py-2">
                                {formatCurrency(kardex!.precio_disponible!.toString())}
                              </Table.Cell>
                            }

                            {
                              showFields.includes("total_disponible") &&
                              <Table.Cell className="px-2 py-2">
                                {formatCurrency(kardex!.total_disponible!.toString())}
                              </Table.Cell>
                            }
                          </Table.Row>
                        ))
                        :
                        filteredKardexDateRange != undefined ?
                          filteredKardexDateRange?.map(kardex => (
                            <Table.Row key={kardex.id}>
                              {
                                showFields.includes("fecha_creacion") &&
                                <Table.Cell className="px-2 py-1">
                                  {
                                    kardex!.fecha_creacion
                                  }
                                </Table.Cell>

                              }

                              {
                                showFields.includes("descripcion") &&
                                <Table.Cell className="px-2 py-2">
                                  {
                                    kardex.descripcion
                                  }
                                </Table.Cell>
                              }

                              {
                                showFields.includes("nombre_producto") &&
                                <Table.Cell className="px-2 py-2">
                                  {
                                    kardex.nombre_producto
                                  }
                                </Table.Cell>
                              }

                              {
                                showFields.includes("tipo") &&
                                <Table.Cell className="px-2 py-2">
                                  {
                                    kardex.tipo
                                  }
                                </Table.Cell>
                              }

                              {
                                showFields.includes("cantidad_entrada") &&
                                <Table.Cell className="px-2 py-2">
                                  {
                                    kardex.cantidad_entrada == null ? "0" : kardex.cantidad_entrada
                                  }
                                </Table.Cell>
                              }

                              {
                                showFields.includes("precio_entrada") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.precio_entrada == null ? "0" : formatCurrency(kardex!.precio_entrada!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("total_entrada") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.total_entrada == null ? "0" : formatCurrency(kardex!.total_entrada!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("cantidad_salida") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex!.cantidad_salida == null ? "0" : kardex!.cantidad_salida}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("precio_salida") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.precio_salida == null ? "0" : formatCurrency(kardex!.precio_salida!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("precio_facturacion") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.precio_facturacion == null ? "0" : formatCurrency(kardex!.precio_facturacion!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("total_salida") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.total_salida == null ? "0" : formatCurrency(kardex!.total_salida!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("cantidad_disponible") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex!.cantidad_disponible}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("precio_disponible") &&
                                <Table.Cell className="px-2 py-2">
                                  {formatCurrency(kardex!.precio_disponible!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("total_disponible") &&
                                <Table.Cell className="px-2 py-2">
                                  {formatCurrency(kardex!.total_disponible!.toString())}
                                </Table.Cell>
                              }

                            </Table.Row>
                          ))
                          :
                          filteredKardexIdDateRange != undefined &&
                          filteredKardexIdDateRange?.map(kardex => (
                            <Table.Row key={kardex.id}>
                              {
                                showFields.includes("fecha_creacion") &&
                                <Table.Cell className="px-2 py-1">
                                  {
                                    kardex!.fecha_creacion
                                  }
                                </Table.Cell>

                              }

                              {
                                showFields.includes("descripcion") &&
                                <Table.Cell className="px-2 py-2">
                                  {
                                    kardex.descripcion
                                  }
                                </Table.Cell>
                              }


                              {
                                showFields.includes("nombre_producto") &&
                                <Table.Cell className="px-2 py-2">
                                  {
                                    kardex.nombre_producto
                                  }
                                </Table.Cell>
                              }

                              {
                                showFields.includes("tipo") &&
                                <Table.Cell className="px-2 py-2">
                                  {
                                    kardex.tipo
                                  }
                                </Table.Cell>
                              }

                              {
                                showFields.includes("cantidad_entrada") &&
                                <Table.Cell className="px-2 py-2">
                                  {
                                    kardex.cantidad_entrada == null ? "0" : kardex.cantidad_entrada
                                  }
                                </Table.Cell>
                              }

                              {
                                showFields.includes("precio_entrada") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.precio_entrada == null ? "0" : formatCurrency(kardex!.precio_entrada!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("total_entrada") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.total_entrada == null ? "0" : formatCurrency(kardex!.total_entrada!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("cantidad_salida") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex!.cantidad_salida == null ? "0" : kardex!.cantidad_salida}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("precio_salida") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.precio_salida == null ? "0" : formatCurrency(kardex!.precio_salida!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("precio_facturacion") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.precio_salida == null ? "0" : formatCurrency(kardex!.precio_facturacion!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("total_salida") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex.total_salida == null ? "0" : formatCurrency(kardex!.total_salida!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("cantidad_disponible") &&
                                <Table.Cell className="px-2 py-2">
                                  {kardex!.cantidad_disponible}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("precio_disponible") &&
                                <Table.Cell className="px-2 py-2">
                                  {formatCurrency(kardex!.precio_disponible!.toString())}
                                </Table.Cell>
                              }

                              {
                                showFields.includes("total_disponible") &&
                                <Table.Cell className="px-2 py-2">
                                  {formatCurrency(kardex!.total_disponible!.toString())}
                                </Table.Cell>
                              }

                            </Table.Row>
                          ))
                    }
                    <Table.Row>
                      {
                        filteredKardex === undefined && filteredKardexDateRange === undefined && filteredKardexIdDateRange === undefined &&
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
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
          </>
        </div>
      </div >
    </>
  )
}