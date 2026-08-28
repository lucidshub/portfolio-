import type { ReactNode } from "react";
import { ShaderHost } from "./ShaderHost";
import { shaderFor } from "../backgrounds";

/** A single topic "page": its own shader background + content. */
export function Page({
  page,
  children,
}: {
  page: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full">
      <ShaderHost>{shaderFor(page)}</ShaderHost>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
