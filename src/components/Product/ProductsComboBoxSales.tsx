import { MousePointerClick, Search, SquareMousePointer, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge, Table, Tooltip } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import { useNavigate } from "react-router-dom";
import { getInventory } from "../../apis/InventoryAPI";
import { TempPurchasingFormData } from "../../types/buysData";


type ComboboxSalesProps = {
    onSelectionChange: (product: TempPurchasingFormData) => void;
    onStockChange: (stock: number) => void;
  };

export default function ProductsComboBoxSales({ onSelectionChange, onStockChange }: ComboboxSalesProps) {
    const navigate = useNavigate()
    const { data } = useQuery({
        queryKey: ["inventory"],
        queryFn: getInventory,
    })

    const [open, setOpen] = useState(false)
    // const [getStock, setGetStock] = useState<(stock: number) => void>(onStockChange);
    const [searchTerm, setSearchTerm] = useState("")

    const filteredProductInventory = data?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    const handleSelect = (products: TempPurchasingFormData) => {
        onSelectionChange(products)

        onStockChange(products.stock)
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium  text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full sm:w-[80%] md:w-[70%] lg:w-[50%]"
                        onClick={() => {
                            navigate(location.search, { replace: true })
                            setOpen(true)
                        }}
                    >
                        <MousePointerClick className="size-5" />
                        Seleccionar Producto
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content className={`w-[95%] fixed left-1/2 top-1/2 overflow-y-auto scroll-smooth touch-pan-y overflow-scroll -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Selección de producto
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Selecciona el producto de tu inventario...
                        </Dialog.Description>
                        <Dialog.Close asChild>
                            <button
                                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                                aria-label="Close"
                                onClick={() => setOpen(false)}
                            >
                                <X />
                            </button>
                        </Dialog.Close>

                        <div className='w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 flex items-center justify-center'>
                            <Search className="size-5" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>

                        <div className="mt-3 w-full h-[25rem] md:h-[35rem] mx-auto">
                            <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x p-2">
                                <Table.Header className="top-0 sticky bg-white">
                                    <Table.Row align="center">
                                        <Table.ColumnHeaderCell>SAC</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Stock</Table.ColumnHeaderCell>                                        
                                        <Table.ColumnHeaderCell>Imagen</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        filteredProductInventory?.map(product => (
                                            <Table.Row align="center" key={product.id_inventario} className="hover:bg-gray-100/85 transition-all duration-200">
                                                {
                                                    <Table.Cell>
                                                        {product.sac}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        {product.nombre_producto}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        {product.stock}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        <img className="size-10" src={`${product.imagen_url}`} alt="Image" />
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        <Badge color={`${product.estado == 1 ? "green" : "red"}`}>
                                                            {product.estado == 1 ? "Activo" : "Inactivo"}
                                                        </Badge>
                                                    </Table.Cell>
                                                }


                                                {
                                                    <Table.Cell>
                                                        <div className="flex gap-2 items-center justify-center">
                                                            <Tooltip content="Clic para seleccionar producto">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleSelect({
                                                                            ...product,
                                                                            subtotal: "0",
                                                                            cantidad: 1,
                                                                            precio_venta: product.precio1
                                                                        })
                                                                        setOpen(false)
                                                                    }}
                                                                    className="size-5"
                                                                >
                                                                    <SquareMousePointer className="h-4 w-4" />
                                                                </button>
                                                            </Tooltip>
                                                        </div>
                                                    </Table.Cell>
                                                }
                                            </Table.Row>
                                        ))
                                    }

                                    <Table.Row>
                                        {
                                            filteredProductInventory?.length == 0 &&
                                            (
                                                <Table.Cell colSpan={6}>
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
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}