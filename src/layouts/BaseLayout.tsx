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
    <>
      <DragWindowRegion title="electron-shadcn" />
      {/* <NavigationMenu /> */}
      {/* <ToggleTheme /> */}

      <hr />
      <main className="">{children}</main>
    </>
  );
}
