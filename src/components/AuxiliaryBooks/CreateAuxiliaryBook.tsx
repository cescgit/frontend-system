import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../../components/ErrorMessage";
import { createAuxiliaryBook } from "../../apis/AuxiliaryBookAPI";
import { AuxiliaryBookFormDataAdd } from "../../types/auxiliaryBookData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreateAuxiliaryBook() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin;

    const [open, setOpen] = useState(false);

    const [newAuxiliaryBook, setNewAuxiliaryBook] = useState({
        codigo: '',
        descripcion: '',
        usuario_creador: '',
        fecha_creacion: ''
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createAuxiliaryBook,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Auxiliar contable",
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
            queryClient.invalidateQueries({ queryKey: ["auxiliaryBooks"] })
            MySwal.fire({
                position: "center",
                title: "Auxiliar contable",
                icon: "success",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-red-500 font-bold">
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
        formState: { errors },
    } = useForm<AuxiliaryBookFormDataAdd>({ defaultValues: newAuxiliaryBook });


    const onSubmitCreateAccountAccounting = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newAuxiliaryBook.usuario_creador = idUSerLogin;

        const data = newAuxiliaryBook;

        if (!errors) {
            setTimeout(() => {
                setOpen(false)
            }, 100);
            return;
        }

        mutate(data)
        setNewAuxiliaryBook({
            codigo: '',
            descripcion: '',
            fecha_creacion: '',
            usuario_creador: idUSerLogin!
        })
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium  text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full md:w-auto"
                        onClick={() =>
                            navigate(location.pathname + "?createAuxiliaryBook")
                        }
                    >
                        <Plus className="size-5" />
                        Registrar libro auxiliar
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Crear libro auxiliares
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Crea los libro auxiliares aquí...
                        </Dialog.Description>
                        <form
                            onSubmit={handleSubmit(onSubmitCreateAccountAccounting)}
                            className="space-y-3"
                        >
                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="codigo">
                                    Código
                                </label>
                                <input
                                    {...register("codigo", {
                                        required: "El código requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Tipo de cuenta..."
                                    id="codigo"
                                    value={newAuxiliaryBook.codigo}
                                    onChange={(e) => {
                                        setNewAuxiliaryBook({ ...newAuxiliaryBook, codigo: e.target.value });
                                    }}
                                    minLength={5}
                                    maxLength={50}
                                />
                                {errors.codigo && (
                                    <ErrorMessage>{errors.codigo!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="descripcion">
                                    Descripción
                                </label>
                                <input
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Descripción del tipo de cuenta..."
                                    id="descripcion"
                                    value={newAuxiliaryBook.descripcion}
                                    onChange={(e) => {
                                        setNewAuxiliaryBook({ ...newAuxiliaryBook, descripcion: e.target.value });
                                    }}
                                    minLength={5}
                                    maxLength={150}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 md:w-auto mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                                aria-label="Close"
                                onClick={() => {

                                    if (!errors) {
                                        setTimeout(() => {
                                            setOpen(false)
                                        }, 100);
                                    }
                                }}
                            >
                                <Save className="size-5" />
                                Guardar libro axuliar
                            </button>

                        </form>
                        <Dialog.Close asChild>
                            <button
                                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                                aria-label="Close"
                                onClick={() => navigate(location.pathname, { replace: true })}
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