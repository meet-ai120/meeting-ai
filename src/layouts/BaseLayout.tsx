import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
import { useAppContext } from "@/store/AppContext";
import ToggleTheme from "@/components/ToggleTheme";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAppContext();

  return (
    <div className="flex h-screen flex-col">
      <DragWindowRegion title="electron-shadcn" />
      {/* <NavigationMenu /> */}
      {isLoading ? (
        <div className="relative h-0.5 overflow-hidden">
          <div className="absolute -left-1/2 h-full w-1/4 animate-[loading_2s_ease-in-out_infinite] bg-foreground" />
        </div>
      ) : null}
      <hr />

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
