import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { stateValue } from "../../locales/valueState";
import { createSupplier } from "../../api/SupplierAPI";
import { SupplierFormDataAdd } from "../../types/supplierData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreateSupplier() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin;

    const [open, setOpen] = useState(false);

    const [newSupplier, setNewSupplier] = useState({
        codigo_proveedor: '',
        nombre_proveedor: '',
        direccion_proveedor: '',
        correo_proveedor: '',
        telefono_proveedor: '',
        celular_proveedor: '',
        ruc: '',
        contacto: '',
        estado: 0,
        termino_compra: '',
        usuario_creador: ''        
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createSupplier,
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
            navigate(location.pathname, { replace: true })
            setOpen(false)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["suppliers"] })
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
            setOpen(false);
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SupplierFormDataAdd>({ defaultValues: newSupplier });


    const onSubmitCreateSupplier = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newSupplier.usuario_creador = idUSerLogin;

        const data = newSupplier;

        if (!errors) {
            setTimeout(() => {
                setOpen(false)
            }, 100);
            return;
        }

        mutate(data)
        setNewSupplier({
            codigo_proveedor: '',
            nombre_proveedor: '',
            direccion_proveedor: '',
            correo_proveedor: '',
            telefono_proveedor: '',
            celular_proveedor: '',
            ruc: '',
            contacto: '',
            estado: 0,
            termino_compra: '',            
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
                            navigate(location.pathname + "?createSupplier")
                        }
                    >
                        <Plus className="size-5" />
                        Agregar proveedor
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content 
                        onPointerDownOutside={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                    className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Crear proveedor
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Crea tus proveedores aquí...
                        </Dialog.Description>
                        <form
                            onSubmit={handleSubmit(onSubmitCreateSupplier)}
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
                                        value={newSupplier.ruc}
                                        onChange={(e) => {
                                            setNewSupplier({ ...newSupplier, ruc: e.target.value });
                                        }}
                                        minLength={14}
                                        maxLength={14}
                                    />
                                </div>
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="nombre_proveedor">
                                    Proveedor:
                                </label>
                                <input
                                    {...register("nombre_proveedor", {
                                        required: "El nombre es requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Proveedor..."
                                    id="nombre_proveedor"
                                    value={newSupplier.nombre_proveedor}
                                    onChange={(e) => {
                                        setNewSupplier({ ...newSupplier, nombre_proveedor: e.target.value });
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
                                    <label className="w-full text-left text-black font-bold" htmlFor="telefono_proveedor">
                                        Teléfono:
                                    </label>
                                    <input
                                        {...register("telefono_proveedor", {
                                            required: "El teléfono es requerido...",
                                        })}
                                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        placeholder="Teléfono del proveedor..."
                                        id="telefono"
                                        value={newSupplier.telefono_proveedor}
                                        onChange={(e) => {
                                            setNewSupplier({ ...newSupplier, telefono_proveedor: e.target.value });
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
                                        value={newSupplier.celular_proveedor}
                                        onChange={(e) => {
                                            setNewSupplier({ ...newSupplier, celular_proveedor: e.target.value });
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
                                <label className="w-full text-left text-black font-bold" htmlFor="direccion_proveedor">
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
                                    value={newSupplier.direccion_proveedor}
                                    onChange={(e) => {
                                        setNewSupplier({ ...newSupplier, direccion_proveedor: e.target.value });
                                    }}
                                />
                                {errors.direccion_proveedor && (
                                    <ErrorMessage>{errors.direccion_proveedor!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="correo_proveedor">
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
                                    value={newSupplier.correo_proveedor}
                                    onChange={(e) => {
                                        setNewSupplier({ ...newSupplier, correo_proveedor: e.target.value });
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
                                    value={newSupplier.contacto}
                                    onChange={(e) => {
                                        setNewSupplier({ ...newSupplier, contacto: e.target.value });
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
                                                setNewSupplier({ ...newSupplier, estado: +e.target.value });
                                            }}                                         
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
                                        value={newSupplier.termino_compra}
                                        onChange={(e) => {
                                            setNewSupplier({ ...newSupplier, termino_compra: e.target.value });
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 md:w-[50%] mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                                aria-label="Close"
                                onClick={() => {
                                    setTimeout(() => {
                                        if(!errors) {
                                            setOpen(false)
                                        }
                                    }, 100);
                                }}
                            >
                                <Save className="size-5" />
                                Guardar proveedor
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