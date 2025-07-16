import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { RequestConfirmationCodeForm } from "../../types/authData";
import { requestConfirmationCode } from "../../api/AuthAPI";
import ErrorMessage from "../../components/ErrorMessage";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export function RequestCodeView() {
  const initialValues: RequestConfirmationCodeForm = {
    correo_usuario: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: requestConfirmationCode,
    onError: (error) => {
      MySwal.fire({
        position: "center",
        title: "Código de confirmación",
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
        title: "Código de confirmación",
        icon: "error",
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
      reset();
    },
  });

  const handleRequestCode = (formData: RequestConfirmationCodeForm) =>
    mutate(formData);

  return (
    <>
      <div className="h-lvh w-full flex-col flex items-center justify-center p-4 lg:p-0">
        <h1 className="md:text-4xl text-2xl font-black text-black">
          Solicitar Código de Confirmación
        </h1>
        <p className="md:text-xl text-lg font-light text-black mt-5">
          Coloca tu e-mail para recibir {""}
          <span className=" text-cyan-800 font-bold"> un nuevo código</span>
        </p>

        <form
          onSubmit={handleSubmit(handleRequestCode)}
          className="md:w-2/6 w-full space-y-8 md:p-10 p-4 rounded-lg bg-white mt-10"
          noValidate
        >
          <div className="flex flex-col gap-5">
            <label className="font-normal md:text-xl text-lg" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email de Registro"
              className="w-full p-3 rounded-lg border-gray-300 border"
              {...register("correo_usuario", {
                required: "El Email de registro es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
            {errors.correo_usuario && (
              <ErrorMessage>{errors.correo_usuario.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value="Enviar Código"
            className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg md:text-xl font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full"
          />
        </form>

        <nav className="md:mt-8 mt-6 flex flex-col space-y-3">
          <p className="flex md:text-xl text-lg items-center gap-1 text-center text-gray-800 font-semibold">
            ¿Ya tienes cuenta?
            <Link className="text-cyan-600" to={"/auth/login"}>
              Iniciar sesión
            </Link>
          </p>

          <p className="flex md:text-xl text-lg items-center gap-1 text-center text-gray-800 font-semibold">
            ¿Olvidaste tu contraseña?
            <Link className="text-cyan-600" to={"/auth/forgot-password"}>
              Reestablecer
            </Link>
          </p>
        </nav>
      </div>
    </>
  );
}
