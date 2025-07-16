import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, ImageOff, ImageUp, Plus, Save, Upload, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { stateValue } from "../../locales/valueState";
import { DataItemWeight } from "../../types/weightData";
import { DataItemUnitOfMeasure } from "../../types/unitOfMeasureData";
import { DataItemBrand } from "../../types/brandData";
import { DataItemCategories } from "../../types/categoryData";
import { getWeight } from "../../apis/WeightAPI";
import { getUnitOfMeasurements } from "../../apis/UnitOfMeasureAPI";
import { getBrands } from "../../apis/BrandAPI";
import { getCategories } from "../../apis/CategoryAPI";
import { createProduct } from "../../apis/ProductsAPI";
import { ProductFormDataAdd } from "../../types/productData";
import { Tooltip } from "@radix-ui/themes";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreateProduct() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin;

    const [open, setOpen] = useState(false);
    const [imageUpload, setImageUpload] = useState(false)

    // * Weight
    const [weightName, setweightName] = useState<DataItemWeight[]>([])

    // * Unit of measure
    const [unitOfMeasureName, setUnitOfMeasureName] = useState<DataItemUnitOfMeasure[]>([])

    // * Brands
    const [brandName, setBrandName] = useState<DataItemBrand[]>([])

    // * categories
    const [categoriesName, setCategoriesName] = useState<DataItemCategories[]>([])


    const [numberOne, setNumberOne] = useState(0)
    const [numberSecond, setNumberSecond] = useState(0)
    const [numberThree, setNumberThree] = useState(0)
    const [numberFour, setNumberFour] = useState(0)

    const [errorActive, setErrorActive] = useState(false)
    const [expirationActive, setExpirationActive] = useState(0)
    // const [date, setDate] = useState<Date>()
    const [newProduct, setNewProduct] = useState({
        codigo: "",
        sac: "",
        nombre_producto: "",
        descripcion_producto: "",
        precio_compra: "0",
        cantidad: 0,
        cantidad_minima: 1,
        cantidad_maxima: 1,
        imagen_url: "",
        estado: 0,
        expiracion: 0,
        fecha_expiracion: "",
        pesoValor: 1,
        precio1: "",
        utilidad1: 0,
        precio2: "",
        utilidad2: 0,
        precio3: "",
        utilidad3: 0,
        precio4: "",
        utilidad4: 0,
        id_unidad_medida: "",
        id_peso: "",
        id_marca: "",
        id_categoria: "",
        usuario_creador: "",
    })

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileinputRef = useRef<HTMLInputElement>(null)


    const { data: dataWeight } = useQuery({
        queryKey: ["weight"],
        queryFn: getWeight,
    })

    const { data: dataUnitOfMeasure } = useQuery({
        queryKey: ["unitIfmeasure"],
        queryFn: getUnitOfMeasurements,
    })

    const { data: dataBrands } = useQuery({
        queryKey: ["brands"],
        queryFn: getBrands,
    })

    const { data: dataCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    useEffect(() => {

        // * Weight
        if (dataWeight === undefined) return;
        const getValueWeight = dataWeight?.map((weight) => weight.id)
        const labelWeight = dataWeight?.map((weight) => weight.peso)
        const getDataWeight = getValueWeight!.map((value, index) => ({
            value,
            label: labelWeight![index]
        }));
        setweightName(getDataWeight);

        // * Unit of measure
        if (dataUnitOfMeasure === undefined) return;
        const getValueUnitOfMeasure = dataUnitOfMeasure?.map((unitOfMeasure) => unitOfMeasure.id)
        const labelUnitOfMeasure = dataUnitOfMeasure?.map((unitOfMeasure) => unitOfMeasure.unidad_medida)
        const getDataUnitOfMeasure = getValueUnitOfMeasure!.map((value, index) => ({
            value,
            label: labelUnitOfMeasure![index]
        }));
        setUnitOfMeasureName(getDataUnitOfMeasure);

        // * Brands
        if (dataBrands === undefined) return;
        const getValueBrands = dataBrands?.map((brand) => brand.id)
        const labelBrands = dataBrands?.map((brand) => brand.nombre_marca)
        const getDataBrands = getValueBrands!.map((value, index) => ({
            value,
            label: labelBrands![index]
        }));
        setBrandName(getDataBrands);

        // * Categories
        if (dataCategories === undefined) return;
        const getValueCategories = dataCategories?.map((category) => category.id)
        const labelCategories = dataCategories?.map((category) => category.nombre_categoria)
        const getDataCategories = getValueCategories!.map((value, index) => ({
            value,
            label: labelCategories![index]
        }));
        setCategoriesName(getDataCategories);

    }, [dataWeight, dataUnitOfMeasure, dataBrands, dataCategories])



    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createProduct,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Producto",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-cyan-500 font-bold">
                            {error.message}
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            MySwal.fire({
                position: "center",
                title: "Producto",
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
            setOpen(false)
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormDataAdd>({ defaultValues: newProduct });


    const handleFile = (file: File) => {

        const allowedTypes = ['image/jpeg', 'image/png'];

        if (allowedTypes.includes(file.type)) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            setError(null)
        } else {
            setSelectedFile(null)
            setPreviewUrl(null)
            MySwal.fire({
                position: "center",
                title: "Imagen",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-red-500 font-bold">
                            Por favor seleccione un archivo con el formato de imagen.
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    const onclickUploadImage = async (data: File) => {
        const imgAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

        const formData = new FormData();
        formData.append("image", data)
        const url = import.meta.env.VITE_IMGBB_URL + `=${imgAPIKey}`;
        await fetch(url, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(result => {
                newProduct.imagen_url = result.data?.url;
            })

        MySwal.fire({
            position: "center",
            title: "Imagen",
            icon: "success",
            html:
                <div className="flex flex-col items-center">
                    <p className="text-cyan-500 font-bold">
                        Imagen subida correctamente...
                    </p>
                </div>
            ,
            showConfirmButton: false,
            timer: 1500
        });
        setImageUpload(true);
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file)
        }
    }

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)
        const file = event.dataTransfer.files?.[0]
        if (file) {
            handleFile(file)
        }
    }

    const handleSelectClick = () => {
        fileinputRef.current?.click()
    }

    const handleCalculateUtility1 = (e: number) => {
        if (parseInt(newProduct.precio_compra) === 0 || newProduct.precio_compra === "0") {
            setErrorActive(true);

            setTimeout(() => {
                setErrorActive(false);
            }, 3000);
            return;
        }

        const percentajeValue = 100 - e;
        const result = percentajeValue / 100;
        const utilidad1 = (parseInt(newProduct.precio_compra) / result);

        setNumberOne(+utilidad1.toFixed(2))
    }

    const handleCalculateUtility2 = (e: number) => {
        if (parseInt(newProduct.precio_compra) === 0 || newProduct.precio_compra === "0") {
            setErrorActive(true);

            setTimeout(() => {
                setErrorActive(false);
            }, 3000);
            return;
        }

        const percentajeValue = 100 - e;
        const result = percentajeValue / 100;
        const utilidad2 = (parseInt(newProduct.precio_compra) / result);

        setNumberSecond(+utilidad2.toFixed(2))
    }

    const handleCalculateUtility3 = (e: number) => {
        if (parseInt(newProduct.precio_compra) === 0 || newProduct.precio_compra === "0") {
            setErrorActive(true);

            setTimeout(() => {
                setErrorActive(false);
            }, 3000);
            return;
        }

        const percentajeValue = 100 - e;
        const result = percentajeValue / 100;
        const utilidad3 = (parseInt(newProduct.precio_compra) / result);

        setNumberThree(+utilidad3.toFixed(2));
    }

    const handleCalculateUtility4 = (e: number) => {
        if (parseInt(newProduct.precio_compra) === 0 || newProduct.precio_compra === "0") {
            setErrorActive(true);

            setTimeout(() => {
                setErrorActive(false);
            }, 3000);
            return;
        }

        const percentajeValue = 100 - e;
        const result = percentajeValue / 100;
        const utilidad4 = (parseInt(newProduct.precio_compra) / result);

        setNumberFour(+utilidad4.toFixed(2));
    }


    const onsubmitCreateProduct = () => {

        newProduct.precio1 = numberOne.toString();
        newProduct.precio2 = numberSecond.toString();
        newProduct.precio3 = numberThree.toString();
        newProduct.precio4 = numberFour.toString();

        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newProduct.usuario_creador = idUSerLogin;

        const data = newProduct;

        mutate(data)
        setNewProduct({
            codigo: "",
            sac: "",
            nombre_producto: "",
            descripcion_producto: "",
            precio_compra: "0",
            cantidad: 0,
            cantidad_minima: 1,
            cantidad_maxima: 1,
            imagen_url: "",
            estado: 0,
            expiracion: 0,
            fecha_expiracion: "",
            pesoValor: 1,
            precio1: "",
            utilidad1: 0,
            precio2: "",
            utilidad2: 0,
            precio3: "",
            utilidad3: 0,
            precio4: "",
            utilidad4: 0,
            id_unidad_medida: "",
            id_peso: "",
            id_marca: "",
            id_categoria: "",
            usuario_creador: idUSerLogin!,
        })

        setSelectedFile(null);
        setNumberOne(0);
        setNumberSecond(0);
        setNumberThree(0);
        setNumberFour(0);
        setImageUpload(false);
        setImageUpload(false)
        reset();
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium  text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full md:w-[50%]"
                        onClick={() =>
                            navigate(location.pathname + "?createProduct")
                        }
                    >
                        <Plus className="size-5" />
                        Agregar producto
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content
                        onPointerDownOutside={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                        className={`fixed left-1/2 top-1/2 h-[95%] w-[90%] md:max-w-2xl p-4 md:p-6 scrollbar-thin-custom scroll-smooth mx-auto touch-pan-y overflow-scroll -translate-x-1/2 -translate-y-1/2 rounded-md bg-white shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Close asChild>
                            <div className="sticky top-0 left-0 flex items-end justify-end">
                                <Tooltip content="Clic para cerrar el modal">

                                    <button
                                        className="size-[25px] outline-none"
                                        aria-label="Close"
                                        onClick={() => {
                                            navigate(location.pathname, { replace: true })
                                            reset();
                                        }}
                                    >
                                        <X />
                                    </button>
                                </Tooltip>
                            </div>
                        </Dialog.Close>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Crear producto
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Crea tus producto aquí...
                        </Dialog.Description>

                        <div className="w-full md:mt-4 mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
                            {

                                selectedFile ? (
                                    null
                                )
                                    :
                                    (
                                        <>
                                            <h2 className="text-2xl font-bold mb-4">Subir imagen</h2>
                                            <div
                                                className={`mb-4 border-2 border-dashed rounded-lg p-4 text-center ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
                                                    }`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    ref={fileinputRef}
                                                    className="hidden"
                                                />
                                                {selectedFile ? (
                                                    <div className="space-y-2">
                                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                        <p className="text-sm text-gray-500">
                                                            {(selectedFile as File).name}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                        <p className="text-sm text-gray-500">
                                                            Arrastras y soltar la imagen aquí, o clic en seleccionar la imagen
                                                        </p>
                                                    </div>
                                                )}
                                                <button type="button" onClick={handleSelectClick} className="w-full bg-white md:w-auto py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 focus-visible:border-gray-400 rounded-md">
                                                    <ImageUp className="size-6" />
                                                    Selecciona imagen aquí
                                                </button>
                                            </div>
                                        </>
                                    )
                            }
                            {error && (
                                <ErrorMessage>{error}</ErrorMessage>
                            )}
                            {selectedFile && previewUrl && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                                    <div className="relative mx-auto size-40 object-contain rounded-md overflow-hidden">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>


                                    {
                                        imageUpload == false ?
                                            (
                                                <div className="flex items-center mt-4 gap-y-4 md:gap-x-2 flex-col md:flex-row">
                                                    <button
                                                        disabled={imageUpload ? true : false}
                                                        type="button"
                                                        className="w-full bg-white md:w-56 py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 focus-visible:border-gray-400 rounded-md"
                                                        onClick={() => setSelectedFile(null)}
                                                    >
                                                        <ImageOff className="size-5" />
                                                        Remover imagen
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="w-full bg-white md:w-56 py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 focus-visible:border-gray-400 rounded-md"
                                                        onClick={() => onclickUploadImage(selectedFile)}
                                                    >
                                                        <ImageUp className="size-5" />
                                                        Subir imagen
                                                    </button>
                                                </div>
                                            )
                                            :
                                            (null)
                                    }
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit(onsubmitCreateProduct)} className="space-y-4 scroll-smooth mx-auto touch-pan-y px-2 py-4 w-[90%] md:w-full">

                            {/* Código */}
                            <div className="flex items-center justify-center gap-4 w-full md:flex-row flex-col">
                                <div className="w-full">
                                    <label className="font-bold" htmlFor="codigo">Código del producto:</label>
                                    <input
                                        {...register("codigo", {
                                            required: "El código es requerido...",
                                        })}
                                        className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                        placeholder="Ejemplo: 3xxxx..."
                                        id="codigo"
                                        value={newProduct.codigo}
                                        onChange={(e) => setNewProduct({ ...newProduct, codigo: e.target.value })}
                                        minLength={4}
                                        maxLength={20}
                                    />
                                    {errors.codigo && (
                                        <ErrorMessage>{errors.codigo!.message}</ErrorMessage>
                                    )}
                                </div>

                                {/* Código SAC */}
                                <div className="w-full">
                                    <label className="font-bold" htmlFor="sac">Código SAC:</label>
                                    <input
                                        {...register("sac", {
                                            required: "El SAC es requerido...",
                                        })}
                                        className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                        placeholder="Ejemplo: 5xxxx..."
                                        id="sac"
                                        value={newProduct.sac}
                                        onChange={(e) => setNewProduct({ ...newProduct, sac: e.target.value })}
                                        minLength={4}
                                        maxLength={40}
                                    />
                                    {errors.sac && (
                                        <ErrorMessage>{errors.sac!.message}</ErrorMessage>
                                    )}
                                </div>
                            </div>

                            {/* Nombre producto */}
                            <div>
                                <label className="font-bold" htmlFor="nombre_producto">Producto:</label>
                                <input
                                    {...register("nombre_producto", {
                                        required: "El nombre es requerido...",
                                    })}
                                    className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                    placeholder="Ejemplo: Pinzx puntxx..."
                                    id="nombre_producto"
                                    value={newProduct.nombre_producto}
                                    onChange={(e) => setNewProduct({ ...newProduct, nombre_producto: e.target.value })}
                                    minLength={8}
                                    maxLength={80}
                                />
                                {errors.sac && (
                                    <ErrorMessage>{errors.nombre_producto!.message}</ErrorMessage>
                                )}
                            </div>

                            {/* descripción del producto */}
                            <div>
                                <label className="font-bold" htmlFor="descripcion_producto">Descripción del Producto:</label>
                                <textarea
                                    {...register("descripcion_producto", {
                                        required: "La descripción es requerido...",
                                    })}
                                    className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                    placeholder="Ejemplo: Información del producto..."
                                    id="descripcion_producto"
                                    value={newProduct.descripcion_producto}
                                    onChange={(e) => setNewProduct({ ...newProduct, descripcion_producto: e.target.value })}
                                    minLength={10}
                                    maxLength={180}
                                />
                                {errors.descripcion_producto && (
                                    <ErrorMessage>{errors.descripcion_producto!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex items-center justify-center gap-4 w-full md:flex-row flex-col">
                                {/* Precio compra */}
                                <div className="w-full">
                                    <label className="font-bold" htmlFor="precio_compra">Precio compra:</label>
                                    <input
                                        className={`border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1 ${errorActive && "border-red-500"}`}
                                        placeholder="Ejemplo: 2xxx..."
                                        id="precio_compra"
                                        type='number'
                                        value={newProduct.precio_compra}
                                        onChange={(e) => setNewProduct({ ...newProduct, precio_compra: e.target.value })}
                                    />
                                </div>

                                {/* Cantidad */}
                                <div className="w-full">
                                    <label className="font-bold" htmlFor="cantidad">Cantidad:</label>
                                    <input
                                        className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                        placeholder="Ejemplo: 2xxx..."
                                        id="cantidad"
                                        type='number'
                                        value={newProduct.cantidad}
                                        onChange={(e) => setNewProduct({ ...newProduct, cantidad: +e.target.value })}
                                    />
                                </div>

                                {/* Cantidad minima */}
                                <div className="w-full">
                                    <label className="font-bold" htmlFor="cantidad_minima">Cantidad minima:</label>
                                    <input
                                        className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                        placeholder="Ejemplo: 2xxx..."
                                        id="cantidad_minima"
                                        type='number'
                                        value={newProduct.cantidad_minima}
                                        onChange={(e) => setNewProduct({ ...newProduct, cantidad_minima: +e.target.value })}
                                    />
                                    {newProduct.cantidad_minima <= 0 && (
                                        <ErrorMessage>{"Este campo no puede ser 0 o menor a 0"}</ErrorMessage>
                                    )}
                                </div>

                                {/* Cantidad maxima */}
                                <div className="w-full">
                                    <label className="font-bold" htmlFor="cantidad_maxima">Cantidad maxima:</label>
                                    <input
                                        className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                        placeholder="Ejemplo: 2xxx..."
                                        id="cantidad_maxima"
                                        type='number'
                                        value={newProduct.cantidad_maxima}
                                        onChange={(e) => setNewProduct({ ...newProduct, cantidad_maxima: +e.target.value })}
                                    />
                                    {newProduct.cantidad_maxima <= 0 && (
                                        <ErrorMessage>{"Este campo no puede ser 0 o menor a 0"}</ErrorMessage>
                                    )}
                                </div>
                            </div>
                            {
                                errorActive &&
                                <p className="text-red-500 font-bold">Este campos es necesario...</p>
                            }

                            <div className="w-full">
                                <h3 className="font-bold">Información de la expiiración del producto</h3>
                                <div className="flex items-start md:items-center md:flex-row flex-col gap-y-4 md:gap-x-14 md:justify-cente border border-gray-300 rounded-lg p-2">

                                    {/* Expiración */}
                                    <div className="md:w-full flex gap-x-3 items-center flex-row-reverse">
                                        <label className="font-bold" htmlFor="expiracion">Expiración</label>
                                        <input
                                            placeholder="Ejemplo: 2022-01-01"
                                            className=" size-4"
                                            id="expiracion"
                                            type='checkbox'
                                            value={newProduct.expiracion ? "checked" : "unchecked"}
                                            onChange={(e) => {
                                                setExpirationActive(+e.target.checked)
                                                setNewProduct({ ...newProduct, expiracion: +e.target.checked })
                                            }}
                                        />
                                    </div>

                                    <div className="w-full">

                                        {/* Fecha de Expiración */}
                                        <input
                                            disabled={expirationActive === 0 ? true : false}
                                            type="date"
                                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-400 block w-full ps-10 p-2.5 outline-none ${expirationActive === 0 && "cursor-not-allowed"}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-4 w-full md:flex-row flex-col">

                                {/* Peso */}
                                <div className="w-[50%]">
                                    <label className="font-bold" htmlFor="pesoValor">Valor del Peso:</label>
                                    <input
                                        className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                        placeholder="Ejemplo: 2xxx..."
                                        id="pesoValor"
                                        type='number'
                                        value={newProduct.pesoValor}
                                        onChange={(e) => setNewProduct({ ...newProduct, pesoValor: +e.target.value })}
                                    />
                                    {newProduct.pesoValor <= 0 && (
                                        <ErrorMessage>{"Este campo no puede ser 0 o menor a 0"}</ErrorMessage>
                                    )}
                                </div>

                                {/* Peso */}
                                <div className="w-full flex flex-col items-center justify-center gap-x-2">
                                    <label className="w-full font-bold" htmlFor="weightSearch">Peso del producto:</label>
                                    <div className="border border-gray-300 rounded-md py-1 px-2 flex items-center justify-center w-full">
                                        <input
                                            id="weightSearch"
                                            type="text"
                                            name="searchWeight"
                                            list="listWeight"
                                            placeholder="Buscar peso..."
                                            className="outline-none w-full"
                                            onChange={(e) => {
                                                const selectedItem = weightName.find(item => item.label === e.target.value);

                                                setNewProduct({ ...newProduct, id_peso: selectedItem!.value })
                                            }}
                                        />
                                        <datalist id="listWeight">
                                            {
                                                weightName.map(item => (
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

                            <div className="w-full flex items-center justify-center gap-4 md:flex-row flex-col">
                                {/* Unidad de medida */}
                                <div className="w-full flex flex-col items-center justify-center gap-x-2">
                                    <label className="w-full font-bold" htmlFor="unitOfMeasureSearch">Unidad de medida:</label>
                                    <div className="border border-gray-300 rounded-md py-1 px-2 flex items-center justify-center w-full">
                                        <input
                                            id="unitOfMeasureSearch"
                                            type="text"
                                            list="listUnitOfMeasure"
                                            placeholder="Buscar unidad de medida..."
                                            className="outline-none w-full"
                                            onChange={(e) => {
                                                const selectedItem = unitOfMeasureName.find(item => item.label === e.target.value);
                                                setNewProduct({ ...newProduct, id_unidad_medida: selectedItem!.value });
                                            }}
                                        />
                                        <datalist id="listUnitOfMeasure">
                                            {
                                                unitOfMeasureName.map(item => (
                                                    <option
                                                        key={item.value}
                                                        value={item.label}
                                                    />
                                                ))
                                            }
                                        </datalist>
                                    </div>
                                </div>

                                {/* Estado */}
                                <div className="w-full">
                                    <label className="font-bold" htmlFor="estado">Estado:</label>
                                    <select
                                        onChange={(e) => {
                                            setNewProduct({ ...newProduct, estado: +e.target.value })
                                        }}
                                        name=""
                                        id="estado"
                                        className="w-full bg-gray-50 border border-gray-300 hover:border-gray-500 py-2 px-4 rounded-md">
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

                            <div className="w-full">
                                <h3 className="font-bold">Información de la utilidades y precios</h3>
                                <div className="border border-gray-300 rounded-lg p-2">
                                    <div className="flex items-start md:items-center md:flex-row flex-col gap-y-4 md:gap-x-10 md:justify-center">

                                        {/* utilidad1 */}
                                        <div className="w-full">
                                            <label className="font-bold" htmlFor="utilidad1">Utilidad 1:</label>
                                            <input
                                                {...register("utilidad1", {
                                                    required: "La utilidad es requerida...",
                                                })}
                                                className={`border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1 ${newProduct.precio_compra == "" || newProduct.precio_compra == "0" && "cursor-not-allowed"}`}
                                                placeholder="Ejemplo: 2xxx..."
                                                id="utilidad1"
                                                type='number'
                                                value={newProduct.utilidad1}
                                                disabled={newProduct.precio_compra == "" || newProduct.precio_compra == "0" ? true : false}
                                                onChange={(e) => {

                                                    if (+e.target.value < 1) {
                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-red-500 font-bold">
                                                                        La utilidad no puede ser menor a 1...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });
                                                        return;
                                                    }
                                                    else if (+e.target.value > 100) {
                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-red-500 font-bold">
                                                                        La utilidad no puede ser menor a 100...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });
                                                        return;
                                                    }
                                                    handleCalculateUtility1(+e.target.value)
                                                    setNewProduct({ ...newProduct, utilidad1: +e.target.value });
                                                }}
                                            />
                                            {errors.utilidad1 && (
                                                <ErrorMessage>{errors.utilidad1!.message}</ErrorMessage>
                                            )}
                                        </div>

                                        {/* precio1 */}
                                        <div className="w-full">
                                            <label className="font-bold" htmlFor="precio1">Precio 1:</label>
                                            <input
                                                className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1 cursor-not-allowed"
                                                placeholder="Ejemplo: 2xxx..."
                                                id="precio1"
                                                type='number'
                                                disabled
                                                value={numberOne}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start md:items-center md:flex-row flex-col gap-y-4 md:gap-x-10 md:justify-center">

                                        {/* utilidad2 */}
                                        <div className="w-full">
                                            <label className="font-bold" htmlFor="utilidad2">Utilidad 2:</label>
                                            <input
                                                {...register("utilidad2", {
                                                    required: "La utilidad es requerida...",
                                                })}
                                                className={`border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1 ${newProduct.precio_compra == "" || newProduct.precio_compra == "0" && "cursor-not-allowed"}`}
                                                placeholder="Ejemplo: 2xxx..."
                                                id="utilidad2"
                                                type='number'
                                                value={newProduct.utilidad2}
                                                disabled={newProduct.precio_compra == "" || newProduct.precio_compra == "0" ? true : false}
                                                onChange={(e) => {
                                                    if (+e.target.value < 1) {
                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-red-500 font-bold">
                                                                        La utilidad no puede ser menor a 1...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });
                                                        return;
                                                    }
                                                    else if (+e.target.value > 100) {
                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-red-500 font-bold">
                                                                        La utilidad no puede ser menor a 100...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });
                                                        return;
                                                    }
                                                    setNewProduct({ ...newProduct, utilidad2: +e.target.value })
                                                    handleCalculateUtility2(+e.target.value);
                                                }}
                                                required
                                            />
                                            {errors.utilidad2 && (
                                                <ErrorMessage>{errors.utilidad2!.message}</ErrorMessage>
                                            )}
                                        </div>

                                        {/* precio2 */}
                                        <div className="w-full">
                                            <label className="font-bold" htmlFor="precio2">Precio 2:</label>
                                            <input
                                                className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1 cursor-not-allowed"
                                                placeholder="Ejemplo: 2xxx..."
                                                id="precio2"
                                                type='number'
                                                disabled
                                                value={numberSecond}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start md:items-center md:flex-row flex-col gap-y-4 md:gap-x-10 md:justify-center">

                                        {/* utilidad3 */}
                                        <div className="w-full">
                                            <label className="font-bold" htmlFor="utilidad3">Utilidad 3:</label>
                                            <input
                                                {...register("utilidad3", {
                                                    required: "La utilidad es requerida...",
                                                })}
                                                className={`border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1 ${newProduct.precio_compra == "" || newProduct.precio_compra == "0" && "cursor-not-allowed"}`}
                                                placeholder="Ejemplo: 2xxx..."
                                                id="utilidad3"
                                                type='number'
                                                disabled={newProduct.precio_compra == "" || newProduct.precio_compra == "0" ? true : false}
                                                value={newProduct.utilidad3}
                                                onChange={(e) => {
                                                    if (+e.target.value < 1) {
                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-red-500 font-bold">
                                                                        La utilidad no puede ser menor a 1...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });
                                                        return;
                                                    }
                                                    else if (+e.target.value > 100) {
                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-red-500 font-bold">
                                                                        La utilidad no puede ser menor a 100...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });
                                                        return;
                                                    }
                                                    setNewProduct({ ...newProduct, utilidad3: +e.target.value })
                                                    handleCalculateUtility3(+e.target.value)
                                                }}
                                                required
                                            />
                                            {errors.utilidad3 && (
                                                <ErrorMessage>{errors.utilidad3!.message}</ErrorMessage>
                                            )}
                                        </div>

                                        {/* precio3 */}
                                        <div className="w-full">
                                            <label className="font-bold" htmlFor="precio3">Precio 3:</label>
                                            <input
                                                className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1 cursor-not-allowed"
                                                placeholder="Ejemplo: 2xxx..."
                                                id="precio3"
                                                type='number'
                                                disabled
                                                value={numberThree}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start md:items-center md:flex-row flex-col gap-y-4 md:gap-x-10 md:justify-center">

                                        {/* utilidad4 */}
                                        <div className="w-full">
                                            <label className="font-bold" htmlFor="utilidad4">Utilidad 4:</label>
                                            <input
                                                {...register("utilidad4", {
                                                    required: "La utilidad es requerida...",
                                                })}
                                                className={`border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1 ${newProduct.precio_compra == "" || newProduct.precio_compra == "0" && "cursor-not-allowed"}`}
                                                placeholder="Ejemplo: 2xxx..."
                                                id="utilidad4"
                                                type='number'
                                                disabled={newProduct.precio_compra == "" || newProduct.precio_compra == "0" ? true : false}
                                                value={newProduct.utilidad4}
                                                onChange={(e) => {
                                                    if (+e.target.value < 1) {
                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-red-500 font-bold">
                                                                        La utilidad no puede ser menor a 1...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });
                                                        return;
                                                    }
                                                    else if (+e.target.value > 100) {
                                                        MySwal.fire({
                                                            position: "center",
                                                            title: "Producto",
                                                            icon: "error",
                                                            html:
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-red-500 font-bold">
                                                                        La utilidad no puede ser menor a 100...
                                                                    </p>
                                                                </div>
                                                            ,
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        });
                                                        return;
                                                    }
                                                    setNewProduct({ ...newProduct, utilidad4: +e.target.value })
                                                    handleCalculateUtility4(+e.target.value)
                                                }}
                                                required
                                            />
                                            {errors.utilidad4 && (
                                                <ErrorMessage>{errors.utilidad4!.message}</ErrorMessage>
                                            )}
                                        </div>

                                        {/* precio4 */}
                                        <div className="w-full">
                                            <label className="font-bold" htmlFor="precio4">Precio 4:</label>
                                            <input
                                                className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1 cursor-not-allowed"
                                                placeholder="Ejemplo: 2xxx..."
                                                id="precio4"
                                                type='number'
                                                disabled
                                                value={numberFour}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-x-4 flex-col md:flex-row">
                                {/* Marca */}
                                <div className="w-full flex flex-col items-center justify-center gap-x-2">
                                    <label className="w-full font-bold" htmlFor="brandSearch">Marca:</label>
                                    <div className="border border-gray-300 rounded-md py-1 px-2 flex items-center justify-center w-full">
                                        <input
                                            id="brandSearch"
                                            type="text"
                                            name="searchBrands"
                                            list="listBrands"
                                            placeholder="Buscar marca..."
                                            className="outline-none w-full"
                                            onChange={(e) => {
                                                const selectedItem = brandName.find(item => item.label === e.target.value);

                                                setNewProduct({ ...newProduct, id_marca: selectedItem!.value })
                                            }}
                                        />
                                        <datalist id="listBrands">
                                            {
                                                brandName.map(item => (
                                                    <option
                                                        key={item.value}
                                                        value={item.label}
                                                    />
                                                ))
                                            }
                                        </datalist>
                                    </div>
                                </div>

                                {/* Categoría */}
                                <div className="w-full flex flex-col items-center justify-center gap-x-2">
                                    <label className="w-full font-bold" htmlFor="categorySearch">Categoría:</label>
                                    <div className="border border-gray-300 rounded-md py-1 px-2 flex items-center justify-center w-full">
                                        <input
                                            id="categorySearch"
                                            type="text"
                                            name="searchCategories"
                                            list="listCategory"
                                            placeholder="Buscar categoría..."
                                            className="outline-none w-full"
                                            onChange={(e) => {
                                                const selectedItem = categoriesName.find(item => item.label === e.target.value);

                                                setNewProduct({ ...newProduct, id_categoria: selectedItem!.value })
                                            }}
                                        />
                                        <datalist id="listCategory">
                                            {
                                                categoriesName.map(item => (
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

                            <div className="flex items-center justify-center">
                                <button
                                    className={`w-full bg-white md:w-56 py-2 px-4 flex items-center justify-center gap-x-6 font-bold text-base border border-gray-400 rounded-lg ${newProduct.id_unidad_medida == "" || newProduct.id_marca == "" || newProduct.id_categoria == "" ? "cursor-not-allowed" : ""}`}
                                    type="submit"
                                    onClick={() => {
                                        setTimeout(() => {
                                            if (!errors) {
                                                setOpen(false)
                                            }
                                        }, 100);
                                    }}
                                    disabled={newProduct.id_unidad_medida == "" || newProduct.id_marca == "" || newProduct.id_categoria == "" ? true : false}
                                >
                                    <Save className="size-5" />
                                    Guardar producto
                                </button>
                            </div>
                        </form>

                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}