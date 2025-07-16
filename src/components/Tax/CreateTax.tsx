import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { createTax } from "../../apis/TaxesAPI";
import { TaxesFormDataAdd } from "../../types/taxesData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreateTax() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin,
        resultPercentage;

    const [open, setOpen] = useState(false);

    const [newTax, setNewTax] = useState({
        abreviatura: '',
        descripcion: '',
        valor_porcentaje: "",
        valor_cantidad: 0,
        fecha_creacion: '',
        usuario_creador: ''
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createTax,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Impuesto",
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
            queryClient.invalidateQueries({ queryKey: ["taxes"] })
            MySwal.fire({
                position: "center",
                title: "Impuesto",
                icon: "error",
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
    } = useForm<TaxesFormDataAdd>({ defaultValues: newTax });


    const onSubmitCreateBrand = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newTax.usuario_creador = idUSerLogin;
        newTax.valor_porcentaje = resultPercentage!;

        const data = newTax;

        if (!errors) {
            setTimeout(() => {
                setOpen(false)
            }, 100);
            return;
        }

        mutate(data)
        setNewTax({
            abreviatura: '',
            descripcion: '',
            valor_porcentaje: "",
            valor_cantidad: 0,
            fecha_creacion: '',
            usuario_creador: idUSerLogin!
        })
        reset();
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium  text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full md:w-[50%]"
                        onClick={() =>
                            navigate(location.pathname + "?createTaxes")
                        }
                    >
                        <Plus className="size-5" />
                        Agregar impuesto
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content
                        onPointerDownOutside={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                        className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Crear impuesto
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Crea tus impuesto aquí...
                        </Dialog.Description>
                        <form
                            onSubmit={handleSubmit(onSubmitCreateBrand)}
                            className="space-y-3"
                        >
                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="nombre_marca">
                                    Impuesto
                                </label>
                                <input
                                    {...register("abreviatura", {
                                        required: "El impuesto es requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Tu impuesto..."
                                    id="abreviatura"
                                    value={newTax.abreviatura}
                                    onChange={(e) => {
                                        setNewTax({ ...newTax, abreviatura: e.target.value });
                                    }}
                                    minLength={2}
                                    maxLength={15}
                                />
                                {errors.abreviatura && (
                                    <ErrorMessage>{errors.abreviatura!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="descripcion">
                                    Descripción
                                </label>
                                <input
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Descripción del impuesto..."
                                    id="descripcion"
                                    value={newTax.descripcion}
                                    onChange={(e) => {
                                        setNewTax({ ...newTax, descripcion: e.target.value });
                                    }}
                                    minLength={5}
                                    maxLength={150}
                                />
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="valor_cantidad">
                                    Cantidad:
                                </label>
                                <input
                                    {...register("valor_cantidad", {
                                        required: "La cantidad es requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Valor del impuesto..."
                                    id="valor_cantidad"
                                    value={newTax.valor_cantidad}
                                    onChange={(e) => {
                                        setNewTax({ ...newTax, valor_cantidad: +e.target.value });
                                    }}
                                />
                                {errors.abreviatura && (
                                    <ErrorMessage>{errors.abreviatura!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="valor_porcentaje">
                                    Porcentaje:
                                </label>
                                <input
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 cursor-not-allowed"
                                    placeholder="Valor del impuesto..."
                                    id="valor_porcentaje"
                                    value={resultPercentage = newTax.valor_cantidad + "%"}
                                    onChange={(e) => {
                                        setNewTax({ ...newTax, valor_porcentaje: e.target.value });
                                    }}
                                    disabled
                                />
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
                                Guardar impuesto
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