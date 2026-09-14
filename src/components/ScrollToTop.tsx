import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById("scroll-area")?.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
