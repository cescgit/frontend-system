import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Plus, Save, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createUser } from "../../api/UserAPI";
import { UserFormDataAdd } from "../../types/userData";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { stateValue } from "../../locales/valueState";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function CreateUser() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin;

    const [open, setOpen] = useState(false);
    const [passwordView, setPasswordView] = useState(false)

    const [newUser, setNewUser] = useState({
        nombre_usuario: '',
        cedula_usuario: '',
        celular_usuario: '',
        correo_usuario: '',
        tipo_usuario: '',
        password: '',
        estado: 0,
        usuario_creador: ''
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createUser,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Usuario",
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
            queryClient.invalidateQueries({ queryKey: ["users"] });
             MySwal.fire({
                position: "center",
                title: "Usuario",
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
            reset();
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserFormDataAdd>({ defaultValues: newUser });


    const onSubmitCreateUser = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newUser.usuario_creador = idUSerLogin;

        const data = newUser;

        mutate(data)
        setNewUser({
            nombre_usuario: '',
            cedula_usuario: '',
            celular_usuario: '',
            correo_usuario: '',
            tipo_usuario: '',
            password: '',
            estado: 0,
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
                        Agregar usuario
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content
                        onPointerDownOutside={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                        className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}
                    >
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Crear usuario
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Crea tus usuarios aquí...
                        </Dialog.Description>
                        <form
                            onSubmit={handleSubmit(onSubmitCreateUser)}
                            className="space-y-3"
                        >
                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="nombre_usuario">
                                    Nombres y Apellidos:
                                </label>
                                <input
                                    {...register("nombre_usuario", {
                                        required: "El nombre es requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Nombre del usuario..."
                                    id="nombre_usuario"
                                    value={newUser.nombre_usuario}
                                    onChange={(e) => {
                                        setNewUser({ ...newUser, nombre_usuario: e.target.value });
                                    }}
                                    minLength={5}
                                    maxLength={198}
                                />
                                {errors.nombre_usuario && (
                                    <ErrorMessage>{errors.nombre_usuario!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                                <div className="w-full">
                                    <label className="w-full text-left text-black font-bold" htmlFor="cedula_usuario">
                                        Cedula usuario:
                                    </label>
                                    <input
                                        minLength={16}
                                        maxLength={16}
                                        {...register("cedula_usuario", {
                                            required: "La cedula es requerido...",
                                        })}
                                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        placeholder="XXX-XXXXXX-XXXXX"
                                        id="cedula_usuario"
                                        value={newUser.cedula_usuario}
                                        onChange={(e) => {
                                            setNewUser({ ...newUser, cedula_usuario: e.target.value });
                                        }}
                                    />
                                    {errors.cedula_usuario && (
                                        <ErrorMessage>{errors.cedula_usuario!.message}</ErrorMessage>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label className="w-full text-left text-black font-bold" htmlFor="celular_usuario">
                                        Celular usuario:
                                    </label>
                                    <input
                                        {...register("celular_usuario", {
                                            required: "El celular es requerido...",
                                        })}
                                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        placeholder="Celular del usuario..."
                                        id="celular_usuario"
                                        value={newUser.celular_usuario}
                                        onChange={(e) => {
                                            setNewUser({ ...newUser, celular_usuario: e.target.value });
                                        }}
                                        minLength={8}
                                        maxLength={8}
                                    />
                                    {errors.celular_usuario && (
                                        <ErrorMessage>{errors.celular_usuario!.message}</ErrorMessage>
                                    )}
                                </div>
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="correo_usuario">
                                    Correo del usuario:
                                </label>
                                <input
                                    {...register("correo_usuario", {
                                        required: "El correo es requerido...",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Correo no válido",
                                        },
                                    })}
                                    type="email"
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Correo del usuario..."
                                    id="correo_usuario"
                                    value={newUser.correo_usuario}
                                    autoComplete="username"
                                    onChange={(e) => {
                                        setNewUser({ ...newUser, correo_usuario: e.target.value });
                                    }}
                                    minLength={10}
                                    maxLength={78}
                                />
                                {errors.correo_usuario && (
                                    <ErrorMessage>{errors.correo_usuario!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="password">
                                    Contraseña del usuario:
                                </label>
                                <div className="flex items-center justify-center px-1 border-gray-400 rounded-lg border">
                                    <input
                                        {...register("password", {
                                            required: "La contraseña es requerido...",
                                        })}
                                        className="py-1 px-4 font-normal text-base w-full placeholder:text-gray-300 outline-none"
                                        placeholder="Contraseña del usuario..."
                                        id="password"
                                        autoComplete="current-password"
                                        value={newUser.password}
                                        onChange={(e) => {
                                            setNewUser({ ...newUser, password: e.target.value });
                                        }}
                                        type={passwordView ? "text" : "password"}
                                        minLength={8}
                                        maxLength={100}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordView(!passwordView)}
                                    >
                                        {passwordView ? (
                                            <Eye color="black" size={24} />
                                        ) : (
                                            <EyeOff color="black" size={24} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <ErrorMessage>{errors.password!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
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
                                            setNewUser({ ...newUser, estado: +e.target.value });
                                        }}
                                        defaultValue={newUser.estado}
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

                                <div className="w-full">
                                    <label className="w-full text-left text-black font-bold" htmlFor="tipo_usuario">
                                        Tipo de usuario
                                    </label>
                                    <input
                                        {...register("tipo_usuario", {
                                            required: "Este campo es requerido...",
                                        })}
                                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        placeholder="Tipo de usuario..."
                                        id="tipo_usuario"
                                        value={newUser.tipo_usuario}
                                        onChange={(e) => {
                                            setNewUser({ ...newUser, tipo_usuario: e.target.value });
                                        }}
                                        minLength={3}
                                        maxLength={50}
                                    />
                                    {errors.tipo_usuario && (
                                        <ErrorMessage>{errors.tipo_usuario!.message}</ErrorMessage>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 md:w-[50%] mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                                aria-label="Close"
                            >
                                <Save className="size-5" />
                                Guardar usuario
                            </button>

                        </form>
                        <Dialog.Close asChild>
                            <button
                                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                                aria-label="Close"
                                onClick={() => {
                                    navigate(location.pathname, { replace: true })
                                    reset()
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