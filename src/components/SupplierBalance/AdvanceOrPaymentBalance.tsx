import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fingerprint, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import { createAdvanceOrPayment } from "../../api/SupplierBalanceAPI";
import { SupplierBalanceFormDataSupplierAdd } from "../../types/supplierBalanceData";
import { formatCurrency } from "../../utils/utils";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import ErrorMessage from "../ErrorMessage";


const MySwal = withReactContent(Swal);

interface AdvanceOrpaymentBalanceProps {
    totalBalance: number;
    id_proveedor: string;
    idBalanceProveedor: string;
    onClose: () => void
}

export default function AdvanceOrPaymentBalance({ totalBalance, id_proveedor, idBalanceProveedor, onClose }: AdvanceOrpaymentBalanceProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const supplierBalanceId = queryParams.get("walletSupplier")!;
    let idUSerLogin;


    const [isCancel, setIsCancel] = useState(false);
    const [resultCalculateBalance, setresultCalculateBalance] = useState(0)
    const [totalBalanceInfo] = useState(totalBalance)
    const [newAdvanceOrPayment, setNewAdvanceOrPayment] = useState({
        descripcion: '',
        debito: '',
        id_proveedor: '',
        id_balance_proveedor: '',
        usuario_creador: ''
    })

    const handleCalculateBalance = (e: number) => {

        if (e == 0 || e < 0) {

            MySwal.fire({
                position: "center",
                title: "Balance del proveedor",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-red-500 font-bold">
                            Debes de agregar un valor mayor a 0...
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });

            return;
        }
        else if (e > totalBalanceInfo) {
            
            MySwal.fire({
                position: "center",
                title: "Balance del proveedor",
                icon: "error",
                html:
                    <div className="flex flex-col items-center">
                        <p className="text-red-500 font-bold">
                            El abono o pago no puede ser mayor a lo acreditado...
                        </p>
                    </div>
                ,
                showConfirmButton: false,
                timer: 1500
            });

            return;
        }
        else {
            const result = (totalBalanceInfo - e);
            setresultCalculateBalance(+result.toFixed(2))
        }

    }

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createAdvanceOrPayment,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Balance del proveedor",
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
            queryClient.invalidateQueries({ queryKey: ["supplierBalance"] })
            queryClient.invalidateQueries({ queryKey: ["walletSupplier", supplierBalanceId] })
            queryClient.invalidateQueries({ queryKey: ["createAdvanceOrPaymentSupplierBalance"] })
            MySwal.fire({
                position: "center",
                title: "Balance del proveedor",
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
            onClose();            
            navigate(location.pathname + `?walletSupplier=${supplierBalanceId}`);
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SupplierBalanceFormDataSupplierAdd>({ defaultValues: newAdvanceOrPayment });


    const onSubmitCreateAdvanceOrPayment = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newAdvanceOrPayment.usuario_creador = idUSerLogin;
        newAdvanceOrPayment.id_proveedor = id_proveedor;
        newAdvanceOrPayment.id_balance_proveedor = idBalanceProveedor;

        if (isCancel == true) {
            newAdvanceOrPayment.debito = totalBalanceInfo.toString();
        }
        const formData = newAdvanceOrPayment;
        const data = { id_proveedor, formData }

        mutate(data)
        setNewAdvanceOrPayment({
            descripcion: '',
            debito: '',
            id_proveedor: '',
            id_balance_proveedor: '',
            usuario_creador: idUSerLogin!
        })
        // idBalanceProveedor = "";
        reset();
    }

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/65 data-[state=open]:animate-overlayShow" />
                <Dialog.Content
                    onPointerDownOutside={(event) => event.preventDefault()}
                    onInteractOutside={(event) => event.preventDefault()}
                    className="fixed left-1/2 top-1/2 overflow-y-auto touch-pan-y w-full md:w-[80%] lg:w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Registra anticipo o pago a proveedor
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Aquí puedes registrar un anticipo o pago a proveedor, por favor completa los campos requeridos...
                    </Dialog.Description>

                    <div className="w-full flex items-center justify-center flex-col gap-y-4 md:flex-row gap-x-4">
                        <div className="w-full md:w-[50%] border-2 border-gray-300 rounded-lg h-auto p-4 space-y-2">
                            <h2 className="text-lg font-bold text-center">Información del crédito</h2>

                            <div className="w-fullflex items-center justify-center flex-col">
                                <label className="w-full" htmlFor="">Total acreditado por el proveedor:</label>
                                <input
                                    type="text"
                                    className="border text-red-500 border-gray-400 rounded-md py-1 px-2 w-full cursor-not-allowed"
                                    placeholder="0.00"
                                    disabled
                                    value={totalBalanceInfo == 0 ? formatCurrency("0") : formatCurrency(totalBalanceInfo.toString())}
                                />
                            </div>

                            <div className="w-fullflex items-center justify-center flex-col">
                                <label className="w-full" htmlFor="">Saldo pendiente:</label>
                                <input
                                    type="text"
                                    className="border text-red-500 border-gray-400 rounded-md py-1 px-2 w-full cursor-not-allowed"
                                    placeholder="0.00"
                                    disabled
                                    value={resultCalculateBalance == 0 ? formatCurrency("0") : +newAdvanceOrPayment.debito > totalBalance ? formatCurrency("0") : formatCurrency(resultCalculateBalance.toString())}
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-[50%] border-2 border-gray-300 rounded-lg h-auto p-4 space-y-2">
                            <h2 className="text-lg font-bold text-center">Creación de anticipo o pago</h2>

                            <div className="w-full flex items-center justify-center flex-col">
                                <label className="w-full" htmlFor="descripcion">Descripción:</label>
                                <input
                                    {...register("descripcion", {
                                        required: "La descripción es requerido...",
                                    })}
                                    id="descripcion"
                                    type="text"
                                    className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none active:border-gray-600"
                                    placeholder="Breve descripción del anticipo o pago"
                                    value={newAdvanceOrPayment.descripcion}
                                    onChange={(e) => {
                                        setNewAdvanceOrPayment({ ...newAdvanceOrPayment, descripcion: e.target.value });
                                    }}
                                />
                                {errors.descripcion && (
                                    <ErrorMessage>{errors.descripcion!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full flex items-center justify-center flex-col">
                                <label className="w-full" htmlFor="debito">Monto a pagar o de anticipo:</label>
                                <input
                                    {...register("debito", {
                                        required: "El monto de pago o el anticipo es requerido...",
                                    })}
                                    id="debito"
                                    type="number"
                                    className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none active:border-gray-600"
                                    placeholder="0.00"
                                    value={isCancel == true ? totalBalanceInfo : newAdvanceOrPayment.debito != "" ? newAdvanceOrPayment.debito : "0.00"}
                                    onChange={(e) => {
                                        setNewAdvanceOrPayment({ ...newAdvanceOrPayment, debito: e.target.value });
                                        handleCalculateBalance(+e.target.value)
                                    }}
                                />
                            </div>

                            <div className="w-full flex flex-row-reverse items-center justify-center gap-x-1">
                                <label className="" htmlFor="checkboxCancel">Cancelar total del crédito</label>
                                <input
                                    id="checkboxCancel"
                                    type="checkbox"
                                    className="border border-gray-400 rounded-md py-1 px-2 outline-none active:border-gray-600 h-full"
                                    checked={isCancel}
                                    onChange={(e) => {
                                        setIsCancel(e.target.checked);
                                    }}
                                />
                            </div>
                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmitCreateAdvanceOrPayment)}
                        className="space-y-3"
                    >
                        <button
                            type="submit"
                            className="w-full md:w-auto mt-4 mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                            aria-label="Close"
                        >
                            <Fingerprint className="size-5" />
                            Autorizar anticipo o pago
                        </button>

                    </form>

                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                            onClick={() => {
                                navigate(location.pathname + `?walletSupplier=${supplierBalanceId}`);
                                reset();
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