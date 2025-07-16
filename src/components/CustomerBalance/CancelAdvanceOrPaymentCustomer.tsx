import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fingerprint, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import { SupplierBalanceFormDataSupplierCancel } from "../../types/supplierBalanceData";
import { formatCurrency } from "../../utils/utils";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import ErrorMessage from "../ErrorMessage";
import { cancelAdvanceOrPaymentCustomer, getDetailsByBalanceCustomer } from "../../apis/CustomerBalanceAPI";

const MySwal = withReactContent(Swal);

interface CancelAdvanceOrpaymentBalanceProps {
    id: string;    
    onClose: () => void
}

export default function CancelAdvanceOrPaymentCustomer({ id, onClose }: CancelAdvanceOrpaymentBalanceProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const customerBalanceId = queryParams.get("customerBalance")!;
    let idUSerLogin;

    const [idClienteWallet, setIdClienteWallet] = useState("");    
    const [newCancelAdvanceOrPayment, setNewCancelAdvanceOrPayment] = useState({
        estado: 0,        
        descripcion_anulacion: '',
        usuario_creador: ''
    })

    useEffect(() => {
        if (id) {
            setIdClienteWallet(id)
        }
    }, [id])

    const { isError, data } = useQuery({
        queryKey: ["customerBalance", customerBalanceId],
        queryFn: () => getDetailsByBalanceCustomer({ id: customerBalanceId }),
        enabled: !!customerBalanceId,
        retry: false
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: cancelAdvanceOrPaymentCustomer,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Anulación de anticipo o pago",
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
            queryClient.invalidateQueries({ queryKey: ["customerBalance"] })
            queryClient.invalidateQueries({ queryKey: ["walletCustomer", customerBalanceId] })
            
            MySwal.fire({
                position: "center",
                title: "Anulación de anticipo o pago",
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
            navigate(location.pathname + `?walletCustomer=${idClienteWallet}`);
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SupplierBalanceFormDataSupplierCancel>({ defaultValues: newCancelAdvanceOrPayment });


    const onSubmitCancelAdvanceOrPayment = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newCancelAdvanceOrPayment.usuario_creador = idUSerLogin;

        if(newCancelAdvanceOrPayment.estado == 1) {
            newCancelAdvanceOrPayment.estado = 0;
        }
        else {
            newCancelAdvanceOrPayment.estado = 1;
        }        

        const formData = newCancelAdvanceOrPayment;
        const data = { customerBalanceId, formData }        

        mutate(data)
        setNewCancelAdvanceOrPayment({
            descripcion_anulacion: '',           
            estado: 0,
            usuario_creador: idUSerLogin!
        })
        reset();
    }

    if (isError) return <Navigate to={"/404"} />

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/65 data-[state=open]:animate-overlayShow" />
                <Dialog.Content
                    onPointerDownOutside={(event) => event.preventDefault()}
                    onInteractOutside={(event) => event.preventDefault()}
                    className="fixed left-1/2 top-1/2 overflow-y-auto touch-pan-y w-full md:w-[80%] lg:w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Anular anticipo o pago
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Aquí puedes anular un anticipo o pago a proveedor, por favor completa los campos requeridos...
                    </Dialog.Description>

                    <div className="w-full flex items-center justify-center flex-col gap-y-4 md:flex-row gap-x-4">
                        {
                            data?.map((supplierBalance) => (
                                <div
                                    className="w-full md:w-[50%] border-2 border-gray-300 rounded-lg h-auto p-4 space-y-2"
                                    key={supplierBalance.id}
                                >
                                    <h2 className="text-lg font-bold text-center">Información del crédito</h2>

                                    <div className="w-fullflex items-center justify-center flex-col">
                                        <label className="w-full" htmlFor="">Total acreditado por el proveedor:</label>
                                        <input
                                            type="text"
                                            className="border text-red-500 border-gray-400 rounded-md py-1 px-2 w-full cursor-not-allowed"
                                            placeholder="0.00"
                                            disabled
                                            value={formatCurrency(supplierBalance.debito!.toString())}
                                        />
                                    </div>

                                    <div className="w-fullflex items-center justify-center flex-col">
                                        <label className="w-full" htmlFor="">Saldo pendiente:</label>
                                        <input
                                            type="text"
                                            className="border text-red-500 border-gray-400 rounded-md py-1 px-2 w-full cursor-not-allowed"
                                            placeholder="0.00"
                                            disabled
                                            value={formatCurrency(supplierBalance.balance!.toString())}
                                        />
                                    </div>
                                </div>
                            ))
                        }

                        <div className="w-full md:w-[50%] border-2 border-gray-300 rounded-lg h-auto p-4 space-y-2">
                            <h2 className="text-lg font-bold text-center">Anulación del registro</h2>

                            <div className="w-full flex flex-row-reverse items-center justify-center gap-x-1">
                                <label className="" htmlFor="checkboxCancel">Anular este anticipo  o pago</label>
                                <input
                                    id="checkboxCancel"
                                    type="checkbox"
                                    className="border border-gray-400 rounded-md py-1 px-2 outline-none active:border-gray-600 h-full"
                                    checked={newCancelAdvanceOrPayment.estado == 1 ? true : false}
                                    onChange={(e) => {
                                        setNewCancelAdvanceOrPayment({ ...newCancelAdvanceOrPayment, estado: e.target.checked ? 1 : 0 });
                                    }}
                                />
                            </div>

                            {
                                newCancelAdvanceOrPayment.estado == 1 &&
                                (
                                    <div className="w-full flex items-center justify-center flex-col">
                                        <label className="w-full" htmlFor="descripcion">Descripción de la anualación:</label>
                                        <input
                                            {...register("descripcion_anulacion", {
                                                required: "La descripción es requerido...",
                                            })}
                                            id="descripcion_anulacion"
                                            type="text"
                                            className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none active:border-gray-600"
                                            placeholder="Breve descripción de la anulación..."
                                            value={newCancelAdvanceOrPayment.descripcion_anulacion}
                                            onChange={(e) => {
                                                setNewCancelAdvanceOrPayment({ ...newCancelAdvanceOrPayment, descripcion_anulacion: e.target.value });
                                            }}
                                        />
                                        {errors.descripcion_anulacion && (
                                            <ErrorMessage>{errors.descripcion_anulacion!.message}</ErrorMessage>
                                        )}
                                    </div>
                                )
                            }
                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmitCancelAdvanceOrPayment)}
                        className="space-y-3"
                    >                       
                        <button
                            type="submit"
                            className="w-full md:w-auto mt-4 mx-auto border border-gray-300 py-2 px-4 bg-red-100/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                            aria-label="Close"
                        >
                            <Fingerprint className="size-5" />
                            Autorizar la anulación del anticipo o pago
                        </button>

                    </form>

                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                            onClick={() => {
                                navigate(location.pathname + `?walletCustomer=${idClienteWallet}`);
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