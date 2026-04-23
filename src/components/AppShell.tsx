import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AppShell({ children }: Props) {
  return <main className="app-shell">{children}</main>;
}
