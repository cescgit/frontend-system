import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { WeightFormDataEdit } from "../../types/weightData";
import { getWeightById, updateWeight } from "../../apis/WeightAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function EditWeight({ weight, onClose }: { weight: WeightFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const weightId = queryParams.get("editWeight")!
    const id = weightId;
    let idUSerLogin;

    const { isError, data } = useQuery({
        queryKey: ["weight", weightId],
        queryFn: () => getWeightById({ id }),
        enabled: !!weightId,
        retry: false
    })

    const [open, setOpen] = useState(false);
    const [editeWeight, setEditeWeight] = useState(weight)

    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<WeightFormDataEdit>();


    const { mutate } = useMutation({
        mutationFn: updateWeight,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Peso del producto",
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
            queryClient.invalidateQueries({ queryKey: ["weight"] })
            queryClient.invalidateQueries({ queryKey: ["editWeight", weightId] })
             MySwal.fire({
                position: "center",
                title: "Peso del producto",
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

    const onSubmitEdit = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        editeWeight!.usuario_modificador = idUSerLogin;

        const formData = editeWeight;

        const dataWeight = { weightId, formData }
        mutate(dataWeight)
    }

    if (isError) return <Navigate to={"/404"} />

    if (data) return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                <Dialog.Content className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Modificar peso
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Modifica el peso del producto aquí...
                    </Dialog.Description>
                    <form
                        onSubmit={handleSubmit(onSubmitEdit)}
                        className="space-y-3"
                    >
                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="peso">
                                Peso
                            </label>
                            <input
                                {...register("peso", {
                                    required: "El peso es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Tu unidad de medida..."
                                id="peso"
                                value={editeWeight.peso}
                                onChange={(e) => {
                                    setEditeWeight({ ...editeWeight, peso: e.target.value });
                                }}
                                minLength={2}
                                maxLength={15}
                            />
                            {errors.peso && (
                                <ErrorMessage>{errors.peso!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="abreviatura">
                                Abreviatura
                            </label>
                            <input
                                {...register("abreviatura", {
                                    required: "La abreviatura es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="La abreviatura es requerido..."
                                id="abreviatura"
                                value={editeWeight.abreviatura}
                                onChange={(e) => {
                                    setEditeWeight({ ...editeWeight, abreviatura: e.target.value });
                                }}
                                minLength={1}
                                maxLength={5}
                            />
                            {errors.abreviatura && (
                                <ErrorMessage>{errors.abreviatura!.message}</ErrorMessage>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 md:w-auto mx-auto border border-gray-300 py-2 px-4 bg-slate-50/75 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/65 transition-all duration-200"
                            aria-label="Close"
                            onClick={() => {
                                setTimeout(() => {
                                    if (!errors) {
                                        setOpen(false);
                                    }
                                }, 100);
                            }}
                        >
                            <Edit className="size-5" />
                            Modificar peso
                        </button>

                    </form>
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                            onClick={() => {
                                navigate(location.pathname, { replace: true })
                                onClose()
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