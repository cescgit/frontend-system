import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import ErrorMessage from "../ErrorMessage";
import { createAccountingAccount } from "../../apis/AccountingAccountAPI";
import { AccountingAccountFormDataAdd } from "../../types/acountingAccountData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import { DataItemTypeAccount } from "../../types/typeAccontData";
import { getAlltypeAccount } from "../../apis/TypeAccountAPI";

const MySwal = withReactContent(Swal);


export default function CreateAccountingAccount() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin;

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('');

const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelected(event.target.value);
    if(event.target.value === "detalle") {
        setNewAccountAccounting({...newAccountAccounting, nivel_cuenta: "DETALLE"});
    }
    else if(event.target.value === "deGrupo") {
        setNewAccountAccounting({...newAccountAccounting, nivel_cuenta: "DE GRUPO"})
    }
};

    // * Type account
    const [typeAccountName, setTypeAccountName] = useState<DataItemTypeAccount[]>([])

    const [newAccountAccounting, setNewAccountAccounting] = useState({
        numero_cuenta: '',
        descripcion: '',
        nivel_cuenta: '',
        ruc: 0,
        centro_costo: 0,
        balance: '',
        id_tipo_cuenta: '',
        usuario_creador: '',
        fecha_creacion: ''
    });

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createAccountingAccount,
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
            setOpen(false);
        }
    })

    const { data: dataTypeAccount } = useQuery({
        queryKey: ["typeAccount"],
        queryFn: getAlltypeAccount,
    })


    useEffect(() => {
        // * type account
        if (dataTypeAccount === undefined) return;
        const getValueTypeAccount = dataTypeAccount?.map((typeAccount) => typeAccount.id)
        const labelTypeAccounts = dataTypeAccount?.map((typeAccount) => typeAccount.nombre)
        const getDataTypeAccount = getValueTypeAccount!.map((value, index) => ({
            value,
            label: labelTypeAccounts![index]
        }));
        setTypeAccountName(getDataTypeAccount);
    }, [dataTypeAccount])


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AccountingAccountFormDataAdd>({ defaultValues: newAccountAccounting });


    const onSubmitCreateAccountAccounting = () => {
        const jwt = localStorage.getItem("tokenAccountingSystem")
        const decoded = jwtDecode<JWTData>(jwt!);
        idUSerLogin = decoded.id;
        newAccountAccounting.usuario_creador = idUSerLogin;

        const data = newAccountAccounting;

        mutate(data)
        setNewAccountAccounting({
            numero_cuenta: '',
            descripcion: '',
            id_tipo_cuenta: '',
            nivel_cuenta: '',
            ruc: 0,
            centro_costo: 0,
            balance: '',
            fecha_creacion: '',
            usuario_creador: idUSerLogin!
        })
        reset();
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button
                        className="flex items-center justify-center bg-slate-50/75 py-1 px-2 border gap-x-2 border-gray-300  rounded font-medium  text-black outline-none hover:bg-slate-100/65 focus-visible:outline-black transition-all duration-200 w-full md:w-auto"
                        onClick={() =>
                            navigate(location.pathname + "?createAccountingAccount")
                        }
                    >
                        <Plus className="size-5" />
                        Agregar cuenta contable
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                    <Dialog.Content
                        onPointerDownOutside={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                        className={`fixed left-1/2 top-1/2 max-h-[90vh] overflow-y-auto touch-pan-y w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                        <Dialog.Title className="font-bold text-black text-2xl text-center">
                            Crear cuenta contable
                        </Dialog.Title>
                        <Dialog.Description className="my-2 text-base text-black text-center">
                            Crea tus cuentas contables aquí...
                        </Dialog.Description>
                        <form
                            onSubmit={handleSubmit(onSubmitCreateAccountAccounting)}
                            className="space-y-3"
                        >
                            <div className="w-full">
                                <label className="w-full text-left text-black font-bold" htmlFor="numero_cuenta">
                                    Número de cuenta
                                </label>
                                <input
                                    {...register("numero_cuenta", {
                                        required: "La cuenta contable es requerido...",
                                    })}
                                    className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                    placeholder="Tu cuenta contable..."
                                    id="numero_cuenta"
                                    value={newAccountAccounting.numero_cuenta}
                                    onChange={(e) => {
                                        setNewAccountAccounting({ ...newAccountAccounting, numero_cuenta: e.target.value });
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
                                    value={newAccountAccounting.descripcion}
                                    onChange={(e) => {
                                        setNewAccountAccounting({ ...newAccountAccounting, descripcion: e.target.value });
                                    }}
                                    minLength={5}
                                    maxLength={150}
                                />
                                {errors.descripcion && (
                                    <ErrorMessage>{errors.descripcion!.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="w-full flex flex-col items-center justify-start gap-x-2">
                                <label className="w-full font-bold" htmlFor="typeAccountSearch">Tipo de cuenta:</label>
                                <div className="border border-gray-300 rounded-md py-1 px-2 flex items-center justify-center w-full">
                                    <input
                                        id="typeAccountSearch"
                                        type="text"
                                        name="typeAccountBrands"
                                        list="listtypeAccount"
                                        placeholder="Buscar tipo de cuenta..."
                                        className="outline-none w-full"
                                        onChange={(e) => {
                                            const selectedItem = typeAccountName.find(item => item.label === e.target.value);

                                            setNewAccountAccounting({ ...newAccountAccounting, id_tipo_cuenta: selectedItem!.value })
                                        }}
                                    />
                                    <datalist id="listtypeAccount">
                                        {
                                            typeAccountName.map(item => (
                                                <option
                                                    key={item.value}
                                                    value={item.label}
                                                />
                                            ))
                                        }
                                    </datalist>
                                </div>
                            </div>

                            <div className="flex w-full items-center justify-start gap-x-8">
                                <label className="text-left text-black font-bold" htmlFor="nivel_cuenta">
                                    Cuenta de:
                                </label>


                                <div className="flex items-center justify-center gap-x-4 w-auto">

                                    <label htmlFor="radioDeGrupo">
                                        <input 
                                            type="radio"
                                            className="font-bold ml-2" 
                                            name="radioNIvelCuenta" 
                                            value="deGrupo"
                                            checked={selected === "deGrupo"}
                                            id="radioDeGrupo" 
                                            onChange={handleChange}
                                        />
                                        DE GRUPO
                                    </label>

                                    <label htmlFor="radioDetalle">
                                        <input 
                                            type="radio"
                                            className="font-bold ml-2" 
                                            name="radioNIvelCuenta" 
                                            value="detalle"
                                            checked={selected === "detalle"}
                                            id="radioDetalle" 
                                            onChange={handleChange}
                                        />
                                        DETALLE
                                    </label>
                                </div>
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
                                    value={newAccountAccounting.ruc}
                                    onChange={(e) => {
                                        setNewAccountAccounting({ ...newAccountAccounting, ruc: +e.target.value });
                                    }}
                                    minLength={2}
                                    maxLength={16}
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
                                    value={newAccountAccounting.centro_costo}
                                    onChange={(e) => {
                                        setNewAccountAccounting({ ...newAccountAccounting, centro_costo: +e.target.value });
                                    }}
                                    minLength={2}
                                    maxLength={30}
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
                                    value={newAccountAccounting.balance}
                                    onChange={(e) => {
                                        setNewAccountAccounting({ ...newAccountAccounting, balance: e.target.value });
                                    }}
                                    minLength={1}
                                />
                                {errors.balance && (
                                    <ErrorMessage>{errors.balance!.message}</ErrorMessage>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 md:w-auto mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                                aria-label="Close"
                            >
                                <Save className="size-5" />
                                Guardar cuenta contable
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