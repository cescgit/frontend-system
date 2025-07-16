import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { stateValue } from "../../locales/valueState";
import { BrandFormDataEdit } from "../../types/brandData";
import { getBrandById, updateBrand } from "../../api/BrandAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function EditBrand({ brand, onClose }: { brand: BrandFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const brandId = queryParams.get("editBrands")!
    const id = brandId;
    let idUSerLogin;

    const { isError, data } = useQuery({
        queryKey: ["brands", brandId],
        queryFn: () => getBrandById({ id }),
        enabled: !!brandId,
        retry: false
    })

    const [open, setOpen] = useState(false);
    const [editeBrand, setEditeBrand] = useState(brand)

    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BrandFormDataEdit>({ defaultValues: brand });


    const { mutate } = useMutation({
        mutationFn: updateBrand,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Marca",
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
            queryClient.invalidateQueries({ queryKey: ["brands"] })
            queryClient.invalidateQueries({ queryKey: ["editBrands", brandId] })
            MySwal.fire({
                position: "center",
                title: "Marca",
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
        editeBrand!.usuario_modificador = idUSerLogin;

        const formData = editeBrand;


        if (!errors) {
            setTimeout(() => {
                setOpen(false)
            }, 100);
            return;
        }

        const dataBrand = { brandId, formData }
        mutate(dataBrand)
    }

    if (isError) return <Navigate to={"/404"} />

    if (data) return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                <Dialog.Content className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Modificar marca
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Modifica datos de la marca aquí...
                    </Dialog.Description>
                    <form
                        onSubmit={handleSubmit(onSubmitEdit)}
                        className="space-y-3"
                    >
                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="nombre_marca">
                                Marca
                            </label>
                            <input
                                {...register("nombre_marca", {
                                    required: "La marca es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Tu marca..."
                                id="nombre_marca"
                                value={editeBrand.nombre_marca}
                                onChange={(e) => {
                                    setEditeBrand({ ...editeBrand, nombre_marca: e.target.value });
                                }}
                                minLength={5}
                                maxLength={50}
                            />
                            {errors.nombre_marca && (
                                <ErrorMessage>{errors.nombre_marca!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="descripcion">
                                Descripción
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Descripción de la marca..."
                                id="descripcion"
                                value={editeBrand.descripcion}
                                onChange={(e) => {
                                    setEditeBrand({ ...editeBrand, descripcion: e.target.value });
                                }}
                                minLength={5}
                                maxLength={150}
                            />
                        </div>

                        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                            <div className="w-full flex items-center justify-center flex-col">
                                <label className="w-full text-left text-black font-bold" htmlFor="estado">
                                    Estado:
                                </label>
                                <select
                                    {...register("estado", {
                                        required: "El estado es requerido...",
                                    })}
                                    id="estado"
                                    className="w-full border border-gray-400 rounded-md py-1 px-2"
                                    onChange={(e) => {
                                        setEditeBrand({ ...editeBrand, estado: +e.target.value });
                                    }}
                                    defaultValue={editeBrand.estado}
                                >
                                    {
                                        stateValue.map((state) => (
                                            <option
                                                key={state.value}
                                                value={state.value}
                                            >
                                                {state.label}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.estado && (
                                    <ErrorMessage>{errors.estado!.message}</ErrorMessage>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 md:w-auto mx-auto border border-gray-300 py-2 px-4 bg-slate-50/75 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/65 transition-all duration-200"
                            aria-label="Close"
                        >
                            <Edit className="size-5" />
                            Modificar marca
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