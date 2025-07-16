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
import { UserFormDataEdit } from "../../types/userData";
import { getUserById, updateByManagerUser } from "../../apis/UserAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function EditUser({ user, onClose }: { user: UserFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const userId = queryParams.get("editUser")!
    const id = userId;
    let idUSerLogin;

    const { isError, data } = useQuery({
        queryKey: ["users", userId],
        queryFn: () => getUserById({ id }),
        enabled: !!userId,
        retry: false
    })

    const [open, setOpen] = useState(false);
    const [editedUser, setEditedUser] = useState(user)

    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormDataEdit>();


    const { mutate } = useMutation({
        mutationFn: updateByManagerUser,
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
            queryClient.invalidateQueries({ queryKey: ["users"] })
            queryClient.invalidateQueries({ queryKey: ["editUser", userId] })
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
        }
    })

    const onSubmitEdit = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        editedUser!.usuario_modificador = idUSerLogin;

        const formData = editedUser;

        if (!errors) {
            setTimeout(() => {
                setOpen(false)
            }, 100);
            return;
        }

        const dataUsers = { userId, formData }
        mutate(dataUsers)
    }

    if (isError) return <Navigate to={"/404"} />

    if (data) return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                <Dialog.Content className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Modificar usuario
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Modifica datos del usuarios aquí...
                    </Dialog.Description>
                    <form
                        onSubmit={handleSubmit(onSubmitEdit)}
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
                                value={editedUser.nombre_usuario}
                                onChange={(e) => {
                                    setEditedUser({ ...editedUser, nombre_usuario: e.target.value });
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
                                    value={editedUser.cedula_usuario}
                                    onChange={(e) => {
                                        setEditedUser({ ...editedUser, cedula_usuario: e.target.value });
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
                                    value={editedUser.celular_usuario}
                                    onChange={(e) => {
                                        setEditedUser({ ...editedUser, celular_usuario: e.target.value });
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
                                value={editedUser.correo_usuario}
                                onChange={(e) => {
                                    setEditedUser({ ...editedUser, correo_usuario: e.target.value });
                                }}
                                minLength={10}
                                maxLength={78}
                            />
                            {errors.correo_usuario && (
                                <ErrorMessage>{errors.correo_usuario!.message}</ErrorMessage>
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
                                        setEditedUser({ ...editedUser, estado: +e.target.value });
                                    }}
                                    defaultValue={editedUser.estado}
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
                                    value={editedUser.tipo_usuario}
                                    onChange={(e) => {
                                        setEditedUser({ ...editedUser, tipo_usuario: e.target.value });
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
                            className="w-full mt-4 md:w-auto mx-auto border border-gray-300 py-2 px-4 bg-slate-50/75 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/65 transition-all duration-200"
                            aria-label="Close"
                        >
                            <Edit className="size-5" />
                            Modificar usuario
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