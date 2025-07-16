import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import { updatePasswordWithToken } from "../../api/AuthAPI";
import type { ConfirmToken, NewPasswordForm } from "../../types/authData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

type NewPasswordFormProps = {
  token: ConfirmToken["token"];
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  const navigate = useNavigate();
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarPasswordConfirm, setMostrarPasswordConfirm] = useState(false);

  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: (error) => {
      MySwal.fire({
        position: "center",
        title: "Nueva contraseña",
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
      reset();
      navigate("/auth/login");
    },
  });

  const handleNewPassword = (formData: NewPasswordForm) => {
    const data = {
      formData,
      token,
    };

    mutate(data);
  };

  const password = watch("password");

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className="space-y-8 md:p-10 p-5 w-full mt-5 md:w-[450px] bg-white rounded-lg shadow-md shadow-slate-400"
        noValidate
      >
        <div className="w-full mt-6">
          <label htmlFor="password">Contraseña:</label>
          <div className="flex items-center justify-center mt-2 px-2 border-gray-400 rounded-lg border">
            <Lock color="black" size={24} />
            <input
              className="outline-none w-full py-2 px-4 bg-[#b2daf5]/15"
              type={`${mostrarPassword ? "text" : "password"}`}
              placeholder="Contraseña de registro..."
              id="password"
              {...register("password", {
                required: "La contraseña es obligatorio",
                minLength: {
                  value: 8,
                  message: "La contraseña debe ser mínimo de 8 caracteres",
                },
              })}
            />
            <button
              type="button"
              className=""
              onClick={() => setMostrarPassword(!mostrarPassword)}
            >
              {mostrarPassword ? (
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

        <div className="w-full mt-6">
          <label htmlFor="password_confirmation">Repetir contraseña:</label>
          <div className="flex items-center justify-center mt-2 px-2 border-gray-400 rounded-lg border">
            <Lock color="black" size={24} />
            <input
              className="outline-none w-full py-2 px-4 bg-[#b2daf5]/15"
              type={`${mostrarPasswordConfirm ? "text" : "password"}`}
              placeholder="Contraseña de registro..."
              id="password"
              {...register("password_confirmation", {
                required: "Repetir la contraseña es obligatorio",
                validate: (value) =>
                  value === password || "Las contraseñas no son iguales",
              })}
            />
            <button
              type="button"
              className=""
              onClick={() => setMostrarPasswordConfirm(!mostrarPasswordConfirm)}
            >
              {mostrarPasswordConfirm ? (
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
          type="submit"
          value="Cambiar contraseña"
          className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full"
        />
      </form>

      <nav className="mt-10 md:text-2xl text-xl flex flex-col space-y-4">
        <Link
          to="/auth/login"
          className="text-center text-cyan-600 font-normal"
        >
          Regresar a login
        </Link>
      </nav>
    </>
  );
}
