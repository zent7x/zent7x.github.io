export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const fluid = "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]";

export const btn =
  "inline-flex items-center justify-center gap-2 py-2 px-3 text-base font-semibold rounded-lg transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]";

export const btnPrimary = `${btn} bg-white text-black hover:bg-[#9B9B9B]`;
export const btnGhost = `${btn} bg-ink text-white hover:bg-mid`;
