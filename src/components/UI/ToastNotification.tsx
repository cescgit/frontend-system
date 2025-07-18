import * as React from "react";
import { Toast } from "radix-ui";

export default function ToastNotication({title, description, state}: {title: string, description: string, state: boolean} ) {
	const [open, setOpen] = React.useState(state);		
	return (
		<Toast.Provider swipeDirection="right">
			<Toast.Root
				className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
				open={open}
				onOpenChange={setOpen}
			>
				<Toast.Title className="mb-[5px] text-[15px] font-medium text-slate12 [grid-area:_title]">
					{title}
				</Toast.Title>
				<Toast.Description asChild>
					{description}
				</Toast.Description>
				<Toast.Action
					className="[grid-area:_action]"
					asChild
					altText="Goto schedule to undo"
				>
					<button className="inline-flex h-[25px] items-center justify-center rounded bg-green2 px-2.5 text-xs font-medium leading-[25px] text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8">
					Deshacer
					</button>
				</Toast.Action>
			</Toast.Root>
			<Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
		</Toast.Provider>
	);
};
