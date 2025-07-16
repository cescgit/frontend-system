import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useQuery } from "@tanstack/react-query";
import { getDetailsByBalanceSupplier } from "../../apis/SupplierBalanceAPI";
import { formatCurrency, formatDate } from "../../utils/utils";
import { useEffect, useState } from "react";

export default function DetailsByIdSupplierBalanceModal({id}: {id: string}) {
    const navigate = useNavigate();
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const balanceSupplierDetailsId = queryParams.get("viewBalanceSupplir")!;
    
    const [idProveedorWallet, setIdProveedorWallet] = useState("");
    
    useEffect(() => {
        if(id) {
            setIdProveedorWallet(id)
        }
    }, [id])


    const { isError, data } = useQuery({
        queryKey: ["supplierBalance", balanceSupplierDetailsId],
        queryFn: () => getDetailsByBalanceSupplier({ id: balanceSupplierDetailsId }),
        enabled: !!balanceSupplierDetailsId,
        retry: false
    })

    if (isError) return <Navigate to={"/404"} />

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                <Dialog.Content
                    onPointerDownOutside={(event) => event.preventDefault()}
                    onInteractOutside={(event) => event.preventDefault()}
                    className={`fixed left-1/2 top-1/2 overflow-y-auto touch-pan-y w-full md:w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <Dialog.Title className="font-bold text-black text-2xl text-center">
                        Muestra información del anticipo o pago del proveedor
                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">
                        Aquí puedes ver la información del anticipo o pafo del proveedor.
                    </Dialog.Description>

                    {
                        data != undefined &&
                        data!.map((dataItem) => (
                            <div
                                key={dataItem.id}
                                className="flex items-center justify-center p-4 space-x-3 flex-col w-full"
                            >
                                {
                                    dataItem.estado == 0 ?
                                        (
                                            <div className="block space-x-2 w-full">
                                                <h2 className="font-bold text-2xl text-center text-red-400">Este anticipo o pago se encuentra anulado...</h2>

                                                <div className="flex items-center justify-center flex-col">
                                                    <label className="w-full font-bold" htmlFor="">Descripción de la anulación:</label>
                                                    <input
                                                        className="w-full border border-gray-500 rounded-md py-1 px-2 cursor-not-allowed"
                                                        type="text"
                                                        defaultValue={dataItem.descripcion_anulacion!}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        )
                                        :
                                        null
                                }

                                <div className="block space-x-2 w-full">
                                    <h2 className="font-bold text-2xl text-center">Datos del anticipo o pago</h2>

                                    <div className="w-full mt-2 block space-x-2 border-2 border-gray-600 rounded-lg p-4">
                                        <div className="flex items-center justify-center flex-col">
                                            <label htmlFor="" className="w-full">Descripción:</label>
                                            <input
                                                className="w-full border border-gray-500 rounded-md py-1 px-2 cursor-not-allowed"
                                                type="text"
                                                defaultValue={dataItem.descripcion!}
                                                disabled
                                            />
                                        </div>

                                        <div className="flex items-center justify-center flex-col">
                                            <label htmlFor="" className="w-full">Fecha de creación:</label>
                                            <input
                                                className="w-full border border-gray-500 rounded-md py-1 px-2 cursor-not-allowed"
                                                type="text"
                                                defaultValue={formatDate(dataItem.fecha_emision!)}
                                                disabled
                                            />
                                        </div>

                                        <div className="flex items-center justify-center flex-col">
                                            <label htmlFor="" className="w-full">Anticipo o Pago:</label>
                                            <input
                                                className="w-full border border-gray-500 rounded-md py-1 px-2 cursor-not-allowed"
                                                type="text"
                                                defaultValue={formatCurrency(dataItem.debito!)}
                                                disabled
                                            />
                                        </div>

                                        <div className="flex items-center justify-center flex-col">
                                            <label htmlFor="" className="w-full">Balance o deuda:</label>
                                            <input
                                                className="w-full text-red-400 border border-gray-500 rounded-md py-1 px-2 cursor-not-allowed"
                                                type="text"
                                                defaultValue={formatCurrency(dataItem.balance!)}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                        onClick={() => {                            
                            navigate(location.pathname + `?walletSupplier=${idProveedorWallet}`);                                
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