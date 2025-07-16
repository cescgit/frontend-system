import { useForm } from "react-hook-form";
import { PurchaseReturnFormDataAdd, TempPurchaseReturnFormData } from "../../types/purchaseReturnData";
import { createPurchaseReturn } from "../../apis/PurchaseReturnAPI";
import { Dialog } from "radix-ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BuysFormDataInfo, TempPurchasingFormDataDetails } from "../../types/buysData";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import { getDetailsBuysById } from "../../apis/BuysAPI";
import { getSupplier } from "../../apis/SupplierAPI";
import { Calculator, Fingerprint, MoveLeft, MoveRight, Plus, X } from "lucide-react";
import { Table, Tooltip } from "@radix-ui/themes";
import { SupplierFormDataInfo } from "../../types/supplierData";
import { formatCurrency } from "../../utils/utils";
import NotFoundEmpty from "../NotFoundEmpty";
import BuysComboBox from "../Buys/BuysComboBox";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreatePurchaseReturn() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin: string;

    const [open, setOpen] = useState(false);
    const [total, setTotal] = useState(0)
    const [valorImpuesto, setValorImpuesto] = useState(0)
    const [dataBuys, setDataBuys] = useState<BuysFormDataInfo | null>(null)
    const [dataProductsTemp, setDataProductsTemp] = useState<TempPurchasingFormDataDetails[]>([])
    const [dataProducts, setDataProducts] = useState<TempPurchasingFormDataDetails[]>([])

    const [productsReturn, setproductsReturn] = useState<TempPurchasingFormDataDetails>({
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

    const [newPurchaseReturn, setNewPurchaseReturn] = useState({
        numero_compra: "",
        numero_factura_proveedor: "",
        termino: "",
        observaciones: "",
        subtotal: "",
        total: "",
        impuesto_manual: [{
            porcentaje: "",
            valor_porcentaje: 0,
            valor_cantidad: 0
        }],
        id_proveedor: "",
        usuario_creador: "",
        id_compra: "",
        detalle_devolucion_compra: [{
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
        }]
    })

    const handleSelectionBuys = (dataPurchaseReturn: BuysFormDataInfo) => {
        sessionStorage.clear();
        setDataProductsTemp([])
        setDataProducts([])
        setDataBuys(dataPurchaseReturn)        
    }

    const { data: dataSupplierData } = useQuery({
        queryKey: ["suppliers"],
        queryFn: getSupplier,
    })

    const { data: dataDetailsBuys } = useQuery({
        queryKey: ["buys", dataBuys?.id],
        queryFn: () => getDetailsBuysById({ id: dataBuys!.id }),
        enabled: !!dataBuys?.id,
        retry: false
    })

    console.log(dataDetailsBuys)

    useEffect(() => {
        if (dataDetailsBuys) {
            const updatedDataDetailsBuys = dataDetailsBuys.map(product => ({
                ...product,
                utilidad1: 0,
                utilidad2: 0,
                utilidad3: 0,
                utilidad4: 0,
                precio1: "",
                precio2: "",
                precio3: "",
                precio4: ""
            }));
            setDataProductsTemp(updatedDataDetailsBuys)
        }
    }, [dataDetailsBuys])

    useEffect(() => {
        dataSupplierData?.map(suppliersData => {
            if (dataBuys != null) {
                if (suppliersData.id === dataBuys!.id_proveedor) {
                    const resultSupplier = suppliersData;
                    setSupplierValue(resultSupplier)
                }
            }
        });

    }, [dataBuys, dataSupplierData])



    // * Get supplier information
    const [supplierValue, setSupplierValue] = useState<SupplierFormDataInfo | null>(null)


    const addProductsReturn = (product: TempPurchaseReturnFormData) => {
        // Verificamos si el producto ya existe en dataProducts
        const productExists = dataProducts.find(producto => producto.id_producto === product.id_producto);

        // Si el producto ya existe en dataProducts, lo actualizamos
        if (productExists) {
            if (dataProductsTemp[0].cantidad < 1) {

                MySwal.fire({
                    position: "center",
                    title: "Producto",
                    icon: "error",
                    html:
                        <div className="flex flex-col items-center">
                            <p className="text-red-500 font-bold">
                                No se puede devolver más productos de los que se compraron...
                            </p>
                        </div>
                    ,
                    showConfirmButton: false,
                    timer: 1500
                });

                return;
            } else {
                // Actualizar el producto en dataProducts
                const productUpdate = [...dataProducts];
                const productIndex = productUpdate.findIndex(p => p.id_producto === product.id_producto);
                if (productIndex !== -1) {
                    productUpdate[productIndex].cantidad += 1;
                    productUpdate[productIndex].subtotal = (productUpdate[productIndex].cantidad * +productUpdate[productIndex].precio_compra).toFixed(2);
                }
                setDataProducts(productUpdate);

                // Actualizar el producto en dataProductsTemp
                const productUpdateTemp = [...dataProductsTemp];
                const productTempIndex = productUpdateTemp.findIndex(p => p.id_producto === product.id_producto);
                if (productTempIndex !== -1) {
                    productUpdateTemp[productTempIndex].cantidad -= 1;
                    productUpdateTemp[productTempIndex].subtotal = (productUpdateTemp[productTempIndex].cantidad * +productUpdateTemp[productTempIndex].precio_compra).toFixed(2);
                }
                setDataProductsTemp(productUpdateTemp);
            }
        } else {
            productsReturn.id_producto = product.id_producto;
            productsReturn.nombre_producto = product.nombre_producto;
            productsReturn.precio_compra = product.precio_compra;
            productsReturn.cantidad = 1;
            productsReturn.subtotal = (1 * +product.precio_compra).toFixed(2);

            setDataProducts([productsReturn, ...dataProducts]);

            // Actualizar el producto en dataProductsTemp
            const productUpdateTemp = [...dataProductsTemp];
            const productTempIndex = productUpdateTemp.findIndex(p => p.id_producto === product.id_producto);
            if (productTempIndex !== -1) {
                productUpdateTemp[productTempIndex].cantidad -= 1;
                productUpdateTemp[productTempIndex].subtotal = (productUpdateTemp[productTempIndex].cantidad * +productUpdateTemp[productTempIndex].precio_compra).toFixed(2);
            }
            setDataProductsTemp(productUpdateTemp);

            // Limpiar los datos de retorno
            setproductsReturn({
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
            });
        }
    };

    const removeProductsReturn = (product: TempPurchaseReturnFormData) => {
        // Verificamos si el producto ya existe en dataProducts
        const productExists = dataProductsTemp.find(producto => producto.id_producto === product.id_producto);

        // Si el producto ya existe en dataProducts, lo actualizamos
        if (productExists) {
            if (dataProducts[0].cantidad < 1) {
                const productsUpdate = dataProducts.filter((producto) => !(producto.id_producto === product.id_producto && producto.cantidad === 0));
                setDataProducts(productsUpdate)

                MySwal.fire({
                    position: "center",
                    title: "Producto",
                    icon: "error",
                    html:
                        <div className="flex flex-col items-center">
                            <p className="text-red-500 font-bold">
                                No se puede devolver más productos...
                            </p>
                        </div>
                    ,
                    showConfirmButton: false,
                    timer: 1500
                });

                return;
            } else {

                // Actualizar el producto en dataProducts
                const productUpdate = [...dataProductsTemp];
                const productIndex = productUpdate.findIndex(p => p.id_producto === product.id_producto);
                if (productIndex !== -1) {
                    productUpdate[productIndex].cantidad += 1;
                    productUpdate[productIndex].subtotal = (productUpdate[productIndex].cantidad * +productUpdate[productIndex].precio_compra).toFixed(2);
                }
                setDataProductsTemp(productUpdate);

                // Actualizar el producto en dataProductsTemp
                const productUpdateTemp = [...dataProducts];
                const productTempIndex = dataProducts.findIndex(p => p.id_producto === product.id_producto);
                if (productTempIndex !== -1) {
                    productUpdateTemp[productTempIndex].cantidad -= 1;
                    productUpdateTemp[productTempIndex].subtotal = (productUpdateTemp[productTempIndex].cantidad * +productUpdateTemp[productTempIndex].precio_compra).toFixed(2);
                }
                setDataProducts(productUpdateTemp);
            }
        } else {
            // Si el producto no existe en dataProducts, lo agregamos
            const newProductReturn = {
                id_producto: product.id_producto,
                nombre_producto: product.nombre_producto,
                precio_compra: product.precio_compra,
                cantidad: 1,
                subtotal: (1 * +product.precio_compra).toFixed(2),
                utilidad1: product.utilidad1,
                utilidad2: product.utilidad2,
                utilidad3: product.utilidad3,
                utilidad4: product.utilidad4,
                precio1: product.precio1,
                precio2: product.precio2,
                precio3: product.precio3,
                precio4: product.precio4
            };

            setDataProductsTemp([newProductReturn, ...dataProductsTemp]);

            // Actualizar el producto en dataProductsTemp
            const productUpdateTemp = [...dataProducts];
            const productTempIndex = productUpdateTemp.findIndex(p => p.id_producto === product.id_producto);
            if (productTempIndex !== -1) {
                productUpdateTemp[productTempIndex].cantidad -= 1;
                productUpdateTemp[productTempIndex].subtotal = (productUpdateTemp[productTempIndex].cantidad * +productUpdateTemp[productTempIndex].precio_compra).toFixed(2);
            }
            setDataProducts(productUpdateTemp);

            // Limpiar los datos de retorno
            setproductsReturn({
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
            });
        }
    };

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createPurchaseReturn,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Devolución de compra",
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
            queryClient.invalidateQueries({ queryKey: ["purchaseReturn"] })
            MySwal.fire({
                position: "center",
                title: "Devolución de compra",
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
        formState: { errors },
    } = useForm<PurchaseReturnFormDataAdd>({ defaultValues: newPurchaseReturn })


    const [searchTerm, setSearchTerm] = useState("")

    const filteredDataDetails = dataProductsTemp?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const filteredDataDetailsReturn = dataProducts?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const calcularTotal = () => {
        newPurchaseReturn.subtotal = dataProducts.reduce((total, producto) => total + +producto.subtotal, 0).toString();
        return dataProducts.reduce((total, producto) => total + +producto.subtotal, 0);
    };

    const handleCalculateTotalWithTaxes = () => {
        let sum = 0;
        dataProducts.forEach((item) => {
            sum += +item.subtotal;
        })

        // if (taxesValue === undefined) {
        //     return sum;
        // }

        // const resultTax = sum * taxesValue!.valor_cantidad / 100;
        // setValorImpuesto(resultTax);
        // const result = sum + resultTax;
        // setTotal(result)

        // newPurchaseReturn.total = result.toString();
    }

    function handleCalculateTotal() {
        let sum = 0;
        dataProducts.forEach((item) => {
            sum += +item.subtotal;
        })

        return sum.toString();
    }

    const onSubmitCreatePurchaseReturn = () => {

        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newPurchaseReturn.id_proveedor = supplierValue!.id;
        newPurchaseReturn.id_compra = dataBuys!.id;
        newPurchaseReturn.numero_compra = dataBuys!.numero_compra;
        newPurchaseReturn.termino = dataBuys!.termino;
        newPurchaseReturn.numero_factura_proveedor = dataBuys!.numero_factura_proveedor;
        newPurchaseReturn.usuario_creador = idUSerLogin;


        newPurchaseReturn.detalle_devolucion_compra = dataProducts;

        const data = newPurchaseReturn;

        mutate(data)
        sessionStorage.clear();
        setDataProducts([])
        setNewPurchaseReturn({
            numero_compra: "",
            numero_factura_proveedor: "",
            termino: "",
            observaciones: "",
            subtotal: "",
            total: "",
            impuesto_manual: [{
                porcentaje: "",
                valor_porcentaje: 0,
                valor_cantidad: 0
            }],
            id_proveedor: "",
            id_compra: "",
            usuario_creador: idUSerLogin!,
            detalle_devolucion_compra: [{
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
            }]
        })

        setDataProductsTemp([])
        setTotal(0)
        setValorImpuesto(0)
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium  text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full md:w-[50%]"
                        onClick={() =>
                            navigate(location.pathname + "?newPurchaseReturn")
                        }
                    >
                        <Plus className="size-5" />
                        Devolver producto
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content
                        onPointerDownOutside={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                        className={`fixed left-1/2 top-1/2 h-[98%] w-full sm:w-[96%] sm:mx-auto px-2 py-4 md:p-6 touch-pan-x touch-pan-y scroll-smooth overflow-scroll scrollbar-thin-custom -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Devolvolución de producto
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Aquí puedes devolver los productos a proveedores...
                        </Dialog.Description>

                        <div className="border border-gray-600 rounded-md h-64 w-full touch-pan-y scroll-smooth lg:w-full py-4 px-2 md:p-4 overflow-scroll scrollbar-thin-custom">
                            <div className="w-full flex items-center justify-center">
                                <BuysComboBox onSelectionChange={handleSelectionBuys} />
                            </div>

                            <div className="flex flex-col md:flex-row items-start justify-center gap-x-4">
                                <div className="flex flex-1 w-full flex-col gap-y-2">
                                    <div className="flex flex-col md:flex-row w-full items-center gap-x-4">
                                        <div className="w-full">
                                            <label className="font-bold w-full">N. compra:</label>
                                            <input
                                                className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed w-full"
                                                disabled
                                                type="text"
                                                placeholder="Ejemplo: xxxxx..."
                                                value={dataBuys == null ? "" : dataBuys!.numero_compra}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label className="font-bold w-full">N. Factura Proveedor:</label>
                                            <input
                                                className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed w-full"
                                                disabled
                                                value={dataBuys == null ? "" : dataBuys!.numero_factura_proveedor}
                                                type="text"
                                                placeholder="Ejemplo: xxxxx..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row w-full items-center gap-y-4 md:gap-x-4 mt-2">
                                        <div className="flex w-full items-start gap-y-1 md:gap-x-2 flex-col">
                                            <div className="w-full">
                                                <label className="font-bold mb-1 w-full">Impuesto:</label>
                                                <input
                                                    className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed w-full"
                                                    disabled
                                                    value={dataBuys == null ? "" : dataBuys.impuesto_manual![0].porcentaje}
                                                    type="text"
                                                    placeholder="Ejemplo: xxxx..."
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <label className="font-bold w-full">Termino:</label>
                                            <input
                                                className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed w-full"
                                                disabled
                                                value={dataBuys == null ? "" : dataBuys!.termino}
                                                type="text"
                                                placeholder="Ejemplo: xxxxx..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-1 w-full items-center justify-center">
                                        <div className="w-full">
                                            <label className="font-bold w-full">Observaciones:</label>
                                            <textarea
                                                className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none w-full"
                                                placeholder="Ejemplo: xxxxx..."
                                                value={newPurchaseReturn.observaciones}
                                                onChange={(e) => setNewPurchaseReturn({ ...newPurchaseReturn, observaciones: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col md:flex-row items-start w-full justify-center gap-x-4">

                                    <div className="flex w-full items-center justify-center mt-4 border border-gray-400 py-4 px-2 md:p-4 rounded-lg">
                                        <div className="w-full flex items-center justify-center flex-col">
                                            <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                                <label className="font-bold mb-1 w-full">Código Proveedor:</label>
                                                <input
                                                    className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed w-full"
                                                    value={supplierValue?.codigo_proveedor} type="text" disabled placeholder="Tus proveedores aquí..." />
                                            </div>

                                            <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                                <label className="font-bold w-full mb-1">Proveedor:</label>
                                                <input className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed w-full" value={supplierValue?.nombre_proveedor} type="text" disabled placeholder="Tus proveedores aquí..." />
                                            </div>

                                            <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                                <label className="font-bold w-full mb-1">RUC:</label>
                                                <input className="border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed w-full" value={supplierValue?.ruc} type="text" disabled placeholder="RUC del proveedor..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-96 flex flex-col gap-y-4 mt-4 lg:flex-row w-full gap-x-4 items-start justify-center">
                            <div className="flex-1 w-full h-full scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll border border-gray-300 rounded-lg pb-4">
                                <h2 className="text-center font-bold text-xl">Productos de la compra</h2>
                                <div className='w-full'>
                                    <input
                                        placeholder="Buscar en compra..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full border border-gray-300 hover:border-gray-400 outline-none rounded-none"
                                    />
                                </div>
                                <div className="w-full h-96 touch-pan-x scrollbar-thin-custom touch-pan-y scroll-smooth">
                                    <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x w-full">
                                        <Table.Header className="top-0 sticky bg-white">
                                            <Table.Row align="center">
                                                <Table.ColumnHeaderCell className="text-start">Producto</Table.ColumnHeaderCell>
                                                <Table.ColumnHeaderCell className="text-center">P. Unitario</Table.ColumnHeaderCell>
                                                <Table.ColumnHeaderCell className="text-center">Cantidad</Table.ColumnHeaderCell>
                                                <Table.ColumnHeaderCell className="text-center">Valor</Table.ColumnHeaderCell>
                                                <Table.ColumnHeaderCell className="text-center">Acción</Table.ColumnHeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {
                                                filteredDataDetails?.map(product => (
                                                    <Table.Row key={product.id_producto} className="hover:bg-gray-100/85 transition-all duration-200 p-2">

                                                        <Table.Cell className="text-start">
                                                            {
                                                                product.nombre_producto
                                                            }
                                                        </Table.Cell>

                                                        <Table.Cell className="text-center">
                                                            {
                                                                product.precio_compra === undefined ? 0 : formatCurrency(product.precio_compra)
                                                            }
                                                        </Table.Cell>

                                                        <Table.Cell className="text-center">
                                                            {
                                                                product.cantidad
                                                            }
                                                        </Table.Cell>

                                                        <Table.Cell className="text-center">
                                                            {
                                                                formatCurrency(product.subtotal)
                                                            }
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            {
                                                                <div className="flex items-center justify-center gap-x-2">
                                                                    <Tooltip content="Clic para agregar producto a devolver">
                                                                        <button
                                                                            type="button"
                                                                            className="size-6 border border-gray-300 hover:border-gray-400 rounded-md flex items-center justify-center"
                                                                            onClick={() => addProductsReturn(product)}
                                                                        >
                                                                            <MoveRight className="size-5" />
                                                                        </button>
                                                                    </Tooltip>
                                                                </div>
                                                            }
                                                        </Table.Cell>

                                                    </Table.Row>
                                                ))
                                            }
                                            <Table.Row>
                                                {
                                                    filteredDataDetails?.length === 0 && (
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
                            </div>

                            <div className="flex-1 flex flex-col w-full h-full scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll border border-gray-300 rounded-lg pb-4">
                                <h2 className="text-center font-bold text-xl">Productos a devolver</h2>
                                <div className='w-full'>
                                    <input
                                        placeholder="Buscar en devolución de compra..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full border border-gray-300 hover:border-gray-400 outline-none rounded-none"
                                    />
                                </div>
                                <div className="h-auto w-full flex-col lg:flex-row flex md:gap-x-4 gap-y-4 items-start justify-center mx-auto">
                                    <div className="w-full h-96 touch-pan-x scrollbar-thin-custom touch-pan-y scroll-smooth">
                                        <Table.Root size="1" variant="surface" className="overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x w-full">
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
                                                    filteredDataDetailsReturn?.map(product => (
                                                        <Table.Row key={product.id_producto} className="hover:bg-gray-100/85 transition-all duration-200">

                                                            <Table.Cell>
                                                                {
                                                                    product.nombre_producto
                                                                }
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                {
                                                                    product.precio_compra === undefined ? 0 : formatCurrency(product.precio_compra)
                                                                }
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                {
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
                                                                    <div className="flex items-center gap-x-2">
                                                                        <Tooltip content="Clic para remover o regresar producto a compra">
                                                                            <button
                                                                                type="button"
                                                                                className="size-6 border border-gray-300 hover:border-gray-400 rounded-md flex items-center justify-center"
                                                                                onClick={() => removeProductsReturn(product)}
                                                                            >
                                                                                <MoveLeft className="size-5" />
                                                                            </button>
                                                                        </Tooltip>
                                                                    </div>
                                                                }
                                                            </Table.Cell>

                                                        </Table.Row>
                                                    ))
                                                }
                                                <Table.Row>
                                                    {
                                                        filteredDataDetailsReturn?.length === 0 && (
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
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:[60%] lg:w-[40%] mx-auto flex items-end gap-y-4 flex-col mt-2 border border-gray-500 rounded-lg py-4">

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-center md:gap-x-4 px-4 sm:px-8">
                                <label className="font-bold text-gray-600 w-full">Total productos:</label>
                                <input
                                    className="text-black font-bold w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed"
                                    value={dataProducts.length}
                                    type="text"
                                    disabled
                                    placeholder="Total de productos..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-center md:gap-x-4 px-4 sm:px-8">
                                <label className="font-bold text-gray-600 w-full">Subtotal de compra:</label>
                                <input
                                    className="text-black font-bold w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed"
                                    value={formatCurrency(calcularTotal().toString())}
                                    type="text"
                                    disabled
                                    placeholder="Subtotal de compra..." />
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-center md:gap-x-4 px-4 sm:px-8">
                                <label className="font-bold text-start text-gray-600 w-full">Impuesto:</label>
                                <input
                                    className="text-black font-bold w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed"
                                    value={valorImpuesto === 0 ? "0.00" : formatCurrency(valorImpuesto.toString())}
                                    type="text"
                                    disabled
                                    placeholder="Impuesto..." />
                            </div>

                            <div className="flex md:w-full w-auto items-center justify-center mx-auto">
                                <button
                                    type="button"
                                    className="w-full md:w-[89%] py-1 px-2 flex items-center justify-center gap-x-6 font-bold text-base border border-gray-300 rounded-md hover:border-gray-400"
                                    // disabled={taxesValue === undefined ? true : false}
                                    onClick={() => handleCalculateTotalWithTaxes()}
                                >
                                    Calcular total con impuesto
                                    <Calculator className="size-5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-center md:gap-x-4 px-4 sm:px-8">
                                <label className="font-bold text-gray-600 w-full">Total de compra:</label>
                                <input
                                    className="text-black font-bold w-full border border-gray-300 hover:border-gray-400 rounded-md py-1 px-2 outline-none cursor-not-allowed"
                                    value={total === 0 ? formatCurrency(handleCalculateTotal().toString()) : formatCurrency(total.toString())}
                                    type="text"
                                    disabled
                                    placeholder="Total de compra..." />
                            </div>
                        </div>


                        <div className="flex mt-4 items-center justify-center md:gap-x-8">
                            <form
                                onSubmit={handleSubmit(onSubmitCreatePurchaseReturn)}
                            >
                                <button
                                    type="submit"
                                    className="w-full md:w-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                                    aria-label="Close"
                                    onClick={() => {
                                        setTimeout(() => {
                                            if (!errors) {
                                                setOpen(false)
                                            }
                                        }, 100);
                                    }}
                                >
                                    <Fingerprint className="size-5" />
                                    Autorizar la devolución de productos
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