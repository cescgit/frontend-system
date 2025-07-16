import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle } from "lucide-react";
import { AlertDialog } from "radix-ui";
import { SeparatedProductFormDataDelete } from "../../types/separatedProductsData";
import { restoredSeparatedProduct } from "../../api/SeparatedProductAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function RestoredSeparatedProductAlertDialog({ separatedProduct, onClose }: { separatedProduct: SeparatedProductFormDataDelete, onClose: () => void }) {
    const [restoredFormSeparatedProduct] = useState(separatedProduct)
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(true);

    const { mutate } = useMutation({
        mutationFn: restoredSeparatedProduct,
        onError: (error) => {
            MySwal.fire({
                position: "center",
                title: "Apartado de producto",
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
            MySwal.fire({
                position: "center",
                title: "Apartado de producto",
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
            queryClient.invalidateQueries({ queryKey: ["separatedProducts"] })
        }
    })

    return (
        <>
            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className={`fixed inset-0 bg-black/80 data-[state=${open}]:animate-overlayShow`} />
                    <AlertDialog.Content className={`fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <AlertDialog.Title className="font-bold text-center text-lg">
                            ¿Seguro desea restaurar el apartado?
                        </AlertDialog.Title>
                        <AlertDialog.Description className="my-2 text-base text-center text-gray-600">
                            {
                                <p>
                                    El apartado número {" "}
                                    <span className="font-bold">{restoredFormSeparatedProduct.numero_apartado}</span>,
                                    se restaura si haces clic en <br />
                                    <span className="bg-green-200 px-1">Si, restaurar apartado...</span>
                                </p>
                            }
                            <div className="flex items-center justify-center my-2 md:my-4">
                                <AlertTriangle className="size-20 text-green-500" />
                            </div>
                        </AlertDialog.Description>
                        <div className="flex flex-col md:flex-row justify-center md:justify-end gap-y-4 md:gap-x-10">
                            <AlertDialog.Cancel asChild>
                                <button
                                    type="button"
                                    className="w-full md:w-auto py-1 px-4 rounded-md bg-gray-200 hover:bg-gray-300 text-black"
                                    onClick={() => {
                                        setOpen(false)
                                        onClose()
                                    }}
                                >
                                    ¡No, Restaurarlo!
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    type="button"
                                    className="w-full md:w-auto py-1 px-4 rounded-md bg-green-300 hover:bg-green-400 text-black"
                                    onClick={() => {
                                        mutate(restoredFormSeparatedProduct.id)
                                        onClose()
                                    }}
                                >
                                    ¡Si, Restaurarlo!
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </>
    )
}
