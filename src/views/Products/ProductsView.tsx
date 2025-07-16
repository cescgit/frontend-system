import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Loader from "../../components/Loader"
import { Edit, Ellipsis, Loader2, Search, Trash2 } from "lucide-react"
import { Badge, Button, Dialog, DropdownMenu, Table, Tooltip } from "@radix-ui/themes"
import { formatDate } from "../../utils/utils"
import { useLocation, useNavigate } from "react-router-dom"
import NotFoundEmpty from "../../components/NotFoundEmpty"
import { getProducts } from "../../apis/ProductsAPI"
import { ProductFormDataDelete, ProductFormDataInfo } from "../../types/productData"
import ToogleFieldsDialogProduct from "../../components/Product/ToogleFieldsDialogProduct"
import DeleteProductAlertDialog from "../../components/Product/DeleteProductAlertDialog"
import ViewImageDialog from "../../components/Product/ViewImageDialog"
import { AuthPermissions } from "../../types/authData"
import CreateProduct from "../../components/Product/CreateProduct"
import EditProduct from "../../components/Product/EditProduct"

export default function ProductsView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalEditProduct = queryParams.get("editProducts");
  const showEditModal = modalEditProduct ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialogEditProduct, setOpenDialogEditProduct] = useState(showEditModal)


  const [imagenView, setImagenView] = useState<string>()
  const [messageImage, setMessageImage] = useState("")
  const [editingProduct, setEditingProduct] = useState<ProductFormDataInfo | null>(null)
  const [deletedProduct, setDeletedProduct] = useState<ProductFormDataDelete | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "codigo",
    "nombre_producto",
    "cantidad_minima",
    "estado",
    "imagen_url",
    "marca",
    "categoria",
    "fecha_creacion",
    "nombre_usuario_creador",
    "nombre_usuario_modificador"

  ])

  const filteredProducts = data?.filter(product =>
    Object.values(product).some(value =>
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
                    dataAuth?.permisos_producto[0].guardar == 1 && (<CreateProduct />)
                  }

                  <ToogleFieldsDialogProduct showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[23rem] md:h-[28rem] mx-auto">
                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                  <Table.Header className="top-0 sticky bg-white">
                    <Table.Row align="center">
                      {showFields.includes("codigo") && <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>}
                      {showFields.includes("nombre_producto") && <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>}
                      {showFields.includes("cantidad_minima") && <Table.ColumnHeaderCell>Cantidad minima</Table.ColumnHeaderCell>}
                      {showFields.includes("estado") && <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>}
                      {showFields.includes("imagen_url") && <Table.ColumnHeaderCell>Imagen</Table.ColumnHeaderCell>}
                      {showFields.includes("marca") && <Table.ColumnHeaderCell>Marca</Table.ColumnHeaderCell>}
                      {showFields.includes("categoria") && <Table.ColumnHeaderCell>Categoría</Table.ColumnHeaderCell>}
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
                        dataAuth?.permisos_producto[0].modificar == 1 ||
                          dataAuth?.permisos_producto[0].eliminar == 1 ?
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
                      filteredProducts?.map(product => (
                        <Table.Row key={product.id} className="hover:bg-gray-100/85 transition-all duration-200">
                          {
                            showFields.includes("id") &&
                            <Table.Cell>
                              {product.id}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("codigo") &&
                            <Table.Cell>
                              {product.codigo}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("nombre_producto") &&
                            <Table.Cell>
                              {product.nombre_producto}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("cantidad_minima") &&
                            <Table.Cell>
                              {product.cantidad_minima}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("estado") &&
                            <Table.Cell>
                              <Badge color={`${product.estado == 1 ? "green" : "red"}`}>
                                {
                                  product.estado == 1 ? "Activo" : "Inactivo"
                                }
                              </Badge>
                            </Table.Cell>
                          }

                          {
                            showFields.includes("imagen_url") &&
                            <Table.Cell>
                              <Tooltip content="Clic para ver la imagen">
                                {showFields.includes("imagen_url") && (
                                  <img
                                    className="size-10 cursor-pointer"
                                    src={product.imagen_url == "" ? "https://i.ibb.co/q30MxkxD/Image-upload-bro.png" : product.imagen_url}
                                    alt={product.nombre_producto}
                                    onClick={() => {

                                      if (product.imagen_url == "") {
                                        setImagenView("https://i.ibb.co/q30MxkxD/Image-upload-bro.png");
                                        setMessageImage("No hay imagen de este producto, agrega una imagen para visualizarla...")
                                        setOpen(!open)
                                      }
                                      else {
                                        setImagenView(product.imagen_url)
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
                            showFields.includes("marca") &&
                            <Table.Cell>
                              {product.marca}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("categoria") &&
                            <Table.Cell>
                              {product.categoria}
                            </Table.Cell>
                          }

                          {
                            showFields.includes("fecha_creacion") &&
                            <Table.Cell>
                              {formatDate(product.fecha_creacion)}
                            </Table.Cell>
                          }

                            {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_creador") &&
                            <Table.Cell>
                              {product.nombre_usuario_creador}
                            </Table.Cell>
                          }

                          {
                            dataAuth.tipo_usuario === import.meta.env.VITE_TYPEFROM_USER &&
                            showFields.includes("nombre_usuario_modificador") &&
                            <Table.Cell>
                              {product.nombre_usuario_modificador}
                            </Table.Cell>
                          }

                          {
                            dataAuth!.permisos_producto[0].modificar == 1 ||
                              dataAuth!.permisos_producto[0].eliminar == 1 ?
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
                                        dataAuth?.permisos_producto[0].modificar == 1 &&
                                        (
                                          <>
                                            <DropdownMenu.Item
                                              color="gray"
                                              className="flex items-center justify-center"
                                              onClick={() => {
                                                setEditingProduct(product)
                                                setOpenDialogEditProduct(!openDialogEditProduct)
                                                refetch()

                                                if (openDialogEditProduct) {
                                                  navigate(location.pathname, { replace: true })
                                                  setOpenDialogEditProduct(!openDialogEditProduct)
                                                  refetch()
                                                }
                                                else {
                                                  navigate(location.pathname + `?editProducts=${product.id}`)
                                                  refetch()
                                                }
                                              }}
                                            >
                                              <Edit className="size-4" />
                                              Modificar producto
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
                                              setDeletedProduct(product)
                                            }}
                                          >
                                            <Trash2 className="size-4 text-red hover:text-white" />
                                            Eliminar producto
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
                        filteredProducts?.length == 0 &&
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
                      deletedProduct && (
                        <DeleteProductAlertDialog product={deletedProduct} onClose={() => setDeletedProduct(null)} />
                      )
                    }

                    {
                      imagenView && (
                        <Dialog.Root open={open} onOpenChange={() => {
                          setOpen(!open)
                        }}>
                          <ViewImageDialog url_image={imagenView} messageImage={messageImage} onClose={() => setImagenView("")} />
                        </Dialog.Root>
                      )
                    }

                    {
                      editingProduct && (
                        <Dialog.Root open={openDialogEditProduct} onOpenChange={() => {
                          setOpenDialogEditProduct(!openDialogEditProduct)
                          refetch()
                          if (openDialogEditProduct) {
                            navigate(location.pathname, { replace: true })
                          }
                        }}>
                          <EditProduct product={{ ...editingProduct, usuario_modificador: "default_value" }} onClose={() => setEditingProduct(null)} />
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