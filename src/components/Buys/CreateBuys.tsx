import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calculator, Edit, Plus, PlusIcon, Save, Search, Trash2, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { createBuys } from "../../apis/BuysAPI";
import { BuysFormDataAdd, TempPurchasingFormDataDetails } from "../../types/buysData";
import { ProductDataCombobox } from "../../types/productData";
import { SupplierFormDataInfo } from "../../types/supplierData";
import { formatCurrency } from "../../utils/utils";
import { Table } from "@radix-ui/themes";
import NotFoundEmpty from "../NotFoundEmpty";
import SupplierComboBoxBuys from "../Supplier/SupplierComboBoxBuys";
import ProductsComboBoxBuys from "../Product/ProductsComboBoxBuys";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreateBuys() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin,
        precioCompra: number;

    const [open, setOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isCheckedCuentaPorPagar, setIsCheckedCuentaPorPagar] = useState(false);
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [daysDifference, setDaysDifference] = useState(0)
    const [subtotal, setSubtotal] = useState(0)
    const [total, setTotal] = useState(0)
    const [taxesValue, setTaxesValue] = useState(15);
    const [valorImpuesto, setValorImpuesto] = useState(0)
    const [errorActive, setErrorActive] = useState(false)
    const [dataProducts, setDataProducts] = useState<TempPurchasingFormDataDetails[]>(sessionStorage.getItem("tempProductsAddBuys") ? JSON.parse(sessionStorage.getItem("tempProductsAddBuys")!) : [])
    const [editId, setEditId] = useState<string | null>(null)    
    const [newProducts, setNewProducts] = useState<TempPurchasingFormDataDetails>({
        id_producto: "",
        nombre_producto: "",
        precio_compra: "",
        cantidad: 0,
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

    const [newBuys, setNewBuys] = useState({
        numero_factura_proveedor: "0",
        termino: '',
        observaciones: '',
        subtotal: '',
        total: '',
        cuenta_por_pagar: 0,
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
        fecha_vencimiento: "",
        estado: 1,
        id_proveedor: '',
        detalles_compra: [{
            nombre_producto: "",
            precio_compra: "",
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
        }],
        usuario_creador: ''
    })

    useEffect(() => {
        const storedProducts = sessionStorage.getItem("tempProductsAddBuys");
        if (storedProducts) {
            setDataProducts(JSON.parse(storedProducts));
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem("tempProductsAddBuys", JSON.stringify(dataProducts));
    }, [dataProducts])


    // * Get supplier information                
    const [supplierData, setSupplierData] = useState<SupplierFormDataInfo | null>(null)

    // * Get products information        
    const [productId, setProductId] = useState<ProductDataCombobox | null>(null)


    const addProducts = () => {
        setDataProducts([newProducts, ...dataProducts]);

        MySwal.fire({
            position: "center",
            title: "Producto",
            icon: "success",
            html:
                <div className="flex flex-col items-center">
                    <p>
                        El producto:
                        <br />
                        <span className="text-cyan-700 font-bold">{newProducts.nombre_producto}</span>
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
            nombre_producto: "",
            precio_compra: "",
            cantidad: 0,
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
        setSubtotal(0);
    }

    const editProduct = () => {
        handleCalculateSubtotalEdit(newProducts.cantidad, +newProducts.precio_compra);

        setDataProducts(dataProducts.map(p => p.id_producto === newProducts.id_producto ? newProducts : p))
        MySwal.fire({
            position: "center",
            title: "Producto",
            icon: "success",
            html:
                <div className="flex flex-col items-center">
                    <p>
                        El producto:
                        <br />
                        <span className="text-cyan-700 font-bold">{newProducts.nombre_producto}</span>
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
            nombre_producto: "",
            precio_compra: "",
            cantidad: 0,
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
        sessionStorage.clear();
        setSubtotal(0);
        setEditId(null);
    }

    const deleteProduct = (id_product: string) => {
        setDataProducts(dataProducts.filter((item) => item.id_producto !== id_product));
        sessionStorage.setItem("tempProductsAddBuys", JSON.stringify(dataProducts));
    }

    const handleCalculateSubtotal = (e: number) => {
        if (newProducts.cantidad === undefined) {
            setErrorActive(true);

            setTimeout(() => {
                setErrorActive(false);
            }, 3000);
            return;
        }

        precioCompra = +productId!.precio_compra;
        const resultSubtotal = precioCompra * e;
        setSubtotal(+resultSubtotal.toFixed(2));
        newProducts.subtotal = resultSubtotal.toFixed(2).toString();
    }
    const handleCalculateSubtotalEdit = (e: number, precioCompra: number) => {

        if (newProducts.cantidad === undefined) {
            setErrorActive(true);

            setTimeout(() => {
                setErrorActive(false);
            }, 3000);
            return;
        }

        const resultSubtotal = e * precioCompra;
        const result = +resultSubtotal
        setSubtotal(+result.toFixed(2));
        newProducts.subtotal = resultSubtotal.toFixed(2).toString();
        setNewProducts({ ...newProducts, subtotal: result.toString() })
    }

    function handleCalculateTotal() {
        let sum = 0;
        dataProducts.forEach((item) => {
            sum += +item.subtotal;
        })


        newBuys.subtotal = sum.toString();

        return sum.toString();
    }

    const handleCalculateTotalWithTaxes = () => {
        let sum = 0;
        dataProducts.forEach((item) => {
            sum += +item.subtotal;
        })

        newBuys.total = sum.toString();

        if (taxesValue < 0) {

            MySwal.fire({
                position: "center",
                title: "Valor del impuesto",
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
        newBuys.total = result.toString();
        setTotal(result)
    }

    const handleSelectionSupplier = (dataSupplier: SupplierFormDataInfo) => {
        setSupplierData(dataSupplier);

        setNewBuys({ ...newBuys, id_proveedor: dataSupplier.id })
    }

    const handleSelectionProduct = (dataProduct: ProductDataCombobox) => {

        if (dataProducts.find(item => item.id_producto === dataProduct.id)) {
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
        newProducts.id_producto = dataProduct!.id;
        newProducts.nombre_producto = dataProduct!.nombre_producto;
        // newProducts.precio_compra = dataProduct!.precio_compra;
    }

    useEffect(() => {
        const dateStart = new Date().toDateString();
        setStartDate(dateStart.toString());
        const differenceDatetime = new Date(endDate).getTime() - new Date(startDate).getTime();
        const differenceDateDays = differenceDatetime / (1000 * 3600 * 24);
        setDaysDifference(differenceDateDays)
    }, [endDate, startDate])

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createBuys,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Compra",
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
            navigate(location.pathname, { replace: true })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["buys"] })
            MySwal.fire({
                position: "center",
                title: "Compra",
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
            setOpen(false);
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BuysFormDataAdd>({ defaultValues: newBuys });


    const [searchTerm, setSearchTerm] = useState("")

    const filtereddataProducts = dataProducts?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const getDataLocalStorage = (products: TempPurchasingFormDataDetails[]) => {
        return products.map((productsStorage) => {
            return {
                nombre_producto: productsStorage.nombre_producto,
                precio_compra: productsStorage.precio_compra,
                cantidad: productsStorage.cantidad,
                subtotal: productsStorage.subtotal,
                id_producto: productsStorage.id_producto,
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

    const onSubmitCreateBuys = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newBuys.usuario_creador = idUSerLogin;
        const dataStorage = getDataLocalStorage(dataProducts);
        newBuys.detalles_compra = dataStorage;
        newBuys.impuesto_manual = [{
            porcentaje: taxesValue.toString() + "%",
            valor_porcentaje: taxesValue,
            valor_cantidad: valorImpuesto
        }]

        newBuys.estado = 1;

        if (endDate === "") {
            newBuys.fecha_vencimiento = "";
        }
        else {
            newBuys.fecha_vencimiento = endDate;
        }

        const data = newBuys;

        mutate(data)
        setNewBuys({
            numero_factura_proveedor: "0",
            termino: '',
            observaciones: '',
            subtotal: '',
            total: '',
            cuenta_por_pagar: 0,
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
            fecha_vencimiento: "",
            estado: 1,
            id_proveedor: '',
            detalles_compra: [{
                nombre_producto: "",
                precio_compra: "",
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
            }],
            usuario_creador: idUSerLogin!
        })
        sessionStorage.clear();
        setValorImpuesto(0);
        setTotal(0);
        setTaxesValue(0);
        setIsChecked(false)
        reset()
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium  text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full md:w-[50%]"
                        onClick={() =>
                            navigate(location.pathname + "?newBuys")
                        }
                    >
                        <Plus className="size-5" />
                        Crear compra
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content
                        onPointerDownOutside={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                        className={`fixed left-1/2 top-1/2 h-[98%] w-full sm:w-[96%] sm:mx-auto px-2 py-4 md:p-6 scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Crear compra
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Crea tus compras aquí...
                        </Dialog.Description>

                        <div className="border border-gray-600 rounded-md h-80 mx-auto touch-pan-y scrollbar-thin-custom scroll-smooth w-[88%] md:w-full px-1 sm:p-4 overflow-scroll">
                            <div className="flex flex-col md:flex-row items-start justify-start gap-x-4">

                                <div className="flex h-full w-full flex-col items-center">

                                    <div className="w-full">
                                        <label htmlFor="numero_factura_proveedor" className="font-bold">Número Factura Proveedor:</label>
                                        <input
                                            {...register("numero_factura_proveedor", {
                                                required: "El número de factura del proveedor es requerido...",
                                            })}
                                            id="numero_factura_proveedor"
                                            className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2"
                                            value={newBuys.numero_factura_proveedor}
                                            onChange={(e) => setNewBuys({ ...newBuys, numero_factura_proveedor: e.target.value })}
                                            type="number"
                                            placeholder="Ejemplo: xxxxx..."
                                        />

                                        {errors.numero_factura_proveedor ?
                                            (
                                                <ErrorMessage>{errors.numero_factura_proveedor!.message}</ErrorMessage>
                                            )
                                            :
                                            +newBuys.numero_factura_proveedor <= 0 &&
                                            (
                                                <ErrorMessage>{"La factura no puede ser 0 o un número menor a 0"}</ErrorMessage>
                                            )
                                        }
                                    </div>

                                    <div className="flex flex-1 w-full items-center justify-center">
                                        <div className="w-full">
                                            <label htmlFor="observaciones" className="font-bold">Observaciones:</label>
                                            <textarea
                                                {...register("observaciones", {
                                                    required: "La observación es requerida...",
                                                })}
                                                id="observaciones"
                                                className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2"
                                                placeholder="Ejemplo: xxxxx..."
                                                value={newBuys.observaciones}
                                                onChange={(e) => setNewBuys({ ...newBuys, observaciones: e.target.value })}
                                            />
                                            {errors.observaciones && (
                                                <ErrorMessage>{errors.observaciones!.message}</ErrorMessage>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <div className="w-full">
                                        <label htmlFor="termino" className="font-bold">Termino:</label>
                                        
                                    </div>

                                    <div className="w-full flex flex-row-reverse items-center justify-center gap-x-1 my-4">
                                        <label
                                            htmlFor="checked_cuenta_por_pagar"
                                            className="font-bold text-gray-900"
                                        >
                                            Agregar a cuenta por pagar
                                        </label>
                                        <input
                                            type="checkbox"
                                            name=""
                                            id="checked_cuenta_por_pagar"
                                            className=""
                                            checked={isCheckedCuentaPorPagar}
                                            onChange={(e) => {
                                                setIsCheckedCuentaPorPagar(e.target.checked)
                                                setNewBuys({ ...newBuys, cuenta_por_pagar: +e.target.checked })
                                            }}
                                        />
                                    </div>

                                    {
                                        isCheckedCuentaPorPagar == true &&
                                        (
                                            <div className="w-full border border-gray-400 rounded-lg py-4 px-2 h-auto">
                                                <h2 className="text-center font-bold text-xl">Agregar configuración a cuentas por pagar</h2>

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

                            <div className="flex flex-col md:flex-row items-start w-full justify-center gap-x-4">
                                <div className="flex flex-1 w-full items-center mt-4 border border-gray-400 px-1 py-2 sm:p-4 rounded-lg">
                                    <div className="w-full flex items-center justify-center flex-col">

                                        <ProductsComboBoxBuys onSelectionChange={handleSelectionProduct} />

                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label htmlFor="nombre_producto" className="font-bold mb-1">Producto:</label>
                                            <input
                                                className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                                id="nombre_producto"
                                                required
                                                value={productId?.nombre_producto}
                                                type="text"
                                                disabled placeholder="Tus productos aquí..."
                                            />
                                        </div>

                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label htmlFor="precio_compra" className="font-bold mb-1">Precio:</label>
                                            <input
                                                className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2"
                                                id="precio_compra"
                                                required
                                                value={+newProducts.precio_compra}
                                                onChange={(e) => setNewProducts({ ...newProducts, precio_compra: e.target.value })}
                                                type="number"
                                                placeholder="Precio del producto..."
                                            />
                                        </div>

                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label htmlFor="cantidad" className="font-bold mb-1">Cantidad comprada:</label>
                                            <input
                                                className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2"
                                                id="cantidad"
                                                required
                                                value={newProducts.cantidad}
                                                onChange={(e) => {

                                                    if (editId == null) {
                                                        handleCalculateSubtotal(+e.target.value);
                                                    }

                                                    handleCalculateSubtotalEdit(+e.target.value, +newProducts.precio_compra);
                                                    setNewProducts({ ...newProducts, cantidad: +e.target.value });
                                                }}
                                                type="number"
                                                placeholder="Ejemplo: xxx..."
                                            />
                                            {
                                                newProducts.cantidad == null ||
                                                    newProducts.cantidad == undefined ? (
                                                    <ErrorMessage>{"La cantidad es requerida..."}</ErrorMessage>
                                                )
                                                    :
                                                    newProducts.cantidad < 0 &&
                                                    (
                                                        <ErrorMessage>{"La cantidad no puede ser menor a 0..."}</ErrorMessage>
                                                    )
                                            }
                                        </div>
                                        {
                                            errorActive &&
                                            <p className="text-red-500 text-sm font-bold">Este campo es requerido...</p>
                                        }

                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label htmlFor="subtotal" className="font-bold mb-1">Subtotal:</label>
                                            <input
                                                className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                                id="subtotal"
                                                value={formatCurrency(subtotal.toString())}
                                                type="text"
                                                disabled placeholder="Subtotal por producto..."

                                            />
                                        </div>

                                        <div className="w-full flex items-center justify-center mt-8">

                                            {
                                                editId == null ?
                                                    (
                                                        <button
                                                            type="button"
                                                            className={`w-full bg-white md:w-56 py-2 px-4 flex items-center justify-center gap-x-6 font-bold text-base border border-gray-400 hover:border-gray-600 outline-none rounded-md ${newProducts.cantidad <= 0 && "cursor-not-allowed"}`}
                                                            onClick={addProducts}
                                                            disabled={
                                                                newProducts.cantidad <= 0 ?
                                                                    true
                                                                    :
                                                                    false
                                                            }
                                                        >
                                                            <PlusIcon className="size-5" />
                                                            Agregar producto
                                                        </button>
                                                    )
                                                    :
                                                    ""
                                            }

                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-1 w-full items-center justify-center mt-4 border border-gray-400 rounded-lg px-1 py-2 sm:p-4">
                                    <div className="w-full flex items-center justify-center flex-col">
                                        <div className="w-full flex items-center justify-center gap-x-2">
                                            <SupplierComboBoxBuys onSelectionChange={handleSelectionSupplier} />
                                        </div>

                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label htmlFor="nombre_proveedor" className="font-bold mb-1">Proveedor:</label>
                                            <input
                                                className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2"
                                                id="nombre_proveedor"
                                                value={supplierData?.nombre_proveedor}
                                                type="text"
                                                disabled
                                                placeholder="Tus proveedores aquí..."
                                            />
                                        </div>

                                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                            <label htmlFor="ruc" className="font-bold mb-1">RUC:</label>
                                            <input
                                                className="w-full border border-gray-400 hover:border-gray-600  outline-none rounded-md py-1 px-2"
                                                id="ruc"
                                                value={supplierData?.ruc}
                                                type="text"
                                                disabled
                                                placeholder="RUC del proveedor..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-[85%] md:w-[74%] mx-auto md:mx-0 mt-4 top-0 sticky flex items-center justify-center gap-x-1 border border-gray-400 hover:border-gray-600 py-1 px-2'>
                            <Search className="size-5" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>

                        <div className="h-auto w-[85%] lg:w-full flex-col lg:flex-row flex md:gap-x-4 gap-y-4 items-start justify-center mx-auto">
                            <div className="w-full sm:w-full lg:w-[75%] h-96 scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth">
                                <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x">
                                    <Table.Header className="top-0 sticky bg-white">
                                        <Table.Row align="center">
                                            <Table.ColumnHeaderCell width="400px">Producto</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell align="center">Cantidad</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell align="center">P. Unitario</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell align="center">Subtotal</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {
                                            filtereddataProducts?.map(product => (
                                                <Table.Row key={product.id_producto} className="hover:bg-gray-100/85 transition-all duration-200">

                                                    <Table.Cell>
                                                        {
                                                            product.nombre_producto
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell align="center" className="text-center">
                                                        {
                                                            editId === product.id_producto ?
                                                                (
                                                                    product.cantidad
                                                                )
                                                                :
                                                                product.cantidad
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell align="center">
                                                        {
                                                            product.precio_compra === undefined ? 0 : formatCurrency(product.precio_compra)
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell align="center">
                                                        {
                                                            formatCurrency(product.subtotal)
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell align="center">
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
                                                                    <div className="flex items-center flex-col gap-y-4 justify-center md:flex-row md:gap-x-2 mt-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                // setNewProducts({ ...newProducts, id_producto: product.id_producto})
                                                                                newProducts.id_producto = product.id_producto;
                                                                                newProducts.nombre_producto = product.nombre_producto;
                                                                                newProducts.precio_compra = product.precio_compra;
                                                                                newProducts.cantidad = +product.cantidad;

                                                                                setEditId(product.id_producto)
                                                                            }}
                                                                        >
                                                                            <Edit className="size-6 sm:size-4" />
                                                                            <span className="sr-only">Edit data</span>
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="ml-2"
                                                                            onClick={() => {
                                                                                deleteProduct(product.id_producto);
                                                                                MySwal.fire({
                                                                                    position: "center",
                                                                                    title: "Producto",
                                                                                    icon: "warning",
                                                                                    html:
                                                                                        <div className="flex flex-col items-center">
                                                                                            <p>
                                                                                                El producto:
                                                                                                <br />
                                                                                                <span className="text-red-500 font-bold">{product.nombre_producto},</span>
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
                                                                            <Trash2 className="size-6 sm:size-4" />
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
                                                filtereddataProducts?.length === 0 && (
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
                                    <label htmlFor="value_tax" className="font-bold text-start text-gray-600 w-full">IVA:</label>
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
                                        onClick={() => handleCalculateTotalWithTaxes()}
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


                        <div className="flex mt-4 items-center justify-center md:gap-x-8">
                            <form
                                onSubmit={handleSubmit(onSubmitCreateBuys)}
                            >
                                <button
                                    type="submit"
                                    className={`w-full md:w-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200 ${supplierData == undefined || supplierData?.nombre_proveedor == "" ? "cursor-not-allowed" : ""}`}
                                    aria-label="Close"
                                    disabled={supplierData == undefined || supplierData?.nombre_proveedor == "" ? true : false}
                                >
                                    <Save className="size-5" />
                                    Guardar compra
                                </button>

                            </form>
                        </div>

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
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}