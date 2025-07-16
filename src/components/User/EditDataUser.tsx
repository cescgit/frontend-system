import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Save, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserFormDataEditStaff } from "../../types/userData";
import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../../api/UserAPI";
import { JWTData } from "../../types/jwtData";
import { jwtDecode } from "jwt-decode";
import LogoutAlert from "../UI/LogoutAlert";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function EditDataUser() {
	const navigate = useNavigate()
	const location = useLocation()
	const queryParams = new URLSearchParams(location.search)
	const userId = queryParams.get("editDataUser")!
	const id = userId;


	const [isActiveNewPassword, setIsActiveNewPassword] = useState(false);
	const [isActiveOldPassword, setIsActiveOldPassword] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [open, setOpen] = useState(false);
	const [idUser, setIdUser] = useState("")
	useEffect(() => {
		const jwt = localStorage.getItem("tokenAccountingSystem")
		const decoded = jwtDecode<JWTData>(jwt!);
		setIdUser(decoded.id)
	}, [])


	const { isError, data } = useQuery({
		queryKey: ["user", userId],
		queryFn: () => getUserById({ id }),
		enabled: !!userId,
		retry: false
	})

	const [editedUser, setEditedUser] = useState({
		celular_usuario: "",
		correo_usuario: "",
		oldPasswordUser: "",
		password: ""
	})


	const queryClient = useQueryClient()

	const {
		handleSubmit
	} = useForm<UserFormDataEditStaff>()

	const { mutate } = useMutation({
		mutationFn: updateUser,
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
			queryClient.invalidateQueries({ queryKey: ["editDataUser", userId] })

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
		}
	})

	const onSubmit = () => {
		const formData = editedUser;
		const dataUsers = { userId: idUser, formData }
		mutate(dataUsers)
	}

	if (isError) return <Navigate to={"/404"} />

	return (
		<>
			<Dialog.Root open={open} onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					<button
						className="inline-flex h-[35px] items-center justify-center rounded bg-violet4 px-[15px] font-medium leading-none text-black outline-none outline-offset-1 hover:bg-slate-100/55 focus-visible:outline-2 focus-visible:outline-black w-full"
						onClick={() =>
							navigate(location.pathname + `?editDataUser=${idUser!}`)
						}
					>
						Modificar perfil
					</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
					<Dialog.Content className={`fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
						<Dialog.Title className="font-bold text-black text-2xl text-center">
							Modificar perfil
						</Dialog.Title>
						<Dialog.Description className="my-2 text-base text-black text-center">
							Modifica tus datos personales
						</Dialog.Description>
						{data?.map((userEdit) => (
							<form
								key={userEdit.id}
								onSubmit={handleSubmit(onSubmit)}
								className="flex flex-col items-center justify-center space-y-4"
							>
								<div className="flex flex-col gap-y-1 items-center justify-center w-full">
									<label className="w-full text-left text-black font-bold" htmlFor="celular_usuario">
										Celular usuario
									</label>
									<input
										className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
										placeholder="Tu número aquí..."
										id="celular_usuario"
										value={editedUser.celular_usuario = userEdit.celular_usuario}
										onChange={(e) => {
											userEdit.celular_usuario = e.target.value;
											setEditedUser({ ...editedUser, celular_usuario: userEdit.celular_usuario });
										}}
									/>
								</div>

								<div className="flex flex-col gap-y-1 items-center justify-center w-full">
									<label className="w-full text-left text-black font-bold" htmlFor="correo_usuario">
										Correo usuario
									</label>
									<input
										className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
										id="correo_usuario"
										value={editedUser.correo_usuario = userEdit.correo_usuario}
										onChange={(e) => {
											userEdit.correo_usuario = e.target.value;
											setEditedUser({ ...editedUser, correo_usuario: userEdit.correo_usuario });
										}}
									/>
								</div>

								<div className="flex flex-col gap-y-1 items-center justify-center w-full">
									<label className="w-full text-left text-black font-bold" htmlFor="oldPassword">
										Contraseña anterior
									</label>
									<div className="border border-gray-500 w-full rounded-md flex items-center justify-center px-4 py-1">
										<input
											className="font-normal text-base placeholder:text-gray-300 outline-none focus-visible:border-gray-800 w-full"
											id="oldPassword"
											value={oldPassword}
											type={isActiveOldPassword ? "text" : "password"}
											onChange={(e) => {
												setOldPassword(e.target.value);
												setEditedUser({ ...editedUser, oldPasswordUser: e.target.value });
											}}
										/>
										<button
											type="button"
											onClick={() => setIsActiveOldPassword(!isActiveOldPassword)}
										>

											{
												isActiveOldPassword ? (
													<Eye className="size-5 text-gray-500" />
												)
													:
													(
														<EyeOff className="size-5 text-gray-500" />
													)
											}

										</button>
									</div>
								</div>

								<div className="flex flex-col gap-y-1 items-center justify-center w-full">
									<label className="w-full text-left text-black font-bold" htmlFor="newPassword">
										Contraseña nueva
									</label>
									<div className="border border-gray-500 w-full rounded-md flex items-center justify-center px-4 py-1">
										<input
											className="font-normal text-base placeholder:text-gray-300 outline-none focus-visible:border-gray-800 w-full"
											id="newPassword"
											value={newPassword}
											type={isActiveNewPassword ? "text" : "password"}
											onChange={(e) => {
												setNewPassword(e.target.value);
												setEditedUser({ ...editedUser, password: e.target.value });
											}}
										/>
										<button
											type="button"
											onClick={() => setIsActiveNewPassword(!isActiveNewPassword)}
										>

											{
												isActiveNewPassword ? (
													<Eye className="size-5 text-gray-500" />
												)
													:
													(
														<EyeOff className="size-5 text-gray-500" />
													)
											}

										</button>
									</div>
								</div>

								<div className="mt-[25px] flex justify-center">
									<button
										type="submit"
										className="w-full md:w-auto border border-gray-300 py-2 px-4 bg-slate-50/75 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/65 transition-all duration-200"
										aria-label="Close"
									>
										<Save className="size-5" />
										Modificar perfil
									</button>
								</div>
							</form>
						))}
						<Dialog.Close asChild>
							<button
								className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
								aria-label="Close"
								onClick={() => navigate(location.pathname, { replace: true })}
							>
								<X />
							</button>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>

			<LogoutAlert />
		</>
	)
}
