import { DropdownMenu } from "radix-ui";
import EditDataUser from "../User/EditDataUser";
import { Auth } from "../../types/authData";

type NavbarMenuUser = {
    nombre_usuario: Auth["nombre_usuario"],
    corrreo_usuario: Auth["correo_usuario"],
    tipo_usuario: Auth["tipo_usuario"],
}

export function SidebarUser({ nombre_usuario, tipo_usuario }: NavbarMenuUser){
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    className="flex gap-x-8 items-center justify-center flex-row-reverse border border-gray-200 py-2 px-4 rounded-lg outline-none hover:shadow-xs hover:shadow-gray-500 cursor-pointer"
                    aria-label="Customise options"
                >
                    <img className="inline-flex size-[35px] items-center justify-center rounded-full bg-white outline-none shadow shadow-gray-500" src="/img/usuario.png" alt="Imagen" />
                    <div className="hidden md:flex flex-col flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{nombre_usuario}</span>
                        <span className="truncate text-xs text-center">{tipo_usuario}</span>
                    </div>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
                    sideOffset={5}
                >
                    <div className="flex flex-col md:hidden flex-1 text-center text-sm border-b border-gray-300 py-1 px-2">
                        <span className="truncate font-semibold">{nombre_usuario}</span>
                        <span className="truncate text-xs">{tipo_usuario}</span>
                    </div>

                    <EditDataUser />
                    
                    <DropdownMenu.Separator className="w-full mx-auto h-px bg-gray-300" />
                    <DropdownMenu.Arrow className="fill-white" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
