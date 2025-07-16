import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="h-lvh w-full bg-gradient-to-b from-slate-100 via-[#b8def7] to-[#96cdf1]">
      <Outlet />
    </div>
  );
}
