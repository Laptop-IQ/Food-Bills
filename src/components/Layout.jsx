import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0810]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`min-h-screen pt-14 md:pt-0 transition-all duration-300 ease-in-out ${
          collapsed ? "md:pl-[84px]" : "md:pl-[264px]"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
