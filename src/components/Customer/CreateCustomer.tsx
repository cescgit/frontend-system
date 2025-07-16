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
import { createCustomer } from "../../apis/CustomerAPI";
import { CustomerFormDataAdd } from "../../types/customerData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreateCustomer() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin;

    const [open, setOpen] = useState(false);

    const [newCustomer, setNewCustomer] = useState({        
        nombre_cliente: '',
        telefono_cliente: '',
        celular_cliente: '',
        correo_cliente: '',
        direccion_cliente: '',
        ruc: '',
        contacto: '',
        estado: 0,
        termino_venta: '',
        limite_credito: '',
        usuario_creador: ''
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createCustomer,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Cliente",
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
            queryClient.invalidateQueries({ queryKey: ["customers"] })
            MySwal.fire({
                position: "center",
                title: "Cliente",
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
    } = useForm<CustomerFormDataAdd>({ defaultValues: newCustomer });


    const onSubmitCreateCustomer = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newCustomer.usuario_creador = idUSerLogin;

        const data = newCustomer;

        mutate(data)
        setNewCustomer({            
            nombre_cliente: '',
            telefono_cliente: '',
            celular_cliente: '',
            correo_cliente: '',
            direccion_cliente: '',
            ruc: '',
            contacto: '',
            estado: 0,
            termino_venta: '',
            limite_credito: '',
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
                            navigate(location.pathname + "?createUser")
                        }
                    >
                        <Plus className="size-5" />
                        Agregar cliente
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content
                        onPointerDownOutside={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                        className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Crear cliente
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Crea tus cliente aquí...
                        </Dialog.Description>
                        <form
                            onSubmit={handleSubmit(onSubmitCreateCustomer)}
                            className="space-y-3"
                        >                            
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
                                                setNewCustomer({ ...newCustomer, estado: +e.target.value });
                                            }}
                                            defaultValue={newCustomer.estado}
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
                                    <label className="w-full text-left text-black font-bold" htmlFor="ruc">
                                        RUC:
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        placeholder="RUC del cliente..."
                                        id="ruc"
                                        value={newCustomer.ruc}
                                        onChange={(e) => {
                                            setNewCustomer({ ...newCustomer, ruc: e.target.value });
                                        }}
                                        minLength={14}
                                        maxLength={14}
                                    />
                                </div>
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="nombre_cliente">
                                    Cliente:
                                </label>
                                <input
                                    {...register("nombre_cliente", {
                                        required: "El nombre es requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Cliente..."
                                    id="nombre_cliente"
                                    value={newCustomer.nombre_cliente}
                                    onChange={(e) => {
                                        setNewCustomer({ ...newCustomer, nombre_cliente: e.target.value });
                                    }}
                                    minLength={5}
                                    maxLength={120}
                                />
                                {errors.nombre_cliente && (
                                    <ErrorMessage>{errors.nombre_cliente!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">

                                <div className="w-full">
                                    <label className="w-full text-left text-black font-bold" htmlFor="telefono_cliente">
                                        Teléfono:
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        placeholder="Teléfono del cliente..."
                                        id="telefono"
                                        value={newCustomer.telefono_cliente}
                                        onChange={(e) => {
                                            setNewCustomer({ ...newCustomer, telefono_cliente: e.target.value });
                                        }}
                                        minLength={8}
                                        maxLength={8}
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="w-full text-left text-black font-bold" htmlFor="celular_cliente">
                                        Celular:
                                    </label>
                                    <input
                                        {...register("celular_cliente", {
                                            required: "El celular es requerido...",
                                        })}
                                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        placeholder="Celular del proveedor..."
                                        id="celular_cliente"
                                        value={newCustomer.celular_cliente}
                                        onChange={(e) => {
                                            setNewCustomer({ ...newCustomer, celular_cliente: e.target.value });
                                        }}
                                        minLength={8}
                                        maxLength={8}
                                    />
                                    {errors.celular_cliente && (
                                        <ErrorMessage>{errors.celular_cliente!.message}</ErrorMessage>
                                    )}
                                </div>

                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="direccion_cliente">
                                    Dirección:
                                </label>
                                <input
                                    minLength={4}
                                    maxLength={190}
                                    {...register("direccion_cliente", {
                                        required: "La dirección es requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Dirección del cliente..."
                                    id="direccion_cliente"
                                    value={newCustomer.direccion_cliente}
                                    onChange={(e) => {
                                        setNewCustomer({ ...newCustomer, direccion_cliente: e.target.value });
                                    }}
                                />
                                {errors.direccion_cliente && (
                                    <ErrorMessage>{errors.direccion_cliente!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="correo_cliente">
                                    Correo:
                                </label>
                                <input
                                    type="emial"
                                    {...register("correo_cliente", {
                                        required: "El correo es requerido...",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Correo no válido",
                                        },
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Correo del cliente..."
                                    id="correo_cliente"
                                    value={newCustomer.correo_cliente}
                                    onChange={(e) => {
                                        setNewCustomer({ ...newCustomer, correo_cliente: e.target.value });
                                    }}
                                    minLength={7}
                                    maxLength={100}
                                />
                                {errors.correo_cliente && (
                                    <ErrorMessage>{errors.correo_cliente!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="contacto">
                                    Contacto:
                                </label>
                                <input
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Nombre del contacto del cliente..."
                                    id="contacto"
                                    value={newCustomer.contacto}
                                    onChange={(e) => {
                                        setNewCustomer({ ...newCustomer, contacto: e.target.value });
                                    }}
                                    minLength={5}
                                    maxLength={100}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                                <div className="w-full">
                                    <label className="w-full text-left text-black font-bold" htmlFor="limite_credito">
                                        Limite de crédito
                                    </label>
                                    <input
                                        {...register("limite_credito", {
                                            required: "El limite del crédito es necesario..."
                                        })}
                                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        placeholder="Termino de la compra al proveedor..."
                                        id="limite_credito"
                                        value={newCustomer.limite_credito}
                                        onChange={(e) => {
                                            setNewCustomer({ ...newCustomer, limite_credito: e.target.value });
                                        }}
                                        minLength={5}
                                        maxLength={100}
                                    />
                                    {errors.limite_credito && (
                                        <ErrorMessage>{errors.limite_credito!.message}</ErrorMessage>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label className="w-full text-left text-black font-bold" htmlFor="termino_venta">
                                        Termino de la venta:
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        placeholder="Termino de la compra al proveedor..."
                                        id="termino_venta"
                                        value={newCustomer.termino_venta}
                                        onChange={(e) => {
                                            setNewCustomer({ ...newCustomer, termino_venta: e.target.value });
                                        }}
                                        minLength={5}
                                        maxLength={100}
                                    />
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 md:w-[50%] mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                                aria-label="Close"                          
                            >
                                <Save className="size-5" />
                                Guardar cliente
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