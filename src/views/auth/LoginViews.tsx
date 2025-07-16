import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { UserLoginForm } from "../../types/authData";
import { authenticateUser } from "../../apis/AuthAPI";
import ErrorMessage from "../../components/ErrorMessage";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import {
  browserName,
  osName,
  deviceType,
  getUA,
} from "react-device-detect";

const MySwal = withReactContent(Swal);

export function LoginView() {
  const [activePassword, setActivePassword] = useState(false);
  const navigate = useNavigate();

  const initialvalue: UserLoginForm = {
    correo_usuario: "",
    password: "",
    detalle_inicio_sesion: [
      {
        sesion_activa: 1,
        navegador: browserName,
        sistema_operativo: osName,
        tipo_dispositivo: deviceType,
        user_agent: getUA
      }
    ]
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialvalue });

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      MySwal.fire({
        position: "center",
        title: "Inicio de sesión",
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
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleLogin = (FormData: UserLoginForm) => {
    mutate(FormData);
  }

  return (
    <>
      <div className="h-lvh w-full flex items-center justify-center p-4 lg:p-0">
        <div className="border rounded-lg shadow-md shadow-slate-400 bg-white [background:radial-gradient(125%_125%_at_50%_5%,#96cdf1_4%,#fff_100%)] border-gray-400  w-full sm:w-[85%] md:w-[50%] lg:w-[45%]  xl:w-[30%] flex items-center justify-center flex-col gap-4 p-4">
          <img
            className="size-28"
            src="/img/image-login.svg"
            alt="Imagen Login"
          />
          <h2 className="text-xl lg:text-2xl font-bold m-1">
            ¡Bienvenido nuevamente!
          </h2>
          <p className="text-base lg:text-lg text-center">
            Por favor ingresa tus datos para
            <br />
            <span className="text-sky-700">iniciar sesión.</span>
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

            <div className="w-full mt-6">
              <label htmlFor="password">Contraseña:</label>
              <div className="flex items-center justify-center mt-2 px-2 border-gray-400 rounded-lg border">
                <Lock color="black" size={24} />
                <input
                  className="outline-none w-full py-2 px-4 bg-[#b2daf5]/15"
                  type={activePassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña..."
                  id="password"
                  autoComplete="section-blue shipping address-level2"
                  {...register("password", {
                    required: "La contraseña es obligatoria...",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setActivePassword(!activePassword)}
                >
                  {activePassword ? (
                    <Eye color="black" size={24} />
                  ) : (
                    <EyeOff color="black" size={24} />
                  )}
                </button>
              </div>
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </div>

            <input
              className="mt-6 bg-[#bde0fe] py-2 px-4 rounded-lg border border-gray-400 w-full text-center text-lg font-bold hover:bg-[#a3d0f8] transition-all duration-200 cursor-pointer "
              type="submit"
              value="Inicia sesión"
            />
          </form>

          <nav className="mt-4 flex gap-0 lg:gap-2 flex-col md:flex-row text-base items-center justify-center text-bold">
            <p>¿Olvidaste tu contraseña?</p>
            <Link className="text-cyan-600" to={"/auth/forgot-password"}>
              Reestablecer aquí
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
