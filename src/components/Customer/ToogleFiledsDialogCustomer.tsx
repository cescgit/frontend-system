import { Eye, Save, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react"

export default function ToogleFieldsDialogCustomer({ showFields, setShowFields }: { showFields: string[], setShowFields: (fields: string[]) => void }) {
    const allFields = [
        "codigo_cliente",        
        "nombre_cliente",
        "telefono_cliente",
        "celular_cliente",
        "correo_cliente",
        "direccion_cliente",
        "ruc",
        "contacto",
        "estado",
        "termino_venta",
        "limite_credito",
        "fecha_creacion",
        "nombre_usuario_creador",
        "nombre_usuario_modificador"
    ]
    const [localShowFields, setLocalShowFields] = useState(showFields)
    const [open, setOpen] = useState(false)

    const handleToggle = (field: string) => {
        if (localShowFields.includes(field)) {
            setLocalShowFields(localShowFields.filter(f => f !== field))
        } else {
            setLocalShowFields([...localShowFields, field])
        }
    }

    const handleSave = () => {
        setShowFields(localShowFields)
        setTimeout(() => {
            setOpen(false)
        }, 100);
    }
    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center transition-all duration-200 py-1 px-2 bg-slate-50/75 border border-gray-300 hover:bg-slate-100/65 rounded-md font-medium gap-x-2 w-full md:w-[50%]"
                    >
                        <Eye className="size-5" />
                        Mostrar campos
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content className={`fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Mostrar u Ocultar
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Muestra u oculta campos de la tabla...
                        </Dialog.Description>
                        {allFields?.map((field) => (

                            <div key={field} className="flex items-center">
                                <input
                                    id={`toggle-${field}`}
                                    type="checkbox"
                                    checked={localShowFields.includes(field)}
                                    onChange={() => handleToggle(field)}
                                    className="mr-2"
                                />
                                <label htmlFor={`toggle-${field}`}>
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                            </div>
                        ))}
                        <div className="mt-[25px] flex justify-center">
                            <button
                                type="submit"
                                className="w-full md:w-auto border border-gray-500 py-2 px-4 bg-gray-100 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-gray-300 transition-all duration-200"
                                aria-label="Close"
                                onClick={handleSave}
                            >
                                <Save className="size-5" />
                                Guardar configuraciones
                            </button>
                        </div>
                        <Dialog.Close asChild>
                            <button
                                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                                aria-label="Close"
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
