"use client";

import type { ReactNode, InputHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Space_Grotesk } from "next/font/google";
import { OuvreBackroomBackground } from "./ouvre-backroom-background";
import "./backroom.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

// ── Shell ──────────────────────────────────────────────────────────────────

export function BackroomShell({ children }: { children: ReactNode }) {
  return (
    <div className={`skin-backroom min-h-[100svh] min-h-dvh w-screen flex flex-col antialiased ${spaceGrotesk.className}`}>
      <div className="w-full max-w-[420px] mx-auto flex flex-1 flex-col relative min-h-[540px]">
        {children}
      </div>
    </div>
  );
}

// ── Layout panels ──────────────────────────────────────────────────────────

/** Background + flex column context as a <div>. Use inside BackroomShell. */
export function BackroomPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      <OuvreBackroomBackground />
      {children}
    </div>
  );
}

/** Background + flex column context as a <section>. Use in page layouts. */
export function BackroomPanelSection({ children }: { children: ReactNode }) {
  return (
    <section className={`flex-1 flex flex-col skin-backroom ${spaceGrotesk.className}`}>
      <div className="w-full max-w-[420px] mx-auto flex flex-1 flex-col relative overflow-hidden">
        <OuvreBackroomBackground />
        {children}
      </div>
    </section>
  );
}

/** Centered content layer — place inside BackroomPanel or BackroomPanelSection. */
export function BackroomFormContent({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 flex flex-col flex-1 items-center justify-center py-10 px-6">
      {children}
    </div>
  );
}

/** Page-level heading shared across all backroom screens. */
export function BackroomPageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-base tracking-wider text-white text-center">{children}</h1>
  );
}

// ── Form primitives ────────────────────────────────────────────────────────

export function BackroomLabel({ children }: { children: ReactNode }) {
  return (
    <label className="text-[10px] tracking-[0.1em] text-white/50">
      {children}
    </label>
  );
}

export function BackroomTextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-[2px] bg-black/50 backdrop-blur-sm border border-white/15 px-5 py-3 text-base text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

/** Input with a leading "@" prefix, matching BackroomTextInput's styling. */
export function BackroomHandleInput({
  value,
  onChange,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center rounded-[2px] bg-black/50 backdrop-blur-sm border border-white/15 px-5 py-3 focus-within:border-white/30 transition-colors">
      <span className="text-white/40 text-base select-none">@</span>
      <input
        {...props}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-base text-white placeholder:text-white/30"
      />
    </div>
  );
}

/** Label + input(s) field group, with optional hint text below. */
export function BackroomField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <BackroomLabel>{label}</BackroomLabel>
      {children}
      {hint && <p className="text-[10px] text-white/40 px-2">{hint}</p>}
    </div>
  );
}

// ── Submit button ──────────────────────────────────────────────────────────

type BackroomSubmitButtonProps = {
  isReady: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Techno-animated form submit button.
 * Dims when not ready; bounces + tremors when ready.
 */
export function BackroomSubmitButton({
  isReady,
  children,
  disabled,
  ...props
}: BackroomSubmitButtonProps) {
  return (
    <div className="flex justify-center">
      <span className={isReady ? "techno-beat" : "inline-block"}>
        <button
          {...props}
          disabled={!isReady || disabled}
          className={[
            "tracking-[0.05em] active:scale-95 transition-transform",
            isReady ? "techno-tremor text-black" : "text-black/30",
          ].join(" ")}
        >
          {children}
        </button>
      </span>
    </div>
  );
}
