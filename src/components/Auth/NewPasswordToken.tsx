import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { ConfirmToken } from "../../types/authData";
import { validateToken } from "../../apis/AuthAPI";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const { mutate } = useMutation({
    mutationFn: validateToken,
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
      setIsValidToken(true);
    },
  });

  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };

  const handleComplete = (token: ConfirmToken["token"]) => {
    mutate({ token });
  };
  return (
    <>
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
    </>
  );
}
