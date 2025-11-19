import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Smooth scroll to top on route change with a configurable duration (ms)
export default function ScrollToTop({ duration = 700 }) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const start = window.scrollY || window.pageYOffset || 0;
    const target = 0;
    const startTime = performance.now();

    // easeInOutQuad
    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = ease(progress);
      const current = Math.round(start + (target - start) * eased);
      window.scrollTo(0, current);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [pathname, search, duration]);

  return null;
}
