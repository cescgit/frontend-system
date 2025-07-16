import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { AccountingAccountFormDataEdit } from "../../types/acountingAccountData";
import { getAccountingAccountById, updateAccountingAccount } from "../../apis/AccountingAccountAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function EditAccountingAccount({ accountAccounting, onClose }: { accountAccounting: AccountingAccountFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const accountingAccountId = queryParams.get("editAccountingAccount")!
    const id = accountingAccountId;
    let idUSerLogin;

    const { isError, data } = useQuery({
        queryKey: ["accountingAccount", accountingAccountId],
        queryFn: () => getAccountingAccountById({ id }),
        enabled: !!accountingAccountId,
        retry: false
    })

    const [open, setOpen] = useState(false);
    const [editeAccountAccounting, setEditeAccountAccounting] = useState(accountAccounting)

    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AccountingAccountFormDataEdit>({ defaultValues: editeAccountAccounting });


    const { mutate } = useMutation({
        mutationFn: updateAccountingAccount,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Cuenta contable",
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
            queryClient.invalidateQueries({ queryKey: ["accountingAccount"] })
            queryClient.invalidateQueries({ queryKey: ["editAccountingAccount", accountingAccountId] })
            MySwal.fire({
                position: "center",
                title: "Cuenta contable",
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
        editeAccountAccounting!.usuario_modificador = idUSerLogin;

        const formData = editeAccountAccounting;


        if (!errors) {
            setTimeout(() => {
                setOpen(false)
            }, 100);
            return;
        }

        const dataAccountAccounting = { accountingAccountId, formData }
        mutate(dataAccountAccounting)
    }

    if (isError) return <Navigate to={"/404"} />

    if (data) return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                <Dialog.Content className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Modificar cuenta contable
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Modifica datos de la cuenta contable aquí...
                    </Dialog.Description>
                    <form
                        onSubmit={handleSubmit(onSubmitEdit)}
                        className="space-y-3"
                    >
                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="numero_cuenta">
                                Cuenta contable
                            </label>
                            <input
                                {...register("numero_cuenta", {
                                    required: "La cuenta contable es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Tu cuenta contable..."
                                id="numero_cuenta"
                                value={editeAccountAccounting.numero_cuenta}
                                onChange={(e) => {
                                    setEditeAccountAccounting({ ...editeAccountAccounting, numero_cuenta: e.target.value });
                                }}
                                minLength={5}
                                maxLength={50}
                            />
                            {errors.numero_cuenta && (
                                <ErrorMessage>{errors.numero_cuenta!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="descripcion">
                                Descripción
                            </label>
                            <input
                                {...register("descripcion", {
                                    required: "La descripción es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Descripción de la cuenta contable..."
                                id="descripcion"
                                value={editeAccountAccounting.descripcion}
                                onChange={(e) => {
                                    setEditeAccountAccounting({ ...editeAccountAccounting, descripcion: e.target.value });
                                }}
                                minLength={5}
                                maxLength={150}
                            />
                            {errors.descripcion && (
                                <ErrorMessage>{errors.descripcion!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="tipo_cuenta">
                                Tipo de cuenta
                            </label>
                            <input
                                {...register("id_tipo_cuenta", {
                                    required: "El tipo de cuenta contable es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Descripción de la la cuenta contable..."
                                id="tipo_cuenta"
                                value={editeAccountAccounting.id_tipo_cuenta}
                                onChange={(e) => {
                                    setEditeAccountAccounting({ ...editeAccountAccounting, id_tipo_cuenta: e.target.value });
                                }}
                                minLength={5}
                                maxLength={150}
                            />
                            {errors.id_tipo_cuenta && (
                                <ErrorMessage>{errors.id_tipo_cuenta!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="nivel_cuenta">
                                Tipo de cuenta
                            </label>
                            <input
                                {...register("nivel_cuenta", {
                                    required: "El nivel de cuenta contable es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Nivel de cuenta contable..."
                                id="nivel_cuenta"
                                value={editeAccountAccounting.nivel_cuenta}
                                onChange={(e) => {
                                    setEditeAccountAccounting({ ...editeAccountAccounting, nivel_cuenta: e.target.value });
                                }}
                                minLength={5}
                                maxLength={150}
                            />
                            {errors.nivel_cuenta && (
                                <ErrorMessage>{errors.nivel_cuenta!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="ruc">
                                RUC
                            </label>
                            <input
                                {...register("ruc", {
                                    required: "El ruc es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Ruc aquí..."
                                id="ruc"
                                value={editeAccountAccounting.ruc}
                                onChange={(e) => {
                                    setEditeAccountAccounting({ ...editeAccountAccounting, ruc: +e.target.value });
                                }}
                                minLength={5}
                                maxLength={150}
                            />
                            {errors.ruc && (
                                <ErrorMessage>{errors.ruc!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="centro_costo">
                                Centro de costos
                            </label>
                            <input
                                {...register("centro_costo", {
                                    required: "El centro_costo es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Centro de costoo aquí..."
                                id="centro_costo"
                                value={editeAccountAccounting.centro_costo}
                                onChange={(e) => {
                                    setEditeAccountAccounting({ ...editeAccountAccounting, centro_costo: +e.target.value });
                                }}
                                minLength={5}
                                maxLength={150}
                            />
                            {errors.centro_costo && (
                                <ErrorMessage>{errors.centro_costo!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="balance">
                                Balance
                            </label>
                            <input
                                {...register("balance", {
                                    required: "El balance es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Balance aquí..."
                                id="balance"
                                value={editeAccountAccounting.balance}
                                onChange={(e) => {
                                    setEditeAccountAccounting({ ...editeAccountAccounting, balance: e.target.value });
                                }}
                                minLength={5}
                                maxLength={150}
                            />
                            {errors.balance && (
                                <ErrorMessage>{errors.balance!.message}</ErrorMessage>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 md:w-auto mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                            aria-label="Close"
                            onClick={() => {
                                setTimeout(() => {
                                    setOpen(false)
                                }, 100);
                            }}
                        >
                            <Edit className="size-5" />
                            Modificar cuenta contable
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