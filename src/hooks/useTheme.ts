import { useCallback, useEffect, useState } from "react";

export function useTheme() {
  const [white, setWhite] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("site-white", white);
    const meta = document.getElementById("theme-color");
    if (meta) meta.setAttribute("content", white ? "#ffffff" : "#09090b");
  }, [white]);

  const toggle = useCallback(() => setWhite((v) => !v), []);
  return { white, toggle };
}
