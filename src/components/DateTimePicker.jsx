import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { formatWith, parseDate, parseTime } from "../utils/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Date / time / date-time picker.
 *
 *  mode        "datetime" | "date" | "time"
 *  dateFormat  e.g. "DD MMM YYYY", "MMMM D, YYYY", "DD/MM/YY"
 *  timeFormat  e.g. "hh:mm A" (12h), "h:mm a", "HH:mm" (24h)
 *
 * Without children it renders its own button field. With children (an
 * existing <input>), the input stays typeable and the picker opens when
 * it is clicked, so the original layout/styling is untouched.
 */
export default function DateTimePicker({
  value,
  onChange,
  mode = "datetime",
  dateFormat = "DD MMM YYYY",
  timeFormat = "hh:mm A",
  placeholder,
  inputClass = "",
  children,
}) {
  const wrapRef = useRef(null);
  const popRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);

  const showDate = mode !== "time";
  const showTime = mode !== "date";
  const is24 = /H/.test(timeFormat);
  const fmt =
    mode === "date" ? dateFormat : mode === "time" ? timeFormat : `${dateFormat} ${timeFormat}`;

  const selected = useMemo(() => {
    const text = String(value || "").trim();
    if (!text) return null;
    if (mode === "date") return parseDate(text);
    if (mode === "time") {
      const t = parseTime(text);
      if (!t) return null;
      const d = new Date();
      d.setHours(t.h, t.m, 0, 0);
      return d;
    }
    const m = text.match(/^(.*?)\s+(\d{1,2}:\d{2}(?:\s*[AaPp]\.?[Mm]\.?)?)$/);
    if (!m) return null;
    const date = parseDate(m[1]);
    const time = parseTime(m[2]);
    if (!date || !time) return null;
    date.setHours(time.h, time.m, 0, 0);
    return date;
  }, [value, mode]);

  const [view, setView] = useState(() => {
    const base = selected || new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const anchorEl = () => wrapRef.current?.firstElementChild || wrapRef.current;

  const openPicker = () => {
    if (open) return;
    const base = selected || new Date();
    setView({ year: base.getFullYear(), month: base.getMonth() });
    setOpen(true);
  };

  // Place the popover (fixed, clamped to the viewport, flips above if needed)
  const place = useCallback(() => {
    const a = anchorEl();
    const p = popRef.current;
    if (!a || !p) return;
    const r = a.getBoundingClientRect();
    const w = p.offsetWidth;
    const h = p.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.max(8, Math.min(r.left, vw - w - 8));
    let top = r.bottom + 6;
    if (top + h > vh - 8 && r.top - h - 6 > 8) top = r.top - h - 6;
    top = Math.max(8, Math.min(top, vh - h - 8));
    setPos({ left, top });
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place, view.month, view.year]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current?.contains(e.target) || popRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = selected || new Date();
  const hour24 = current.getHours();
  const hour12 = hour24 % 12 || 12;
  const minute = current.getMinutes();
  const isPM = hour24 >= 12;
  const today = new Date();

  const commit = (d) => onChange(formatWith(d, fmt));

  const pickDay = (day) => {
    const d = new Date(current);
    d.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    commit(d);
    if (mode === "date") setOpen(false);
  };

  const setTime = ({ h, m = minute, pm = isPM }) => {
    const d = new Date(current);
    const base12 = h === undefined ? hour12 : h;
    const h24 = is24 ? (h === undefined ? hour24 : h) : (base12 % 12) + (pm ? 12 : 0);
    d.setHours(h24, m, 0, 0);
    commit(d);
  };

  const shiftMonth = (delta) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const days = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const start = new Date(view.year, view.month, 1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    );
  }, [view]);

  const popBg = "bg-white border-slate-200 text-slate-800";
  const subtle = "text-slate-400";
  const hoverBg = "hover:bg-slate-100";
  const line = "border-slate-200";
  const selectClass = `rounded-lg border px-2 py-1.5 text-sm font-semibold outline-none focus:border-blue-500 bg-white border-slate-200 text-slate-800`;

  const popover = open
    ? createPortal(
        <div
          ref={popRef}
          role="dialog"
          aria-label="Choose date and time"
          style={{
            position: "fixed",
            left: pos?.left ?? 0,
            top: pos?.top ?? 0,
            visibility: pos ? "visible" : "hidden",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.25,
            letterSpacing: "normal",
          }}
          className={`no-print z-[1000] w-[19rem] max-w-[calc(100vw-1rem)] rounded-2xl border p-3 text-left shadow-xl ${popBg}`}
        >
          {showDate && (
            <>
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                  className={`rounded-lg p-1.5 ${hoverBg}`}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold">{MONTH_NAMES[view.month]}</span>
                  <select
                    aria-label="Year"
                    value={view.year}
                    onChange={(e) => setView((v) => ({ ...v, year: Number(e.target.value) }))}
                    className={`${selectClass} py-0.5`}
                  >
                    {Array.from({ length: 21 }, (_, i) => today.getFullYear() - 10 + i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                  className={`rounded-lg p-1.5 ${hoverBg}`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className={`grid grid-cols-7 text-center text-[11px] font-semibold ${subtle}`}>
                {WEEKDAYS.map((w) => (
                  <div key={w} className="py-1">
                    {w}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-0.5">
                {days.map((d) => {
                  const inMonth = d.getMonth() === view.month;
                  const isSel = selected && sameDay(d, selected);
                  const isToday = sameDay(d, today);
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => pickDay(d)}
                      aria-pressed={!!isSel}
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                        isSel
                          ? "bg-blue-600 font-bold text-white"
                          : `${hoverBg} ${inMonth ? "" : subtle} ${
                              isToday ? "font-bold ring-1 ring-blue-500" : ""
                            }`
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {showTime && (
            <div
              className={`flex items-center gap-2 ${
                showDate ? `mt-3 border-t pt-3 ${line}` : ""
              }`}
            >
              <Clock size={16} className={subtle} />
              <select
                aria-label="Hour"
                value={is24 ? hour24 : hour12}
                onChange={(e) => setTime({ h: Number(e.target.value) })}
                className={selectClass}
              >
                {(is24
                  ? Array.from({ length: 24 }, (_, i) => i)
                  : Array.from({ length: 12 }, (_, i) => i + 1)
                ).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="font-bold">:</span>
              <select
                aria-label="Minute"
                value={minute}
                onChange={(e) => setTime({ m: Number(e.target.value) })}
                className={selectClass}
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
              {!is24 && (
                <div className="ml-auto flex overflow-hidden rounded-lg border border-blue-600">
                  {["AM", "PM"].map((label) => {
                    const active = (label === "PM") === isPM;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setTime({ pm: label === "PM" })}
                        className={`px-2.5 py-1.5 text-xs font-bold ${
                          active ? "bg-blue-600 text-white" : "text-blue-600"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="mt-3 flex justify-between">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                commit(now);
                setView({ year: now.getFullYear(), month: now.getMonth() });
              }}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              {mode === "time" ? "Now" : mode === "date" ? "Today" : "Now"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>,
        document.body
      )
    : null;

  // Wrap an existing input: it stays typeable, click / ArrowDown opens the picker
  if (children) {
    return (
      <>
        <span
          ref={wrapRef}
          style={{ display: "contents" }}
          onClick={openPicker}
          onKeyDown={(e) => e.key === "ArrowDown" && openPicker()}
        >
          {children}
        </span>
        {popover}
      </>
    );
  }

  const Icon = mode === "time" ? Clock : Calendar;
  return (
    <>
      <div ref={wrapRef}>
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openPicker())}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`${inputClass} flex items-center justify-between gap-2 text-left`}
        >
          <span className={value ? "" : "text-slate-400"}>
            {value || placeholder || "Select"}
          </span>
          <Icon size={16} className={subtle} />
        </button>
      </div>
      {popover}
    </>
  );
}
