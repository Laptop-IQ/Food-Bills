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
      // storage unavailable — pin just won't persist
    }
  }, [pinned]);

  const togglePinned = useCallback(() => setPinned((p) => !p), []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0A0810]">
      {/* Mobile drawer + desktop hover / pinned sidebar */}
      <Sidebar pinned={pinned} onTogglePinned={togglePinned} />

      {/* Main Content — pushed aside smoothly while the sidebar is pinned */}
      <main
        className={[
          "min-h-screen w-full pt-14 md:pt-0",
          "md:transition-[padding-left] md:duration-300",
          "md:ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-reduce:transition-none",
          "print:pl-0",
          pinned ? "md:pl-[260px]" : "md:pl-0",
        ].join(" ")}
      >
        <div className="relative min-h-screen w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
