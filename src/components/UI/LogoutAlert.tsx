import { AlertTriangle } from "lucide-react";
import { AlertDialog } from "radix-ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function LogoutAlert() {
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);

    const onClickLogout = () => {
        MySwal.fire({
            position: "center",
            title: "cerrar sesión",
            icon: "success",
            html:
                <div className="flex flex-col items-center">
                    <p className="text-cyan-500 font-bold">
                        Su cuenta se cerro correctamente...
                    </p>
                </div>
            ,
            showConfirmButton: false,
            timer: 1500
        });
        navigate("auth/login")
        localStorage.removeItem("tokenAccountingSystem");
        sessionStorage.clear();
        setOpen(true)
    }

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger asChild>
                <button className="inline-flex h-[35px] items-center justify-center rounded bg-violet4 px-[15px] font-medium leading-none text-black outline-none outline-offset-1 hover:bg-slate-100/55 focus-visible:outline-2 focus-visible:outline-black select-none w-full">
                    Cerrar sesión
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={`fixed inset-0 bg-black/80 data-[state=${open}]:animate-overlayShow`} />
                <AlertDialog.Content className={`fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <AlertDialog.Title className="font-bold text-center text-xl">
                        ¿Seguro deseas cerrar sesión?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="my-2 text-base text-center text-gray-600">
                        Cierra sesión para iniciar con una cuanta diferente...
                        <div className="flex items-center justify-center my-2 md:my-4">
                            <AlertTriangle className="text-red-400 size-12 md:size-20" />
                        </div>
                    </AlertDialog.Description>
                    <div className="flex flex-col md:flex-row md:justify-end gap-y-4 md:gap-x-8">
                        <AlertDialog.Cancel asChild>
                            <button className="w-full md:w-auto bg-slate-50 hover:bg-slate-100/55 py-1 px-4 transition duration-200 border border-gray-300 rounded-md">
                                ¡No, cerrar sesión!
                            </button>
                        </AlertDialog.Cancel>
                        <button
                            className="w-full md:w-auto py-1 px-4 bg-red-200 hover:bg-red-300 transition duration-200 border border-gray-300 rounded-md"
                            onClick={onClickLogout}
                        >
                            ¡Si, cerrar sesión!
                        </button>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}