import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
import NavigationMenu from "@/components/NavigationMenu";
import ToggleTheme from "@/components/ToggleTheme";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <DragWindowRegion title="electron-shadcn" />
      {/* <NavigationMenu /> */}
      {/* <ToggleTheme /> */}

      <hr />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
