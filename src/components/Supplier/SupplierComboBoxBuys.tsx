import { MousePointerClick, Search, SquareMousePointer, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Tooltip } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import { SupplierFormDataInfo } from "../../types/supplierData";
import { getSupplier } from "../../apis/SupplierAPI";


export default function SupplierComboBoxBuys({ onSelectionChange }: { onSelectionChange: (supplier: SupplierFormDataInfo) => void }) {    
    const { data } = useQuery({
        queryKey: ["suppliers"],
        queryFn: getSupplier,
    })

    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredSupplier = data?.filter(supplier =>
        Object.values(supplier).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const handleSelect = (supplier: SupplierFormDataInfo) => {
        onSelectionChange(supplier)
    }
    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium  text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full md:w-[70%] lg:w-[50%]"
                        onClick={() => {                            
                            setOpen(true)                                                    
                        }}
                    >
                        <MousePointerClick className="size-5" />
                        Seleccionar proveedor
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content className={`w-[98%] md:w-[80%] fixed left-1/2 top-1/2 overflow-y-auto scroll-smooth touch-pan-y overflow-scroll -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Selección de proveedores
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Selecciona el proveedor de esta compra...
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
                            <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x w-full">
                                <Table.Header className="top-0 sticky bg-white">
                                    <Table.Row align="center">
                                        <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>RUC</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Proveedor</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Correo</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Teléfono</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Celular</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        filteredSupplier?.map(supplier => (
                                            <Table.Row align="center" key={supplier.id} className="hover:bg-gray-100/85 transition-all duration-200">
                                                {
                                                    <Table.Cell>
                                                        {supplier.codigo_proveedor}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        {supplier.ruc}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        {supplier.nombre_proveedor}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        {supplier.correo_proveedor}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        {supplier.telefono_proveedor}
                                                    </Table.Cell>
                                                }

                                                {
                                                    <Table.Cell>
                                                        {supplier.celular_proveedor}
                                                    </Table.Cell>
                                                }                                               
                                               

                                                {
                                                    <Table.Cell>
                                                        <div className="flex gap-2 items-center justify-center">
                                                            <Tooltip content="Clic para seleccionar proveedor">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleSelect(supplier)                                                                        
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
                                            filteredSupplier?.length == 0 &&
                                            (
                                                <Table.Cell colSpan={7}>
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