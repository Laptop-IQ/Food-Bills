import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const PIN_KEY = "bill-hub-sidebar-pinned";

const readPinned = () => {
  try {
    return localStorage.getItem(PIN_KEY) === "1";
  } catch {
    return false;
  }
};

export default function Layout() {
  const [pinned, setPinned] = useState(readPinned);

  useEffect(() => {
    try {
      localStorage.setItem(PIN_KEY, pinned ? "1" : "0");
    } catch {
      // storage unavailable: pin just won't persist
    }
  }, [pinned]);

  const togglePinned = useCallback(() => setPinned((p) => !p), []);

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#0A0810]">
      <Sidebar pinned={pinned} onTogglePinned={togglePinned} />
      {/* Desktop: a 64px icon rail is always visible; pinning widens it to 264px and pushes content */}
      <main
        className={[
          "min-h-screen w-full pt-14 md:pt-0",
          "md:transition-[padding-left] md:duration-200 md:ease-out",
          "motion-reduce:transition-none print:pl-0",
          pinned ? "md:pl-[264px]" : "md:pl-16",
        ].join(" ")}
      >
        <div className="relative min-h-screen w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
