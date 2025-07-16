import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { ConfirmToken } from "../../types/authData";
import { confirmAccount } from "../../apis/AuthAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export function ConfirmAccountView() {
  const navigate = useNavigate();
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      MySwal.fire({
        position: "center",
        title: "Confirmar cuenta",
        icon: "error",
        html:
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold text-red-600">
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
        title: "Confirmar cuenta",
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
      setToken("");
      navigate("/auth/login");
    },
  });

  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };

  const handleComplete = (token: ConfirmToken["token"]) => {
    mutate({ token });
  };

  return (
    <div className="h-lvh w-full flex items-center justify-center p-4 lg:p-0">
      <div className="flex items-center justify-center p-4 flex-col">
        <h1 className="md:text-5xl text-center text-3xl font-black text-black">
          Confirma tu Cuenta
        </h1>
        <p className="md:text-2xl text-xl text-center font-light text-black mt-5">
          Ingresa el código que recibiste {""}
          <span className=" text-cyan-800 font-bold"> por correo.</span>
        </p>
        <form className="space-y-8 p-10 bg-white mt-8 rounded-lg">
          <label className="font-normal text-2xl text-center block">
            Código de 6 dígitos
          </label>
          <div className="flex justify-center gap-4">
            <PinInput
              value={token}
              onChange={handleChange}
              onComplete={handleComplete}
            >
              <PinInputField className="w-8 font-bold outline-none text-cyan-800 focus-visible:border-cyan-700 focus-visible:border-2 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
              <PinInputField className="w-8 font-bold outline-none text-cyan-800 focus-visible:border-cyan-700 focus-visible:border-2 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
              <PinInputField className="w-8 font-bold outline-none text-cyan-800 focus-visible:border-cyan-700 focus-visible:border-2 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
              <PinInputField className="w-8 font-bold outline-none text-cyan-800 focus-visible:border-cyan-700 focus-visible:border-2 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
              <PinInputField className="w-8 font-bold outline-none text-cyan-800 focus-visible:border-cyan-700 focus-visible:border-2 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
              <PinInputField className="w-8 font-bold outline-none text-cyan-800 focus-visible:border-cyan-700 focus-visible:border-2 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            </PinInput>
          </div>
        </form>

        <nav className="mt-10 flex flex-col space-y-4">
          <Link
            to="/auth/request-code"
            className="text-center text-lg text-cyan-800 font-bold hover:scale-105 transition-all duration-150"
          >
            Solicitar un nuevo Código
          </Link>
        </nav>
      </div>
    </div>
  );
}
