import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fixed full-screen host for a page's shader.
 * On unmount it frees the WebGL context so navigating between pages doesn't
 * leak GPU contexts (browsers cap them). This is what keeps transitions smooth.
 */
export function ShaderHost({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Relying on browser GC for WebGL contexts instead of manually losing them,
    // as manual loss breaks React 18 StrictMode double-mounting.
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {children}
    </div>
  );
}
