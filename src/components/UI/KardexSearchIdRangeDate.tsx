import { MousePointerClick, SquareMousePointer, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/ProductsAPI";
import { Table, Tooltip } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import { formatCurrency } from "../../utils/utils";
import { useNavigate } from "react-router-dom";


export default function KardexSearchIdRangeDate() {
    const navigate = useNavigate();    
    const { data } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    })

    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const filteredProducts = data?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full md:w-auto mx-auto"
                        onClick={() => {
                            navigate(location.search, { replace: true })
                            setOpen(true)
                        }}
                    >
                        <MousePointerClick className="size-5" />
                        Seleccionar producto y fechas
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content className={`w-[90%] h-[96%] fixed left-1/2 top-1/2 overflow-y-auto touch-pan-y -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Filtar por producto y rango de fecha
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Filtro de producto y rango de fecha para mostrar movimientos de entradas y salidas...
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

                        <div className="w-full md:w-[60%] mx-auto border border-gray-400 rounded-lg py-1 px-2 flex flex-col sm:flex-row items-center justify-center gap-x-1 mt-2">
                            <div className="flex items-center justify-center">
                                <label htmlFor="datePickStart">Desde:</label>
                                <input
                                    className="border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md"
                                    id="datePickStart"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-center">
                                <label htmlFor="datePickEnd">Hasta:</label>
                                <input
                                    className="border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md"
                                    id="datePickEnd"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='w-full -m-3 mx-auto mt-4'>
                            <input
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full outline-none border-0"
                            />
                        </div>

                        <div className="mt-3 w-full h-[25rem] md:h-[35rem] mx-auto">
                            <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x p-2 w-full">
                                <Table.Header className="top-0 sticky bg-white">
                                    <Table.Row align="center">
                                        <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Precio compra</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Imagen</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        filteredProducts?.map(product => (
                                            <Table.Row align="center" key={product.id} className="hover:bg-gray-100/85 transition-all duration-200">

                                                {
                                                    <Table.Cell>
                                                        {product.nombre_producto}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        {formatCurrency(product.precio_compra.toString())}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        <img className="size-16" src={`${product.imagen_url}`} alt="Image" />
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        <div className="flex gap-2">
                                                            <Tooltip content="Clic para seleccionar producto">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        navigate(location.pathname + `?viewKardex=${product!.id}&startDate=${startDate}&endDate=${endDate}`)                                                                        
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
                                </Table.Body>
                            </Table.Root>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}