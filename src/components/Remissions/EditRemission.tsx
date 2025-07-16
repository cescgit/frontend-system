import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, PlusIcon, Save, Search, Trash2, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import { getRemissionById, updateRemission } from "../../apis/RemissionsAPI";
import { ProductRemissionFormData, RemissionsFormDataAdd, RemissionsFormDataEdit } from "../../types/remissionsData";
import { getCustomers } from "../../apis/CustomerAPI";
import { DataItemCustomer } from "../../types/customerData";
import { TempPurchasingFormData, TempPurchasingFormDataAdd } from "../../types/buysData";
import ProductsComboBoxInventory from "../Product/ProductComboBoxInventory";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import { Table } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import DeleteProductInInventoryAlertDialog from "./DeleteProductInInventory";

const MySwal = withReactContent(Swal);

interface EditRemissionProps {
    remission: RemissionsFormDataEdit;
    onClose: () => void;
}


export default function EditRemission({ remission, onClose }: EditRemissionProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const remissionId = queryParams.get("editRemissions")!
    const id = remissionId;
    let idUSerLogin;


    const [stockProduct, setStockProduct] = useState<number | null>(0)
    const [deletedProductInventory, setDeletedProductInventory] = useState<ProductRemissionFormData | null>(null)
    const [dataProducts, setDataProducts] = useState<TempPurchasingFormData[]>(sessionStorage.getItem("tempProductsRemissionEdit") ? JSON.parse(sessionStorage.getItem("tempProductsRemissionEdit")!) : [])
    const [editId, setEditId] = useState<string | null>(null)
    // * customer
    const [customerName, setCustomerName] = useState<DataItemCustomer[]>([])

    const [newProducts, setNewProducts] = useState<TempPurchasingFormData>({
        id_inventario: "",
        id_producto: "",
        nombre_producto: "",
        precio_venta: "",
        precio_compra: "",
        cantidad: 0,
        stock: 0,
        subtotal: "",
        utilidad1: 0,
        utilidad2: 0,
        utilidad3: 0,
        utilidad4: 0,
        precio1: "",
        precio2: "",
        precio3: "",
        precio4: ""
    })

    const [editRemission, setEditRemission] = useState(remission)

    const { data } = useQuery({
        queryKey: ["remissions", id],
        queryFn: () => getRemissionById({ id }),
        enabled: !!id,
        retry: false
    })

    useEffect(() => {
        if (data) {
            setDataProducts(data.map(item => ({
                ...item,
                id_inventario: item.id_inventario || "",
                precio_compra: item.precio_compra || "0",
                precio_venta: item.precio_venta ?? "",
                subtotal: item.subtotal ?? "",
                stock: item.stock || 0,
                utilidad1: item.utilidad1 ?? 0,
                utilidad2: item.utilidad2 ?? 0,
                utilidad3: item.utilidad3 ?? 0,
                utilidad4: item.utilidad4 ?? 0,
                precio1: item.precio1 ?? "",
                precio2: item.precio2 ?? "",
                precio3: item.precio3 ?? "",
                precio4: item.precio4 ?? ""
            })))
        }
    }, [data])

    const { data: dataCustomers } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    })

    useEffect(() => {

        // * Customers
        if (dataCustomers === undefined) return;
        const getValueCustomer = dataCustomers?.map((customer) => customer.id)
        const labelCustomer = dataCustomers?.map((customer) => customer.nombre_cliente)
        const getDataCustomer = getValueCustomer!.map((value, index) => ({
            value,
            label: labelCustomer![index]
        }));
        setCustomerName(getDataCustomer);

    }, [dataCustomers, setCustomerName])

    const [customerInput, setcustomerInput] = useState("");
    useEffect(() => {
        const currentLabel = customerName.find(item => item.value === editRemission.id_cliente)?.label || "";
        setcustomerInput(currentLabel);
    }, [editRemission.id_cliente, customerName]);

    useEffect(() => {
        const storedProducts = sessionStorage.getItem("tempProductsRemissionEdit");
        if (storedProducts) {
            setDataProducts(JSON.parse(storedProducts));
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem("tempProductsRemissionEdit", JSON.stringify(dataProducts));
    }, [dataProducts])

    // * Get products information        
    const [productId, setProductId] = useState<TempPurchasingFormData | null>(null)


    const addProducts = () => {
        setDataProducts([newProducts, ...dataProducts]);
        MySwal.fire({
            position: "center",
            title: "Producto",
            icon: "success",
            html:
                <div className="flex flex-col items-center">
                    <p>
                        El Producto:
                        <br />
                        <span className="text-cyan-500 font-bold">{newProducts.nombre_producto}</span>
                        <br />
                        se agrego correctamente...
                    </p>
                </div>
            ,
            showConfirmButton: false,
            timer: 1500
        });

        setNewProducts({
            id_inventario: "",
            id_producto: "",
            nombre_producto: "",
            precio_venta: "",
            precio_compra: "",
            cantidad: 0,
            stock: 0,
            subtotal: "",
            utilidad1: 0,
            utilidad2: 0,
            utilidad3: 0,
            utilidad4: 0,
            precio1: "",
            precio2: "",
            precio3: "",
            precio4: ""
        })
        // setSubtotal(0);
    }

    const editProduct = () => {
        setDataProducts(dataProducts.map(p => p.id_producto === newProducts.id_producto ? newProducts : p))

        MySwal.fire({
            position: "center",
            title: "Producto",
            icon: "success",
            html:
                <div className="flex flex-col items-center">
                    <p>
                        El Producto:
                        <br />
                        <span className="text-cyan-500 font-bold">{newProducts.nombre_producto}</span>,
                        <br />
                        se modifico correctamente...
                    </p>
                </div>
            ,
            showConfirmButton: false,
            timer: 1500
        });

        setNewProducts({
            id_inventario: "",
            id_producto: "",
            nombre_producto: "",
            precio_venta: "",
            precio_compra: "",
            cantidad: 0,
            stock: 0,
            subtotal: "",
            utilidad1: 0,
            utilidad2: 0,
            utilidad3: 0,
            utilidad4: 0,
            precio1: "",
            precio2: "",
            precio3: "",
            precio4: ""
        })
        // setSubtotal(0);
        setEditId(null)
    }

    const deleteProduct = (id_product: string) => {
        setDataProducts(dataProducts.filter((item) => item.id_producto !== id_product));
        sessionStorage.setItem("tempProductsRemissionEdit", JSON.stringify(dataProducts));
    }

    const handleSelectionProduct = (dataProduct: TempPurchasingFormData) => {

        if (dataProducts.find(item => item.id_producto === dataProduct.id_producto)) {
            MySwal.fire({
                position: "center",
                title: "Producto",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-red-500 font-bold">
                            El producto ya se encuentra agregado...
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        setProductId(dataProduct)

        newProducts.id_producto = dataProduct!.id_producto;
        newProducts.nombre_producto = dataProduct!.nombre_producto;
        newProducts.id_inventario = dataProduct.id_inventario;
    }


    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateRemission,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Remisiones",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-red-500 font-bold">
                            {error.message}
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["remissions"] })
            MySwal.fire({
                position: "center",
                title: "Remisiones",
                icon: "success",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-cyan-500 font-bold">
                            {data}
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
            navigate(location.pathname, { replace: true })
            onClose();
        }
    })

    const {
        handleSubmit,
        reset,
    } = useForm<RemissionsFormDataAdd>({ defaultValues: editRemission });

    const [searchTerm, setSearchTerm] = useState("")

    const filteredDataProducts = dataProducts?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const getDataLocalStorage = (products: TempPurchasingFormDataAdd[]) => {

        return products.map((productsStorage) => {
            return {
                id_inventario: productsStorage.id_inventario,
                nombre_producto: productsStorage.nombre_producto,
                precio_venta: productsStorage.precio_venta,
                cantidad: productsStorage.cantidad,
                subtotal: productsStorage.subtotal,
                id_producto: productsStorage.id_producto,
            }
        })
    }

    const getStockByProduct = (stock: number) => {
        setStockProduct(stock)
    }

    const onSubmitCreateRemission = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        editRemission.usuario_modificador = idUSerLogin;
        const dataStorage = getDataLocalStorage(dataProducts);
        editRemission.detalle_remision = dataStorage;

        const formData = editRemission;
        const data = { remissionId, formData };

        mutate(data)
        reset();
        sessionStorage.clear();
        setDataProducts([]);
        setProductId(null);
        setEditId(null);
        setStockProduct(0);
    }

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/65 data-[state=open]:animate-overlayShow" />
                <Dialog.Content
                    className="fixed left-1/2 top-1/2 h-dvh md:h-[95%] overflow-y-auto touch-pan-y w-[98%] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow p-4 scrollbar-thin-custom">
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Crear remisión
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Crea tus remisiones aquí...
                    </Dialog.Description>
                    <form
                        onSubmit={handleSubmit(onSubmitCreateRemission)}
                        className="space-y-3"
                    >
                        <div className="w-full flex flex-col items-center justify-center gap-x-2">
                            <label className="w-full font-bold" htmlFor="customerSearch">Cliente:</label>
                            <div className="border border-gray-300 rounded-md py-1 px-2 flex items-center justify-center w-full">
                                <input
                                    id="customerSearch"
                                    type="text"
                                    name="searchCustomers"
                                    list="listCsustomer"
                                    placeholder="Buscar cliente..."
                                    className="outline-none w-full"
                                    value={customerInput}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setcustomerInput(value);

                                        const selectedItem = customerName.find(item => item.label === value);
                                        if (selectedItem) {
                                            setEditRemission({ ...editRemission, id_cliente: selectedItem.value });
                                        }
                                    }}
                                />
                                <datalist id="listCustomer">
                                    {
                                        customerName.map(item => (
                                            <option
                                                key={item.value}
                                                value={item.label}
                                            />
                                        ))
                                    }
                                </datalist>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-center flex-col">

                            <div className="flex flex-1 w-full items-center mt-4 border border-gray-400 px-1 py-2 sm:p-4 rounded-lg">
                                <div className="w-full flex items-center justify-center flex-col">

                                    <ProductsComboBoxInventory onSelectionChange={handleSelectionProduct} onStockChange={getStockByProduct} />

                                    <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                        <label className="font-bold mb-1 w-full" htmlFor="producto">Producto:</label>
                                        <input
                                            className="w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed"
                                            id="producto"
                                            value={productId?.nombre_producto}
                                            type="text"
                                            disabled
                                            placeholder="Tus productos aquí..."
                                        />
                                    </div>

                                    <div className="flex items-center justify-center w-full gap-y-4 md:gap-x-2">
                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label htmlFor="cantidad_producto" className="font-bold mb-1 w-full">Cantidad de producto:</label>
                                            <input
                                                id="cantidad_producto"
                                                className="w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none"
                                                value={newProducts.cantidad}
                                                onChange={(e) => {
                                                    if (stockProduct! < +e.target.value) {

                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-red-500 font-bold">
                                                                        La cantidad que estas ingresando no puede ser mayor a la que tiene el inventario
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });

                                                        newProducts.cantidad = stockProduct!;
                                                        return
                                                    }

                                                    if (+e.target.value < 0) {
                                                        newProducts.cantidad = 0;
                                                        return;
                                                    }



                                                    setNewProducts({ ...newProducts, cantidad: +e.target.value })
                                                }}
                                                type="number"
                                                placeholder="Ejemplo: xxx..."
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full flex items-center justify-center mt-8">
                                        {
                                            editId == null ?
                                                (
                                                    <button
                                                        type="button"
                                                        className={`w-full md:w-56 py-2 px-4 flex items-center justify-center gap-x-6 font-bold text-base border border-gray-300 hover:border-gray-400 rounded-md ${newProducts.cantidad <= 0 && "cursor-not-allowed"}`}
                                                        onClick={addProducts}
                                                        disabled={newProducts.cantidad <= 0 ? true : false}
                                                    >
                                                        <PlusIcon className="size-5" />
                                                        Agregar producto
                                                    </button>
                                                )
                                                :
                                                (null)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-full flex items-center justify-center gap-x-1 mt-2 top-0 sticky border border-gray-300 hover:border-gray-400 py-1 px-2 outline-none'>
                            <label htmlFor="searchDataTable"><Search className="size-4" /></label>
                            <input
                                id="searchDataTable"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border-0 rounded-none outline-none"
                            />
                        </div>

                        <div className="h-72 w-full top-0 mx-auto">
                            <div className="w-full h-full scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll top-0">
                                <Table.Root size="1" variant="ghost" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x w-lg md:w-auto">
                                    <Table.Header className="top-0 sticky bg-white">
                                        <Table.Row align="center">
                                            <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell align="center">Cantidad</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell align="right">Acción</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {
                                            filteredDataProducts?.map(product => (
                                                <Table.Row key={product.id_producto} className="hover:bg-gray-100/85 transition-all duration-200">

                                                    <Table.Cell>
                                                        {
                                                            product.nombre_producto
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell align="center">
                                                        {
                                                            editId === product.id_producto ?
                                                                (
                                                                    product.cantidad
                                                                )
                                                                :
                                                                product.cantidad
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell align="right">
                                                        {
                                                            editId === product.id_producto ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        editProduct()
                                                                    }}
                                                                >
                                                                    <Save className="h-4 w-4" />
                                                                    <span className="sr-only">Save changes</span>
                                                                </button>
                                                            )
                                                                : (
                                                                    <div className="flex items-center justify-center flex-row gap-x-2 mt-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                // setNewProducts({ ...newProducts, id_producto: product.id_producto})
                                                                                newProducts.id_producto = product.id_producto;
                                                                                newProducts.nombre_producto = product.nombre_producto;
                                                                                newProducts.precio_venta = product.precio_venta;
                                                                                newProducts.cantidad = +product.cantidad;

                                                                                setEditId(product.id_producto)
                                                                            }}
                                                                        >
                                                                            <Edit className="size-4" />
                                                                            <span className="sr-only">Edit data</span>
                                                                        </button>

                                                                        {
                                                                            filteredDataProducts.length > 1 ?
                                                                                (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            deleteProduct(product.id_producto);
                                                                                            setDeletedProductInventory(product)
                                                                                        }}
                                                                                    >
                                                                                        <Trash2 className="size-4" />
                                                                                    </button>
                                                                                )
                                                                                :
                                                                                (null)
                                                                        }
                                                                    </div>
                                                                )
                                                        }
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        }
                                        <Table.Row>
                                            {
                                                filteredDataProducts?.length === 0 && (
                                                    <Table.Cell colSpan={3}>
                                                        <div className="flex items-center h-44 flex-col justify-center">
                                                            <NotFoundEmpty />
                                                            <p className='text-center font-bold text-2xl'>Aún no hay registros agregados...</p>
                                                        </div>
                                                    </Table.Cell>
                                                )
                                            }
                                        </Table.Row>

                                        {
                                            deletedProductInventory &&
                                            (
                                                <DeleteProductInInventoryAlertDialog product={deletedProductInventory} onClose={() => setDeletedProductInventory(null)} />
                                            )
                                        }
                                    </Table.Body>
                                </Table.Root>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full md:w-[50%] mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200 ${customerName == undefined || customerName == null || productId == null || productId == undefined ? "cursor-not-allowed" : ""}`}
                            aria-label="Close"
                            disabled={customerName == undefined || customerName == null || productId == null || productId == undefined ? true : false}
                        >
                            <Edit className="size-5" />
                            Modificar remisón
                        </button>

                    </form>
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                            onClick={() => {
                                navigate(location.pathname, { replace: true })
                                reset();
                            }}
                        >
                            <X />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </>
    )
}