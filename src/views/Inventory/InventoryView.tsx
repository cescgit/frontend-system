import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Loader2, Search } from "lucide-react"
import { Badge, Dialog, Table, Tooltip } from "@radix-ui/themes"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { getInventory } from "../../apis/InventoryAPI"
import ViewImageDialog from "../../components/Product/ViewImageDialog"
import ToogleFieldsDialogInventory from "../../components/Inventory/ToogleFieldsDialogInventory"
import { formatCurrency } from "../../utils/utils"

export default function InventoryView() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventory,
  })

  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [imagenView, setImagenView] = useState<string>()
  const [messageImage, setMessageImage] = useState("")
  const [showFields, setShowFields] = useState<string[]>([
    "codigo",
    "sac",
    "nombre_producto",
    "imagen_url",
    "precio_compra",
    "remisiones",
    "producto_apartado",
    "stock",
    "unidad_medida",
    "nombre_categoria",
    "nombre_marca",
    "estado"
  ])

  const filteredInventory = data?.filter(inventory =>
    Object.values(inventory).some(value =>
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

                  <ToogleFieldsDialogInventory showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center" className="top-0 sticky">
                      {showFields.includes("codigo") && <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>}
                      {showFields.includes("sac") && <Table.ColumnHeaderCell>SAC</Table.ColumnHeaderCell>}
                      {showFields.includes("nombre_producto") && <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>}
                      {showFields.includes("imagen_url") && <Table.ColumnHeaderCell>Imagen</Table.ColumnHeaderCell>}
                      {showFields.includes("precio_compra") && <Table.ColumnHeaderCell>Precio Compra</Table.ColumnHeaderCell>}
                      {showFields.includes("remisiones") && <Table.ColumnHeaderCell>Remisión</Table.ColumnHeaderCell>}
                      {showFields.includes("producto_apartado") && <Table.ColumnHeaderCell>Apartado</Table.ColumnHeaderCell>}
                      {showFields.includes("stock") && <Table.ColumnHeaderCell>Stock</Table.ColumnHeaderCell>}
                      {showFields.includes("unidad_medida") && <Table.ColumnHeaderCell>U/M</Table.ColumnHeaderCell>}
                      {showFields.includes("nombre_categoria") && <Table.ColumnHeaderCell>Categoría</Table.ColumnHeaderCell>}
                      {showFields.includes("nombre_marca") && <Table.ColumnHeaderCell>Marca</Table.ColumnHeaderCell>}
                      {showFields.includes("estado") && <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>}
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {
                      filteredInventory?.map(inventory => (
                        <Table.Row key={inventory.id_inventario} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id_inventario") &&
                            <Table.Cell>
                              {inventory.id_inventario}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("codigo") &&
                            <Table.Cell>
                              {inventory.codigo}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("sac") &&
                            <Table.Cell>
                              {inventory.sac}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("nombre_producto") &&
                            <Table.Cell>
                              {inventory.nombre_producto}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("imagen_url") &&
                            <Table.Cell>
                              <Tooltip content="Clic para ver la imagen">
                                {showFields.includes("imagen_url") && (
                                  <img
                                    className="size-10 cursor-pointer"
                                    src={inventory.imagen_url == "" ? "https://i.ibb.co/q30MxkxD/Image-upload-bro.png" : inventory.imagen_url}
                                    alt={inventory.nombre_producto}
                                    onClick={() => {

                                      if (inventory.imagen_url == "") {
                                        setImagenView("https://i.ibb.co/q30MxkxD/Image-upload-bro.png");
                                        setMessageImage("No hay imagen de este producto, agrega una imagen para visualizarla...")
                                        setOpen(!open)
                                      }
                                      else {
                                        setImagenView(inventory.imagen_url)
                                        setMessageImage("");
                                        setOpen(!open)
                                      }
                                    }}
                                  />
                                )}
                              </Tooltip>
                            </Table.Cell>

                          }

                          {
                            showFields.includes("precio_compra") &&
                            <Table.Cell>
                              {formatCurrency(inventory.precio_compra)}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("remisiones") &&
                            <Table.Cell align="center">
                              {inventory.remisiones}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("producto_apartado") &&
                            <Table.Cell align="center">
                              {inventory.producto_apartado}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("stock") &&
                            <Table.Cell>
                              {inventory.stock}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("unidad_medida") &&
                            <Table.Cell>
                              {inventory.unidad_medida}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("nombre_categoria") &&
                            <Table.Cell>
                              {inventory.nombre_categoria}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("nombre_marca") &&
                            <Table.Cell>
                              {inventory.nombre_marca}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("estado") &&
                            <Table.Cell>
                              <Badge color={`${inventory.estado == 1 ? "green" : "red"}`}>
                                {
                                  inventory.estado == 1 ? "Activo" : "Inactivo"
                                }
                              </Badge>
                            </Table.Cell>
                          }
                        </Table.Row>
                      ))
                    }

                    <Table.Row>
                      {
                        filteredInventory?.length == 0 &&
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
                      imagenView && (
                        <Dialog.Root open={open} onOpenChange={() => {
                          setOpen(!open)
                        }}>
                          <ViewImageDialog url_image={imagenView} messageImage={messageImage} onClose={() => setImagenView("")} />
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