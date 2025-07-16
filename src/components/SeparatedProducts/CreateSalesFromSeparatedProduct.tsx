import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calculator, Edit, PlusIcon, Save, Search, Trash2, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import { formatCurrency } from "../../utils/utils";
import { Table } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import { DataItem, TempPurchasingFormData, TempPurchasingFormDataAdd } from "../../types/buysData";
import { stateValue } from "../../locales/valueState";
import { DataItemCustomer } from "../../types/customerData";
import { getCustomers } from "../../api/CustomerAPI";
import ProductsComboBoxInventory from "../Product/ProductComboBoxInventory";
import { createSalesFromSeparatedProduct } from "../../api/SalesAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import { SeparatedProductFormDataEdit, SeparatedProductFormDataInfo } from "../../types/separatedProductsData";
import { AuthPermissions } from "../../types/authData";
import { getDetailsSeparatedproductById } from "../../api/SeparatedProductAPI";

const MySwal = withReactContent(Swal);


interface SeparatedProductProps {
    separatedProduct: SeparatedProductFormDataInfo;
    numero_apartado?: string;
    dataAuth: AuthPermissions;
}

export default function CreateSalesFromSeparatedProduct({ separatedProduct, numero_apartado, dataAuth }: SeparatedProductProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const idSeparatedProduct = queryParams.get("createBilling")!
    const id = idSeparatedProduct;
    let idUSerLogin,
        precioVenta: number;

    const [stockProduct, setStockProduct] = useState<number | null>(0)
    const [pricingNew, setPricingNew] = useState<string | undefined>("")
    const [pricingNewManual, setPricingNewManual] = useState<string | undefined>("")
    const [activePricing, setActivePricing] = useState(false)
    const [isChecked, setIsChecked] = useState(false);
    const [isCheckedCuentaPorCobrar, setIsCheckedCuentaPorCobrar] = useState(false);
    const [taxesValue, setTaxesValue] = useState(15);
    const [valorImpuesto, setValorImpuesto] = useState(0)
    const [subtotal, setSubtotal] = useState(0)
    const [total, setTotal] = useState(0)
    const [startDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [daysDifference, setDaysDifference] = useState(0)
    const [dataProducts, setDataProducts] = useState<TempPurchasingFormData[]>(sessionStorage.getItem("tempProductsDataSeparatedProduct") ? JSON.parse(sessionStorage.getItem("tempProductsDataSeparatedProduct")!) : [])
    const [editId, setEditId] = useState<string | null>(null)
    // * customer
    const [customerName, setCustomerName] = useState<DataItemCustomer[]>([])

    const [pricingProduct, setPricingProduct] = useState<DataItem[]>([])

    const [dataSeparatedProduct] = useState(separatedProduct)

    const [newSales, setNewSales] = useState({
        termino: "",
        observaciones: "",
        subtotal: "",
        total: "",
        dias: 0,
        fecha_vencimiento: "",
        estado: 0,
        id_cliente: "",
        usuario_creador: "",
        cuenta_por_cobrar: 0,
        impuesto_manual: [{
            porcentaje: "",
            valor_porcentaje: 0,
            valor_cantidad: 0
        }],
        metodo_pago: [{
            metodo: "",
            monto: "",
            descripcion: ""
        }],
        detalles_venta: [{
            nombre_producto: "",
            precio_venta: "",
            cantidad: 0,
            subtotal: "",
            id_producto: "",
            utilidad1: 0,
            utilidad2: 0,
            utilidad3: 0,
            utilidad4: 0,
            precio1: "",
            precio2: "",
            precio3: "",
            precio4: ""
        }]
    })

    const [newProducts, setNewProducts] = useState<TempPurchasingFormData>({
        id_producto: "",
        id_inventario: "",
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

    const { data } = useQuery({
        queryKey: ["separatedProducts", id],
        queryFn: () => getDetailsSeparatedproductById({ id }),
        enabled: !!id,
        retry: false
    })

    useEffect(() => {
        if (data) {
            setDataProducts(data.map(item => ({
                ...item,
                precio_compra: item.precio_compra || "0",
                stock: item.stock || 0
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
        const currentLabel = customerName.find(item => item.value === dataSeparatedProduct.id_cliente)?.label || "";
        setcustomerInput(currentLabel);
    }, [dataSeparatedProduct.id_cliente, customerName]);

    useEffect(() => {
        const startDate = new Date();
        const differenceDatetime = new Date(endDate).getTime() - new Date(startDate).getTime();
        const differenceDateDays = differenceDatetime / (1000 * 3600 * 24) + 1;
        setDaysDifference(parseInt(differenceDateDays.toString()))

    }, [endDate, startDate])

    useEffect(() => {
        const storedProducts = sessionStorage.getItem("tempProductsDataSeparatedProduct");
        if (storedProducts) {
            setDataProducts(JSON.parse(storedProducts));
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem("tempProductsDataSeparatedProduct", JSON.stringify(dataProducts));
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
            id_producto: "",
            id_inventario: "",
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
        handleCalculateSubtotalEdit(newProducts.cantidad, +newProducts.precio_venta);

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
                        <span className="text-cyan-500 font-bold">{newProducts.nombre_producto}</span>
                        <br />
                        se modifico correctamente...
                    </p>
                </div>
            ,
            showConfirmButton: false,
            timer: 1500
        });

        setNewProducts({
            id_producto: "",
            id_inventario: "",
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
        sessionStorage.setItem("tempProductsDataSeparatedProduct", JSON.stringify(dataProducts));
    }

    const handleCalculateSubtotal = (e: number) => {
        if (newProducts.cantidad === undefined) {
            MySwal.fire({
                position: "center",
                title: "Producto",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p>
                            La cantidad no puede estar vacía...
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
            return;

        }

        if (activePricing) {
            precioVenta = parseFloat(pricingNewManual!);
            const resultSubtotal = parseFloat(precioVenta.toString()) * parseFloat(e.toString());

            setSubtotal(parseFloat(resultSubtotal.toFixed(2)));
            newProducts.subtotal = resultSubtotal.toFixed(2).toString();
            newProducts.precio_venta = precioVenta.toString();
        }
        else {
            precioVenta = parseFloat(pricingNew!);
            const resultSubtotal = parseFloat(precioVenta.toString()) * parseFloat(e.toString());

            setSubtotal(parseFloat(resultSubtotal.toFixed(2)));
            // setSubtotal(+resultSubtotal.toFixed(2));
            newProducts.subtotal = resultSubtotal.toFixed(2).toString();
            newProducts.precio_venta = precioVenta.toString();
        }

    }


    const handleCalculateSubtotalEdit = (e: number, precio_venta: number) => {
        if (newProducts.cantidad === undefined) {
            MySwal.fire({
                position: "center",
                title: "Producto",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p>
                            La cantidad no puede estar vacía...
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const resultSubtotal = e * precio_venta;
        const result = +resultSubtotal
        // setSubtotal(+result.toFixed(2));
        newProducts.subtotal = resultSubtotal.toFixed(2).toString();
        setNewProducts({ ...newProducts, subtotal: result.toString() })
    }

    function handleCalculateTotal() {
        let sum = 0;
        dataProducts.forEach((item) => {
            sum += +item.subtotal;
        })

        newSales.subtotal = sum.toFixed(2).toString();
        return sum.toString();
    }

    const handleCalculateTotalWithTaxes = () => {
        let sum = 0;
        dataProducts.forEach((item) => {
            sum += +item.subtotal;
        })

        newSales.total = sum.toFixed(2).toString();

        if (taxesValue < 0) {
            MySwal.fire({
                position: "center",
                title: "Impuesto",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-red-500 font-bold">
                            El valor del impuesto no puede ser menor a 0...
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (taxesValue === 0) {
            setTotal(subtotal);
            setValorImpuesto(0);
            return
        }


        const resultTax = sum * taxesValue / 100;
        setValorImpuesto(resultTax);
        const result = sum + resultTax;
        dataSeparatedProduct.total = result.toFixed(2).toString();
        setTotal(result)
    }

    const getStockByProduct = (stock: number) => {
        setStockProduct(stock)
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

        const pricing = [dataProduct.precio1, dataProduct.precio2, dataProduct.precio3, dataProduct.precio4]
        const label = [dataProduct.utilidad1, dataProduct.utilidad2, dataProduct.utilidad3, dataProduct.utilidad4]

        const data = pricing.map((value, index) => ({
            value,
            label: label[index]
        }));

        setPricingProduct(data);

        newProducts.id_producto = dataProduct!.id_producto;
        newProducts.nombre_producto = dataProduct!.nombre_producto;
    }

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createSalesFromSeparatedProduct,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "facturación",
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
            queryClient.invalidateQueries({ queryKey: ["separatedProduct"] })
            queryClient.invalidateQueries({ queryKey: ["createSales", idSeparatedProduct] })
            MySwal.fire({
                position: "center",
                title: "Facturación",
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
        }
    })

    const {
        handleSubmit,
        reset,
    } = useForm<SeparatedProductFormDataEdit>()


    const [searchTerm, setSearchTerm] = useState("")

    const filteredDataProducts = dataProducts?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const getDataLocalStorage = (products: TempPurchasingFormDataAdd[]) => {

        return products.map((productsStorage) => {
            return {
                nombre_producto: productsStorage.nombre_producto,
                precio_venta: productsStorage.precio_venta,
                cantidad: productsStorage.cantidad,
                subtotal: productsStorage.subtotal,
                id_producto: productsStorage.id_producto,
                id_inventario: productsStorage.id_inventario,
                utilidad1: productsStorage.utilidad1,
                utilidad2: productsStorage.utilidad2,
                utilidad3: productsStorage.utilidad3,
                utilidad4: productsStorage.utilidad4,
                precio1: productsStorage.precio1,
                precio2: productsStorage.precio2,
                precio3: productsStorage.precio3,
                precio4: productsStorage.precio4
            }
        })
    }

    const onSubmitEditSalesQuote = () => {

        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newSales.usuario_creador = idUSerLogin;
        const dataStorage = getDataLocalStorage(dataProducts)
        handleCalculateTotalWithTaxes();
        newSales.total = total === 0 ? handleCalculateTotal() : total.toString();
        newSales.detalles_venta = dataStorage;
        newSales.dias = daysDifference;
        newSales.impuesto_manual = [{
            porcentaje: taxesValue.toString() + "%",
            valor_porcentaje: taxesValue,
            valor_cantidad: valorImpuesto
        }];

        if (customerInput != "") {
            newSales.id_cliente = separatedProduct.id_cliente;
        }

        setNewSales({ ...newSales, subtotal: dataSeparatedProduct.subtotal });
        
        if(newSales.cuenta_por_cobrar === 1) {
            newSales.fecha_vencimiento = endDate;
        }

        const formData = newSales;
        const dataSales = { idSeparatedProduct, formData }

        mutate(dataSales)

        sessionStorage.clear();
        setDataProducts([])
        setTotal(0)
        reset();
        setEndDate("")
        setPricingNew("")
        setPricingNewManual("")
    }

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/65 data-[state=open]:animate-overlayShow" />
                <Dialog.Content
                    className="fixed left-1/2 top-1/2 h-[98%] w-full sm:w-[96%] sm:mx-auto px-2 py-4 md:p-6 scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Convertir el apartado del producto en factura
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Convertir el numero de apartado: <span className="text-cyan-700 font-bold">{numero_apartado}</span> en factura...
                    </Dialog.Description>

                    <div className="border border-gray-600 rounded-md h-80 sm:mx-auto scrollbar-thin-custom touch-pan-y scroll-smooth w-[88%] md:w-full px-1 sm:p-4 overflow-scroll">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-x-4">

                            <div className="flex flex-1 w-full flex-col">
                                <div className="flex flex-col md:flex-row w-full items-center gap-x-4">
                                    <div className="w-full block">
                                        <label htmlFor="termino" className="font-bold w-full">Termino:</label>
                                        <input
                                            className="w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none"
                                            id="termino"
                                            value={newSales.termino}
                                            onChange={(e) => setNewSales({ ...newSales, termino: e.target.value })}
                                            type="text"
                                            placeholder="Ejemplo: xxxxx..."
                                        />
                                    </div>

                                    <div className="flex w-full items-start gap-y-1 md:gap-x-2 flex-col">
                                        <div className="w-full block">
                                            <label className="font-bold w-full" htmlFor="estado">Estado:</label>
                                            <select
                                                onChange={(e) => {
                                                    setNewSales({ ...newSales, estado: +e.target.value })
                                                }}
                                                value={newSales.estado}
                                                name=""
                                                id="estado"
                                                className="w-full border border-gray-300 hover:border-gray-500 py-1 px-2 outline-none rounded-md">
                                                {
                                                    stateValue.map(item => (
                                                        <option className="py-0 px-4 bg-slate-50"
                                                            key={item.value}
                                                            value={item.value}
                                                        >
                                                            {
                                                                item.label
                                                            }
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full flex-col md:flex-row items-center gap-x-4 mt-2">
                                    <div className="w-full block">
                                        <label htmlFor="observaciones" className="font-bold w-full">Observaciones:</label>
                                        <textarea
                                            className="w-full border border-gray-300 hover:border-gray-500 py-1 px-2 rounded-md outline-none"
                                            id="observaciones"
                                            value={newSales.observaciones}
                                            onChange={(e) => setNewSales({ ...newSales, observaciones: e.target.value })}
                                            placeholder="Ejemplo: xxxxx..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-1 w-full items-center justify-center">
                                <div className="flex flex-col w-full items-center justify-center mt-4 border border-gray-400 rounded-lg px-1 py-2 sm:p-4">
                                    <h2 className="font-bold text-lg">Selección del cliente</h2>
                                    <div className="w-full flex flex-col items-center justify-center gap-x-2">
                                        <label className="w-full font-bold" htmlFor="categorySearch">Cliente:</label>
                                        <div className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 flex items-center justify-center w-full">
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
                                                        setNewSales({ ...newSales, id_cliente: selectedItem.value });
                                                    }
                                                }}
                                            />
                                            <datalist id="listCsustomer">
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
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start w-full justify-center gap-x-4">
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


                                    {
                                        dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER ?
                                            (
                                                <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                                    <div className="flex items-center mb-3 gap-x-2 justify-center">
                                                        <input
                                                            type="checkbox"
                                                            id="checkboxPricing"
                                                            onChange={() => {
                                                                setActivePricing(!activePricing)
                                                                setPricingNew("")
                                                                setNewProducts({ ...newProducts, cantidad: 0 })
                                                                // setSubtotal(0)
                                                            }}
                                                            checked={activePricing}
                                                        />
                                                        <label htmlFor="checkboxPricing" className="font-bold">Precio manual</label>
                                                    </div>
                                                    <label className="font-bold mb-1 w-full">Precio de venta manual:</label>
                                                    <input
                                                        className={`w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none ${activePricing ? "" : "cursor-not-allowed"}`}
                                                        value={pricingNewManual == "" ? formatCurrency("0") : pricingNewManual}
                                                        onChange={(e) => {
                                                            setPricingNewManual(e.target.value)
                                                        }}
                                                        type="text"
                                                        disabled={activePricing ? false : true}
                                                        placeholder="Precio del producto..."
                                                    />
                                                </div>
                                            )
                                            :
                                            (null)
                                    }


                                    <div className="w-full mt-4 gap-Y-2 flex-col md:flex-row md:gap-y-0 md:gap-x-4 flex items-center">
                                        <div className="w-full block">
                                            <label className="font-bold w-full" htmlFor="precio_automatico">Selecciona la utilidad:</label>
                                            <select
                                                onChange={(e) => {
                                                    setPricingNew(e.target.value)
                                                }}
                                                name=""
                                                id="precio_automatico"
                                                className="w-full bg-gray-50 border border-gray-300 hover:border-gray-500 py-1 px-2 outline-none rounded-md">
                                                {
                                                    pricingProduct!.map(item => (
                                                        <option className="py-0 px-4 bg-slate-50"
                                                            key={item.value}
                                                            value={item.value}
                                                            defaultValue={item.value}
                                                        >
                                                            {
                                                                item.label
                                                            }
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div className="w-full gap-Y-2 flex-col flex items-start">
                                            <label className="font-bold w-full mb-1">Precio con utilidad fija:</label>
                                            <input
                                                className="w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed"
                                                value={pricingNew == "" || pricingNew == undefined || pricingNew == null ? formatCurrency("0") : formatCurrency(pricingNew)}
                                                type="text"
                                                disabled placeholder="Precio del producto..."
                                            />
                                        </div>
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
                                                                    <p>
                                                                        La cantidad no puede ser mayor al stock del inventario...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });

                                                        newProducts.cantidad = stockProduct!;
                                                        return
                                                    }

                                                    if (+e.target.value <= 0) {
                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p>
                                                                        La cantidad no puede ser menor o igual a 0...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });

                                                        newProducts.cantidad = 1;
                                                        return
                                                    }

                                                    handleCalculateSubtotal(+e.target.value)
                                                    handleCalculateSubtotalEdit(+e.target.value, +newProducts.precio_venta)
                                                    setNewProducts({ ...newProducts, cantidad: +e.target.value })
                                                }}
                                                type="number"
                                                placeholder="Ejemplo: xxx..."
                                            />
                                        </div>

                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label className="font-bold mb-1 w-full">Subtotal:</label>
                                            <input
                                                className="w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed"
                                                value={formatCurrency(subtotal.toString())}
                                                type="text"
                                                disabled
                                                placeholder="Subtotal por producto..."

                                            />
                                        </div>
                                    </div>

                                    <div className="w-full flex items-center justify-center mt-8">
                                        <button
                                            type="button"
                                            className={`w-full md:w-56 py-2 px-4 flex items-center justify-center gap-x-6 font-bold text-base border border-gray-300 hover:border-gray-400 rounded-md ${parseFloat(newProducts.subtotal) > 0 || newProducts.subtotal ? "" : "cursor-not-allowed"}`}
                                            onClick={addProducts}
                                            disabled={parseFloat(newProducts.subtotal) > 0 || newProducts.subtotal ? false : true}
                                        >
                                            <PlusIcon className="size-5" />
                                            Agregar producto
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="w-full flex flex-row-reverse items-center justify-center gap-x-1 my-4">
                                    <label
                                        htmlFor="checked_cuenta_por_cobrar"
                                        className="font-bold text-gray-900"
                                    >
                                        Agregar a cuenta por cobrar
                                    </label>
                                    <input
                                        type="checkbox"
                                        name=""
                                        id="checked_cuenta_por_cobrar"
                                        className=""
                                        checked={isCheckedCuentaPorCobrar}
                                        onChange={(e) => {
                                            setIsCheckedCuentaPorCobrar(e.target.checked)
                                            setNewSales({ ...newSales, cuenta_por_cobrar: +e.target.checked })
                                        }}
                                    />
                                </div>

                                {
                                    isCheckedCuentaPorCobrar == true &&
                                    (
                                        <div className="w-full border border-gray-400 rounded-lg py-4 px-2 h-auto">
                                            <h2 className="text-center font-bold text-xl">Agregar configuración a cuentas por cobrar</h2>

                                            <div className="w-full my-4">
                                                <div className="w-full border border-gray-400 rounded-lg py-1 px-2 flex flex-col md:flex-row gap-y-2 items-center gap-x-1 justify-center">

                                                    <div className="flex items-center justify-center">
                                                        <label htmlFor="datePickEnd" className="font-bold">Fecha vencimiento:</label>
                                                        <input
                                                            className="border-gray-400 outline-none focus-visible:border-gray-600 py-1 px-2 rounded-md"
                                                            id="datePickEnd"
                                                            type="date"
                                                            value={endDate}
                                                            onChange={(e) => {
                                                                setEndDate(e.target.value)
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-center md:space-x-1">
                                                        <input
                                                            type="text"
                                                            value={startDate === "" && endDate === "" ? "0" : daysDifference}
                                                            disabled
                                                            className="w-14 text-center cursor-not-allowed rounded-md border border-gray-400 outline-none py-1 px-2" />
                                                        <span className="font-bold">días</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-center gap-x-1 lg:w-[74%] mt-2 top-0 sticky border border-gray-300 hover:border-gray-400 py-1 px-2 outline-none'>
                        <label htmlFor="searchDataTable"><Search className="size-4" /></label>
                        <input
                            id="searchDataTable"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-0 rounded-none outline-none"
                        />
                    </div>

                    <div className="h-96 w-[85%] lg:w-full flex-col lg:flex-row flex md:gap-x-4 gap-y-4 items-start justify-center top-0">
                        <div className="w-full h-full lg:w-[75%] scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll top-0">
                            <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                                <Table.Header className="top-0 sticky bg-white">
                                    <Table.Row align="center">
                                        <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>P. Unitario</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Cantidad</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Valor</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
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

                                                <Table.Cell>
                                                    {
                                                        product.precio_venta === undefined ? 0 : formatCurrency(product.precio_venta)
                                                    }
                                                </Table.Cell>

                                                <Table.Cell>
                                                    {
                                                        editId === product.id_producto ?
                                                            (
                                                                product.cantidad
                                                            )
                                                            :
                                                            product.cantidad
                                                    }
                                                </Table.Cell>

                                                <Table.Cell>
                                                    {
                                                        formatCurrency(product.subtotal)
                                                    }
                                                </Table.Cell>

                                                <Table.Cell>
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
                                                                <div className="flex items-center gap-x-2">
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
                                                                        <Edit className="h-4 w-4" />
                                                                        <span className="sr-only">Edit data</span>
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="ml-2"
                                                                        onClick={() => {
                                                                            deleteProduct(product.id_producto);
                                                                            MySwal.fire({
                                                                                position: "center",
                                                                                title: "Proforma",
                                                                                icon: "warning",
                                                                                html:
                                                                                    <div className="flex flex-col items-center">
                                                                                        <p>
                                                                                            El producto:
                                                                                            <br />
                                                                                            <span className="text-cyan-500 font-bold">{product.nombre_producto}</span>,
                                                                                            <br />
                                                                                            se quito de la lista de compra...
                                                                                        </p>
                                                                                    </div>
                                                                                ,
                                                                                showConfirmButton: false,
                                                                                timer: 1500
                                                                            });
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
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
                                                <Table.Cell colSpan={14}>
                                                    <div className="flex items-center flex-col justify-center">
                                                        <NotFoundEmpty />
                                                        <p className='text-center font-bold text-2xl'>Aún no hay registros agregados...</p>
                                                    </div>
                                                </Table.Cell>
                                            )
                                        }
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                        </div>

                        <div className="w-full lg:w-[25%] flex items-end gap-y-2 flex-col mt-2 border border-gray-500 rounded-lg py-4 px-2 h-96 scrollbar-thin-custom touch-pan-y scroll-smooth overflow-scroll">

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="total_productos" className="font-bold text-gray-600 w-full">Total productos:</label>
                                <input
                                    id="total_productos"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                    value={dataProducts.length}
                                    type="text"
                                    disabled
                                    placeholder="Total de productos..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="subtotal_compra" className="font-bold text-gray-600 w-full">Subtotal de compra:</label>
                                <input
                                    id="subtotal_compra"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 text-green-800 cursor-not-allowed"
                                    value={formatCurrency(handleCalculateTotal().toString())}
                                    type="text"
                                    disabled
                                    placeholder="Subtotal de compra..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="value_tax" className="font-bold text-start text-gray-600 w-full">IVA(Impuesto al valor agregado):</label>
                                <input
                                    id="value_tax"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                    value={valorImpuesto === 0 ? "0.00" : formatCurrency(valorImpuesto.toString())}
                                    type="text"
                                    disabled
                                    placeholder="Impuesto..." />
                            </div>

                            <div className="flex flex-row-reverse w-full items-center justify-center gap-x-1 px-4 sm:px-0 mx-auto">
                                <label htmlFor="checked_impuesto" className="font-bold text-start text-gray-600 w-full">Agregar % manual</label>
                                <input
                                    type="checkbox"
                                    name=""
                                    id="checked_impuesto"
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="impuesto" className="font-bold text-start text-gray-600 w-full">% del impuesto:</label>
                                <input
                                    id="impuesto"
                                    className={`w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 ${isChecked == false && "cursor-not-allowed"}`}
                                    value={taxesValue}
                                    onChange={(e) => {
                                        setTaxesValue(+e.target.value);
                                    }}
                                    disabled={!isChecked}
                                    type="text"
                                    placeholder="Impuesto..." />
                            </div>

                            <div className="flex w-full items-center justify-center mx-auto">
                                <button
                                    type="button"
                                    className="w-full border border-gray-400 hover:border-gray-600 rounded-md py-2 px-4 bg-white flex items-center justify-center gap-x-6 font-bold text-base"
                                    onClick={() => {
                                        handleCalculateTotalWithTaxes()
                                        handleCalculateTotal()
                                    }}
                                >
                                    Calcular con impuesto
                                    <Calculator className="size-5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between px-4 sm:px-0 mx-auto">
                                <label htmlFor="total_compra" className="font-bold text-gray-600 w-full ">Total de compra:</label>
                                <input
                                    id="total_compra"
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 text-green-800 cursor-not-allowed"
                                    value={total === 0 ? formatCurrency(handleCalculateTotal().toString()) : formatCurrency(total.toString())}
                                    type="text"
                                    disabled
                                    placeholder="Total de compra..." />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmitEditSalesQuote)} className="space-y-4 w-[88%] md:w-[90%] p-4">
                        <div className="flex items-center justify-center">
                            <button
                                className="w-full bg-white md:w-56 flex items-center justify-center gap-x-6 font-bold text-base border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none"
                                type="submit"
                                disabled={
                                    dataProducts.length <= 0 ||
                                        newSales.termino == "" ||
                                        newSales.observaciones == ""
                                        ? true : false}
                            >
                                <Save className="size-5" />
                                Guardar factura
                            </button>
                        </div>
                    </form>

                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                            onClick={() => {
                                navigate(location.pathname, { replace: true })
                                reset()
                            }}
                        >
                            <X />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal >
        </>
    )
}