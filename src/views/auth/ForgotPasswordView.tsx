import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { ForgotPasswordForm } from "../../types/authData";
import { forgotPassword } from "../../apis/AuthAPI";
import ErrorMessage from "../../components/ErrorMessage";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export function ForgotPasswordView() {
  const initialvalue: ForgotPasswordForm = {
    correo_usuario: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialvalue });

  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      MySwal.fire({
        position: "center",
        title: "Contraseña olvidada",
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
        title: "Contraseña olvidada",
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
      reset();
    },
  });

  const handleLogin = (FormData: ForgotPasswordForm) => mutate(FormData);
  return (
    <>
      <div className="h-lvh w-full flex items-center justify-center p-4 lg:p-0">
        <div className="border rounded-lg shadow-md shadow-slate-400 bg-white [background:radial-gradient(125%_125%_at_50%_5%,#96cdf1_2%,#fff_100%)] border-gray-400  w-full md:w-[50%] lg:w-[30%] flex items-center justify-center flex-col gap-4 p-4">
          <img
            className="size-24 lg:size-40"
            src="/img/forgot-password.svg"
            alt="Imagen Login"
          />
          <h2 className="text-xl lg:text-2xl font-bold m-1">
            ¡Reestablece tu contraseña!
          </h2>
          <p className="text-base lg:text-lg text-center">
            ¿Olvidaste tu contraseña? coloca tu correo
            <br />
            <span className="text-sky-700">y reestable tu contraseña.</span>
          </p>

          <form
            action=""
            className="w-full"
            onSubmit={handleSubmit(handleLogin)}
          >
            <div className="w-full">
              <label htmlFor="email">Correo:</label>
              <div className="flex items-center justify-center mt-2 px-2 border-gray-400 rounded-lg border">
                <Mail color="black" size={24} />
                <input
                  className="outline-none bg-[#b2daf5]/15 w-full py-2 px-4"
                  type="email"
                  placeholder="Ingresa tu correo electrónico..."
                  id="email"
                  {...register("correo_usuario", {
                    required: "El correo es obligatorio...",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Correo no válido",
                    },
                  })}
                />
              </div>
              {errors.correo_usuario && (
                <ErrorMessage>{errors.correo_usuario.message}</ErrorMessage>
              )}
            </div>

            <input
              className="mt-6 bg-[#bde0fe] py-2 px-4 rounded-lg border border-gray-400 w-full text-center text-lg font-bold hover:bg-[#a3d0f8] transition-all duration-200 cursor-pointer "
              type="submit"
              value="Enviar instrucciones"
            />
          </form>

          <nav className="mt-4 flex gap-0 lg:gap-2 flex-col md:flex-row text-base items-center justify-center text-bold">
            <p>¿Ya tienes cuenta?</p>
            <Link className="text-cyan-600" to={"/auth/login"}>
              Inicia sesión.
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
