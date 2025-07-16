import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";


type ViewImageProps = {
    url_image: string,
    messageImage: string,
    onClose: () => void
};

export default function ViewImageDialog({ url_image, messageImage, onClose }: ViewImageProps) {

    const [open, setOpen] = useState(false);
    const [urlImage] = useState(url_image);

    return (
        <>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 bg-black/65 data-[state=${open}]:animate-overlayShow`} />
                <Dialog.Content className={`fixed left-1/2 top-1/2 w-[90%] md:w-[35%] h-[20rem] sm:h-[30rem] md:h-[50%] lg:h-[60%] flex items-center justify-center overflow-y-auto touch-pan-y -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-4 shadow-[var(--shadow-6)] focus:outline-none data-[state=${open}]:animate-contentShow`}>
                    <Dialog.Title className="font-bold text-black text-2xl text-center">

                    </Dialog.Title>
                    <Dialog.Description className="my-2 text-base text-black text-center">

                    </Dialog.Description>
                    <div className="h-full w-full">
                        {
                            messageImage == "" ?
                            (
                                <img className="h-full w-full object-contain cursor-pointer" src={`${urlImage}`} alt="Image producto" />
                            )
                            :                            
                            <div className="flex items-center justify-center flex-col gap-y-2 w-full h-full">
                                <img className="h-full w-full object-contain cursor-pointer" src={`${urlImage}`} alt="Image producto" />
                                <h3 className="font-bold text-center text-lg">{messageImage}</h3>
                            </div>
                        }
                    </div>
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                            aria-label="Close"
                            onClick={() => {
                                onClose()
                                setOpen(false)
                            }}
                        >
                            <X />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </>
    )
}