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
import { SupplierFormDataEdit } from "../../types/supplierData";
import { getSupplierById, updateSupplier } from "../../apis/SupplierAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function EditSupplier({ supplier, onClose }: { supplier: SupplierFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const supplierId = queryParams.get("editSupplier")!
    const id = supplierId;
    let idUSerLogin;

    const { isError, data } = useQuery({
        queryKey: ["suppliers", supplierId],
        queryFn: () => getSupplierById({ id }),
        enabled: !!supplierId,
        retry: false
    })

    const [open, setOpen] = useState(false);
    const [editeSupplier, setEditeSupplier] = useState(supplier)

    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SupplierFormDataEdit>();


    const { mutate } = useMutation({
        mutationFn: updateSupplier,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Proveedor",
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
            queryClient.invalidateQueries({ queryKey: ["suplliers"] })
            queryClient.invalidateQueries({ queryKey: ["editSupplier", supplierId] })
            MySwal.fire({
                position: "center",
                title: "Proveedor",
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
        editeSupplier!.usuario_modificador = idUSerLogin;

        const formData = editeSupplier;

        if (!errors) {
            setTimeout(() => {
                setOpen(false)
            }, 100);
            return;
        }

        const dataSuppliers = { supplierId, formData }
        mutate(dataSuppliers)
    }

    if (isError) return <Navigate to={"/404"} />

    if (data) return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                <Dialog.Content className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Modificar proveedor
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Modifica datos del proveedor aquí...
                    </Dialog.Description>
                    <form
                        onSubmit={handleSubmit(onSubmitEdit)}
                        className="space-y-3"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                            
                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="ruc">
                                    RUC:
                                </label>
                                <input
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="RUC del proveedor..."
                                    id="ruc"
                                    value={editeSupplier.ruc}
                                    onChange={(e) => {
                                        setEditeSupplier({ ...editeSupplier, ruc: e.target.value });
                                    }}
                                    minLength={14}
                                    maxLength={14}
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="nombre_usuario">
                                Proveedor:
                            </label>
                            <input
                                {...register("nombre_proveedor", {
                                    required: "El nombre es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Proveedor..."
                                id="nombre_proveedor"
                                value={editeSupplier.nombre_proveedor}
                                onChange={(e) => {
                                    setEditeSupplier({ ...editeSupplier, nombre_proveedor: e.target.value });
                                }}
                                minLength={5}
                                maxLength={120}
                            />
                            {errors.nombre_proveedor && (
                                <ErrorMessage>{errors.nombre_proveedor!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="telefono">
                                    Teléfono:
                                </label>
                                <input
                                    {...register("telefono_proveedor", {
                                        required: "El teléfono es requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Teléfono del proveedor..."
                                    id="telefono"
                                    value={editeSupplier.telefono_proveedor}
                                    onChange={(e) => {
                                        setEditeSupplier({ ...editeSupplier, telefono_proveedor: e.target.value });
                                    }}
                                    minLength={8}
                                    maxLength={8}
                                />
                                {errors.telefono_proveedor && (
                                    <ErrorMessage>{errors.telefono_proveedor!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="celular_proveedor">
                                    Celular:
                                </label>
                                <input
                                    {...register("celular_proveedor", {
                                        required: "El celular es requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Celular del proveedor..."
                                    id="celular_proveedor"
                                    value={editeSupplier.celular_proveedor}
                                    onChange={(e) => {
                                        setEditeSupplier({ ...editeSupplier, celular_proveedor: e.target.value });
                                    }}
                                    minLength={8}
                                    maxLength={8}
                                />
                                {errors.celular_proveedor && (
                                    <ErrorMessage>{errors.celular_proveedor!.message}</ErrorMessage>
                                )}
                            </div>

                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="cedula_usuario">
                                Dirección:
                            </label>
                            <input
                                minLength={4}
                                maxLength={190}
                                {...register("direccion_proveedor", {
                                    required: "La dirección es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Dirección del proveedor..."
                                id="direccion_proveedor"
                                value={editeSupplier.direccion_proveedor}
                                onChange={(e) => {
                                    setEditeSupplier({ ...editeSupplier, direccion_proveedor: e.target.value });
                                }}
                            />
                            {errors.direccion_proveedor && (
                                <ErrorMessage>{errors.direccion_proveedor!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="celular_usuario">
                                Correo:
                            </label>
                            <input
                                type="emial"
                                {...register("correo_proveedor", {
                                    required: "El correo es requerido...",
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Correo no válido",
                                    },
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Correo del proveedor..."
                                id="correo_proveedor"
                                value={editeSupplier.correo_proveedor}
                                onChange={(e) => {
                                    setEditeSupplier({ ...editeSupplier, correo_proveedor: e.target.value });
                                }}
                                minLength={7}
                                maxLength={100}
                            />
                            {errors.correo_proveedor && (
                                <ErrorMessage>{errors.correo_proveedor!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="contacto">
                                Contacto:
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Nombre del contacto del proveedor..."
                                id="contacto"
                                value={editeSupplier.contacto}
                                onChange={(e) => {
                                    setEditeSupplier({ ...editeSupplier, contacto: e.target.value });
                                }}
                                minLength={5}
                                maxLength={100}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
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
                                            setEditeSupplier({ ...editeSupplier, estado: +e.target.value });
                                        }}
                                        defaultValue={editeSupplier.estado}
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

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="termino_compra">
                                    Termino de la venta:
                                </label>
                                <input
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Termino de la compra al proveedor..."
                                    id="termino_compra"
                                    value={editeSupplier.termino_compra}
                                    onChange={(e) => {
                                        setEditeSupplier({ ...editeSupplier, termino_compra: e.target.value });
                                    }}
                                    minLength={5}
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 md:w-auto mx-auto border border-gray-300 py-2 px-4 bg-slate-50/75 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/65 transition-all duration-200"
                            aria-label="Close"
                        >
                            <Edit className="size-5" />
                            Modificar proveedor
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