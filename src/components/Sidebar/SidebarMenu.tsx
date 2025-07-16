import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

export default function SidebarMenu({ icon: Icon, label, to }: { icon: LucideIcon, label: string, to: string }) {
    return (
        <Link
            to={to}
            className="flex items-center gap-x-3 p-2 rounded-r-md hover:bg-gray-200 cursor-pointer"
        >
            <Icon className="size-5" />
            {<span>{label}</span>}
        </Link>
    )
}