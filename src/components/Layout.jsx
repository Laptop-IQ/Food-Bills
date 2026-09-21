import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0A0810]">
      {/* Only Mobile Menu + Logo */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen w-full pt-14 md:pt-0">
        <div className="relative min-h-screen w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
