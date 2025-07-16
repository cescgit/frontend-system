import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, ImageOff, ImageUp, Plus, Save, Upload, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { CompanyFormDataAdd } from "../../types/companyData";
import { createCompany } from "../../apis/CompanyAPI";
import SuccessMessage from "../SuccessMessage";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreateCompany() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin;

    const [open, setOpen] = useState(false);
    const [imageUpload, setImageUpload] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const [newCompany, setNewCompany] = useState({
        nombre_empresa: "",
        eslogan: "",
        direccion_empresa: "",
        ruc: "",
        telefono_empresa: "",
        celular_empresa: "",
        correo_empresa: "",
        logotipo: "",
        usuario_creador: ""
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createCompany,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Empresa",
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
            queryClient.invalidateQueries({ queryKey: ["company"] })
            MySwal.fire({
                position: "center",
                title: "Empresa",
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
        handleSubmit,
        reset,
        register,
        formState: { errors },
    } = useForm<CompanyFormDataAdd>({ defaultValues: newCompany });

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileinputRef = useRef<HTMLInputElement>(null)

    const handleFile = (file: File) => {
        if (file.type.startsWith('image/')) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            setError(null)
        } else {
            setSelectedFile(null)
            setPreviewUrl(null)
            setError('Por favor seleccione un archivo con el formato de imagen.');
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
                newCompany.logotipo = result.data?.url;
            })
        setMessage("Imagen subida correctamente...")
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


    const onSubmitCreateCompany = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newCompany.usuario_creador = idUSerLogin;

        const data = newCompany;

        if (!errors) {
            setTimeout(() => {
                setOpen(false)
            }, 100);
            return;
        }

        mutate(data)
        setNewCompany({
            nombre_empresa: "",
            eslogan: "",
            direccion_empresa: "",
            ruc: "",
            telefono_empresa: "",
            celular_empresa: "",
            correo_empresa: "",
            logotipo: "",
            usuario_creador: idUSerLogin!
        })
        setImageUpload(false);
        setMessage(null)
        setError(null)
        reset();
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium  text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full md:w-auto mt-4"
                        onClick={() =>
                            navigate(location.pathname + "?createCompany")
                        }
                    >
                        <Plus className="size-5" />
                        Agregar información de la empresa
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content
                        onPointerDownOutside={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                        className={`fixed left-1/2 top-1/2 max-h-[90vh] scrollbar-thin-custom overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Crear información de la empresa
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Guarda la información de la empresa aquí...
                        </Dialog.Description>
                        <div className="w-[90%] md:mt-4 mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
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
                                                <button type="button" onClick={handleSelectClick} className="w-full bg-white md:w-56 py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 focus-visible:border-gray-400 rounded-md">
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
                                        imageUpload == true ? (
                                            <SuccessMessage>{message}</SuccessMessage>
                                        )
                                            :
                                            (null)
                                    }
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
                                </div>
                            )}
                        </div>
                        <form
                            onSubmit={handleSubmit(onSubmitCreateCompany)}
                            className="space-y-3 mt-4"
                        >
                            <div className="flex w-full items-center flex-col gap-y-1">
                                <label className="text-base w-full" htmlFor="nombre_empresa">Empresa:</label>
                                <input
                                    {...register("nombre_empresa", {
                                        required: "Este campo es requerido...",
                                    })}
                                    id="nombre_empresa"
                                    value={newCompany.nombre_empresa}
                                    placeholder="Nombre Empresa"
                                    className="w-full text-sm border border-gray-400 py-1 px-2 rounded-md focus-visible:border-gray-500 outline-hidden  "
                                    onChange={(e) => setNewCompany({ ...newCompany, nombre_empresa: e.target.value })}
                                    min={4}
                                    maxLength={100}
                                />
                                {errors.nombre_empresa && (
                                    <ErrorMessage>{errors.nombre_empresa!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex w-full items-center flex-col gap-y-1">
                                <label className="text-base w-full" htmlFor="eslogan">Eslogan:</label>
                                <input
                                    {...register("eslogan", {
                                        required: "Este campo es requerido...",
                                    })}
                                    id="eslogan"
                                    value={newCompany.eslogan}
                                    placeholder="Eslogan de la empresa..."
                                    className="w-full text-sm border border-gray-400 py-1 px-2 rounded-md focus-visible:border-gray-500 outline-hidden  "
                                    onChange={(e) => setNewCompany({ ...newCompany, eslogan: e.target.value })}
                                    required
                                    min={4}
                                    maxLength={200}
                                />
                                {errors.eslogan && (
                                    <ErrorMessage>{errors.eslogan!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex w-full items-center flex-col gap-y-1">
                                <label className="text-base w-full" htmlFor="ruc">RUC:</label>
                                <input
                                    {...register("ruc", {
                                        required: "Este campo es requerido...",
                                    })}
                                    id="ruc"
                                    value={newCompany.ruc}
                                    placeholder="RUC Empresa"
                                    className="w-full text-sm border border-gray-400 py-1 px-2 rounded-md focus-visible:border-gray-500 outline-hidden  "
                                    onChange={(e) => setNewCompany({ ...newCompany, ruc: e.target.value })}
                                    required
                                    min={4}
                                    maxLength={20}
                                />
                                {errors.ruc && (
                                    <ErrorMessage>{errors.ruc!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex w-full items-center flex-col gap-y-1">
                                <label className="text-base w-full" htmlFor="direccion_empresa">Dirección:</label>
                                <textarea
                                    {...register("direccion_empresa", {
                                        required: "Este campo es requerido...",
                                    })}
                                    id="direccion_empresa"
                                    value={newCompany.direccion_empresa}
                                    placeholder="Dirección Empresa"
                                    className="w-full text-sm border border-gray-400 py-1 px-2 rounded-md focus-visible:border-gray-500 outline-hidden  "
                                    onChange={(e) => setNewCompany({ ...newCompany, direccion_empresa: e.target.value })}
                                    required
                                    minLength={10}
                                    maxLength={200}
                                />
                                {errors.direccion_empresa && (
                                    <ErrorMessage>{errors.direccion_empresa!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex w-full items-center flex-col gap-y-1">
                                <label className="text-base w-full" htmlFor="telefono_empresa">Teléfono:</label>
                                <input
                                    {...register("telefono_empresa", {
                                        required: "Este campo es requerido...",
                                    })}
                                    id="telefono_empresa"
                                    value={newCompany.telefono_empresa}
                                    placeholder="Teléfono Empresa"
                                    className="w-full text-sm border border-gray-400 py-1 px-2 rounded-md focus-visible:border-gray-500 outline-hidden  "
                                    onChange={(e) => setNewCompany({ ...newCompany, telefono_empresa: e.target.value })}
                                    minLength={8}
                                    maxLength={8}
                                />
                                {errors.telefono_empresa && (
                                    <ErrorMessage>{errors.telefono_empresa!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex w-full items-center flex-col gap-y-1">
                                <label className="text-base w-full" htmlFor="celular">Celular:</label>
                                <input
                                    {...register("celular_empresa", {
                                        required: "Este campo es requerido...",
                                    })}
                                    id="celular"
                                    value={newCompany.celular_empresa}
                                    placeholder="Celular Empresa"
                                    className="text-sm border border-gray-400 py-1 px-2 rounded-md focus-visible:border-gray-500 outline-hidden  w-full"
                                    onChange={(e) => setNewCompany({ ...newCompany, celular_empresa: e.target.value })}
                                    minLength={8}
                                    maxLength={8}
                                />
                                {errors.celular_empresa && (
                                    <ErrorMessage>{errors.celular_empresa!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex w-full items-center flex-col gap-y-1">
                                <label className="text-base w-full" htmlFor="correo_empresa">Correo:</label>
                                <input
                                    {...register("correo_empresa", {
                                        required: "Este campo es requerido...",
                                    })}
                                    id="correo_empresa"
                                    value={newCompany.correo_empresa}
                                    placeholder="Correo Empresa"
                                    type="email"
                                    onChange={(e) => setNewCompany({ ...newCompany, correo_empresa: e.target.value })}
                                    className="w-full text-sm border border-gray-400 py-1 px-2 rounded-md focus-visible:border-gray-500 outline-hidden  "
                                    minLength={10}
                                    maxLength={80}
                                />
                                {errors.correo_empresa && (
                                    <ErrorMessage>{errors.correo_empresa!.message}</ErrorMessage>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 md:w-[50%] mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                                aria-label="Close"
                                onClick={() => {
                                    setTimeout(() => {
                                        if (!errors) {
                                            setOpen(false)
                                        }
                                    }, 100);
                                }}
                            >
                                <Save className="size-5" />
                                Guardar información
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
            </Dialog.Root>
        </>
    )
}