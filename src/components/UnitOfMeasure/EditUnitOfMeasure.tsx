import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { UnitOfMeasureFormDataEdit } from "../../types/unitOfMeasureData";
import { getUnitOfMeasureById, updateUnitOfMeasure } from "../../api/UnitOfMeasureAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function EditUnitOfMeasure({ unitOfMeasure, onClose }: { unitOfMeasure: UnitOfMeasureFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const unitOfMeasureId = queryParams.get("editUnitOfMeasure")!
    const id = unitOfMeasureId;
    let idUSerLogin;

    const { isError, data } = useQuery({
        queryKey: ["unitOfMeasurements", unitOfMeasureId],
        queryFn: () => getUnitOfMeasureById({ id }),
        enabled: !!unitOfMeasureId,
        retry: false
    })

    const [open, setOpen] = useState(false);
    const [editeUnitOfMeasure, setEditeUnitOfMeasure] = useState(unitOfMeasure)

    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UnitOfMeasureFormDataEdit>();


    const { mutate } = useMutation({
        mutationFn: updateUnitOfMeasure,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Unidad de medida",
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
            queryClient.invalidateQueries({ queryKey: ["unitOfMeasurements"] })
            queryClient.invalidateQueries({ queryKey: ["editUnitOfMeasure", unitOfMeasureId] })
            MySwal.fire({
                position: "center",
                title: "Unidad de medida",
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
        editeUnitOfMeasure!.usuario_modificador = idUSerLogin;

        const formData = editeUnitOfMeasure;


        if (!errors) {
            setTimeout(() => {
                setOpen(false)
            }, 100);
            return;
        }

        const dataUnitOfMeasure = { unitOfMeasureId, formData }
        mutate(dataUnitOfMeasure)
    }

    if (isError) return <Navigate to={"/404"} />

    if (data) return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                <Dialog.Content className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Modificar unidad de medida
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Modifica datos de la unidad de medida aquí...
                    </Dialog.Description>
                    <form
                        onSubmit={handleSubmit(onSubmitEdit)}
                        className="space-y-3"
                    >
                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="unidad_medida">
                                Unidad de medida
                            </label>
                            <input
                                {...register("unidad_medida", {
                                    required: "La unidad de meeida es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Tu unidad de medida..."
                                id="unidad_medida"
                                value={editeUnitOfMeasure.unidad_medida}
                                onChange={(e) => {
                                    setEditeUnitOfMeasure({ ...editeUnitOfMeasure, unidad_medida: e.target.value });
                                }}
                                minLength={2}
                                maxLength={15}
                            />
                            {errors.unidad_medida && (
                                <ErrorMessage>{errors.unidad_medida!.message}</ErrorMessage>
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
                                value={editeUnitOfMeasure.abreviatura}
                                onChange={(e) => {
                                    setEditeUnitOfMeasure({ ...editeUnitOfMeasure, abreviatura: e.target.value });
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
                            Modificar unidad de medida
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