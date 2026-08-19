"use client";

import React, { useState, useEffect } from "react";
import NepaliDatePicker, { NepaliDate } from "@zener/nepali-datepicker-react";
import "@zener/nepali-datepicker-react/index.css";

export function toNepaliDateObj(val) {
  if (!val) return null;
  if (val instanceof NepaliDate) return val;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    return new NepaliDate(val);
  }
  if (typeof val === "string") {
    const year = parseInt(val.slice(0, 4), 10);
    if (!isNaN(year)) {
      if (year >= 1970 && year < 2070) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          return new NepaliDate(d);
        }
      }
      try {
        return new NepaliDate(val);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export default function NepaliDatePickerField({
  value,
  onChange,
  placeholder = "मिति छान्नुहोस् (Select Date)",
  className = "",
  id,
  disabled = false,
  max,
  min,
  ...props
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Client-only mount flag so SSR renders a plain input (avoiding a
    // hydration mismatch with the calendar widget) — no external system to
    // synchronize with here, so the one-time setState is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const nepaliDateVal = toNepaliDateObj(value);
  const nepaliMax = max ? toNepaliDateObj(max) : undefined;
  const nepaliMin = min ? toNepaliDateObj(min) : undefined;

  const handleChange = (selected) => {
    if (!selected) {
      if (onChange) {
        onChange({ target: { value: "", name: id } }, "", null);
      }
      return;
    }

    let adStr = "";
    let bsStr = "";
    if (typeof selected.toAD === "function") {
      adStr = selected.toAD("en").toString();
      bsStr = selected.format("YYYY-MM-DD");
    } else if (selected instanceof Date) {
      adStr = selected.toISOString().slice(0, 10);
      bsStr = new NepaliDate(selected).format("YYYY-MM-DD");
    } else if (typeof selected === "string") {
      bsStr = selected;
      try {
        adStr = new NepaliDate(selected).toAD("en").toString();
      } catch (err) {
        adStr = selected;
      }
    }

    if (onChange) {
      const synthEvent = { target: { value: adStr, name: id } };
      onChange(synthEvent, adStr, bsStr);
    }
  };

  if (!mounted) {
    return (
      <input
        type="text"
        id={id}
        readOnly
        placeholder={placeholder}
        value={nepaliDateVal ? nepaliDateVal.format("YYYY-MM-DD") : ""}
        className={`flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-zinc-800 ${className}`}
      />
    );
  }

  return (
    <div className={`nepali-datepicker-container relative w-full ${className}`}>
      <NepaliDatePicker
        value={nepaliDateVal}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        max={nepaliMax}
        min={nepaliMin}
        className="w-full"
        {...props}
      />
    </div>
  );
}
