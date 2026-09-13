import * as React from "react";
import { cn } from "../../lib/utils.js";

// --- PROPS INTERFACE ---
export interface FlippableCreditCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardType?: "visa" | "mastercard";
  balance?: string;
  bankName?: string;
  cardVariant?: "black" | "titanium" | "slate" | "glass";
}

const FlippableCreditCard = React.forwardRef<HTMLDivElement, FlippableCreditCardProps>(
  (
    {
      className,
      cardholderName,
      cardNumber,
      expiryDate,
      cvv,
      cardType = "visa",
      balance,
      bankName = "FinSight Black",
      cardVariant = "black",
      ...props
    },
    ref
  ) => {
    // Theme styling variants
    const variantStyles = {
      black:
        "bg-gradient-to-br from-neutral-900 via-[#121212] to-black border border-white/20 text-white shadow-2xl shadow-black/80",
      titanium:
        "bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 border border-neutral-700/60 text-white shadow-2xl",
      slate:
        "bg-gradient-to-br from-[#1c1f26] via-[#11141a] to-[#0a0c10] border border-white/15 text-white shadow-2xl",
      glass:
        "bg-neutral-900/80 backdrop-blur-xl border border-white/25 text-white shadow-2xl shadow-black/60",
    };

    return (
      <div
        className={cn("group h-44 w-72 sm:h-48 sm:w-80 [perspective:1000px] select-none", className)}
        ref={ref}
        {...props}
      >
        {/* The inner container handles the transform animation. */}
        <div className="relative h-full w-full rounded-2xl shadow-2xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] cursor-pointer">
          
          {/* --- CARD FRONT --- */}
          <div
            className={cn(
              "absolute inset-0 h-full w-full rounded-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden [backface-visibility:hidden]",
              variantStyles[cardVariant]
            )}
          >
            {/* Background subtle sheen / holographic pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 w-44 h-44 rounded-full bg-white/[0.03] blur-xl pointer-events-none" />

            {/* Card Top Row: Bank / Tier & Network Logo */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
                  <span className="text-[10px] font-black tracking-tighter text-white">FS</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-neutral-300 uppercase">
                    {bankName}
                  </p>
                  {balance && (
                    <p className="text-[10px] font-medium text-emerald-400">
                      Bal: {balance}
                    </p>
                  )}
                </div>
              </div>

              {cardType === "visa" ? (
                <div className="flex flex-col items-end">
                  <span className="font-serif italic font-black tracking-wider text-base sm:text-lg leading-none text-white drop-shadow-sm">
                    VISA
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
                    Infinite
                  </span>
                </div>
              ) : (
                <div className="flex items-center -space-x-2">
                  <div className="h-5 w-5 rounded-full bg-white/30 backdrop-blur-sm border border-white/20" />
                  <div className="h-5 w-5 rounded-full bg-neutral-400/40 backdrop-blur-sm border border-white/20" />
                </div>
              )}
            </div>

            {/* EMV Chip & Contactless Indicator */}
            <div className="relative z-10 flex items-center gap-3 my-auto">
              <div className="relative h-7 w-10 rounded-md bg-gradient-to-tr from-[#d4af37] via-[#f7e7a9] to-[#c59e2b] p-0.5 border border-amber-300/40 shadow-inner flex items-center justify-center">
                <div className="w-full h-full rounded-[4px] border border-amber-900/30 grid grid-cols-3 gap-0.5 p-0.5 opacity-80">
                  <div className="border-r border-b border-amber-900/40" />
                  <div className="border-b border-amber-900/40" />
                  <div className="border-l border-b border-amber-900/40" />
                  <div className="border-r border-amber-900/40" />
                  <div className="bg-amber-800/20" />
                  <div className="border-l border-amber-900/40" />
                </div>
              </div>
              <svg
                className="w-3.5 h-3.5 text-neutral-400 rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
            </div>

            {/* Card Number */}
            <div className="relative z-10 font-mono text-sm sm:text-base tracking-[0.20em] text-neutral-100 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {cardNumber}
            </div>

            {/* Card Footer */}
            <div className="relative z-10 flex items-end justify-between pt-1 border-t border-white/10">
              <div className="text-left">
                <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                  Card Holder
                </p>
                <p className="font-mono text-xs sm:text-sm font-semibold tracking-wide text-white truncate max-w-[150px]">
                  {cardholderName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                  Expires
                </p>
                <p className="font-mono text-xs sm:text-sm font-semibold tracking-wide text-white">
                  {expiryDate}
                </p>
              </div>
            </div>
          </div>
          
          {/* --- CARD BACK --- */}
          <div
            className={cn(
              "absolute inset-0 h-full w-full rounded-2xl flex flex-col justify-between overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]",
              variantStyles[cardVariant]
            )}
          >
            {/* Top Empty Space */}
            <div className="w-full">
              {/* Magnetic Strip */}
              <div className="mt-4 h-9 w-full bg-neutral-950 border-y border-white/10 shadow-inner" />
              
              {/* Signature & CVV Band */}
              <div className="mx-4 mt-2.5 flex items-center gap-2">
                <div className="h-7 flex-1 bg-neutral-200/90 rounded px-2.5 flex items-center justify-between">
                  <div className="text-[9px] font-serif italic text-neutral-600 truncate">
                    Authorized Signature
                  </div>
                </div>
                <div className="h-7 w-12 bg-white rounded px-2 flex items-center justify-center border border-neutral-300">
                  <p className="font-mono text-xs font-bold text-black tracking-widest">{cvv}</p>
                </div>
              </div>
              <div className="flex justify-between px-4 mt-0.5">
                <p className="text-[7px] text-neutral-500 uppercase">Not Valid Without Signature</p>
                <p className="text-[7px] font-bold text-neutral-400 uppercase">Security CVV</p>
              </div>
            </div>

            {/* Bottom Security Info & Network Logo */}
            <div className="p-4 pt-0 flex items-end justify-between border-t border-white/10 mt-auto">
              <div className="text-[8px] text-neutral-400 leading-tight max-w-[170px]">
                Issued by FinSight Global Trust. 24/7 Concierge Support: +1 (800) 555-FINS
              </div>
              <div>
                {cardType === "visa" ? (
                  <span className="font-serif italic font-black text-sm text-neutral-300">
                    VISA
                  </span>
                ) : (
                  <div className="flex items-center -space-x-1.5">
                    <div className="h-4 w-4 rounded-full bg-white/40" />
                    <div className="h-4 w-4 rounded-full bg-neutral-400/50" />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
);

FlippableCreditCard.displayName = "FlippableCreditCard";

export { FlippableCreditCard };
export default FlippableCreditCard;
