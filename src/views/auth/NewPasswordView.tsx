import { useState } from "react";
import { ConfirmToken } from "../../types/authData";
import NewPasswordForm from "../../components/Auth/NewPasswordForm";
import NewPasswordToken from "../../components/Auth/NewPasswordToken";

export function NewPasswordView() {
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <div className="h-lvh w-full flex items-center justify-center p-4 lg:p-0">
      <div className="flex items-center justify-center p-4 flex-col">
        <h1 className="md:text-5xl text-4xl text-center font-black text-black">
          Reestablecer Contraseña
        </h1>

        {!isValidToken ? (
          <p className="md:text-2xl text-xl font-normal text-center text-black mt-5">
            Ingresa el código que recibiste {""}
            <span className=" text-cyan-800 font-bold"> por correo.</span>
          </p>
        ) : (
          <p className="md:text-2xl text-xl font-normal text-center text-black mt-5">
            Ingresa la nueva {""}
            <span className=" text-cyan-800 font-bold"> contraseña</span>
          </p>
        )}

        {!isValidToken ? (
          <NewPasswordToken
            token={token}
            setToken={setToken}
            setIsValidToken={setIsValidToken}
          />
        ) : (
          <NewPasswordForm token={token} />
        )}
      </div>
    </div>
  );
}
