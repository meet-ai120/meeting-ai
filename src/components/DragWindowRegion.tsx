import React, { type ReactNode } from "react";
import { Button } from "./ui/button";

import { Input } from "./ui/input";
import { ChevronLeft, Moon, Search, Sun } from "lucide-react";
import { UserNav } from "./UserNav";
import { Label } from "./ui/label";
import { useRouter, useRouterState } from "@tanstack/react-router";
import ToggleTheme from "./ToggleTheme";
import { useAppContext } from "@/store/AppContext";

interface DragWindowRegionProps {
  title?: ReactNode;
}

export default function DragWindowRegion() {
  const router = useRouter();
  const { title } = useAppContext();
  const routerState = useRouterState();

  return (
    <div className="draglayer flex w-screen items-center items-stretch justify-between p-2 pr-4">
      <div className="flex flex-1 items-center gap-4">
        {routerState.location.pathname !== "/" && (
          <>
            <Button
              variant="outline"
              className="no-drag"
              size="sm"
              onClick={() => router.navigate({ to: "/" })}
            >
              <ChevronLeft size="sm" />
            </Button>
            <h1 className="text-lg font-bold">{title}</h1>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="no-drag relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search the docs..."
            className="pl-8"
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </div>
        {/* <ToggleTheme className="no-drag" /> */}

        <UserNav className="no-drag" />
      </div>
    </div>
  );
}

// function WindowButtons() {
//   return (
//     <div className="flex">
//       <button
//         title="Minimize"
//         type="button"
//         className="p-2 hover:bg-slate-300"
//         onClick={minimizeWindow}
//       >
//         <svg
//           aria-hidden="true"
//           role="img"
//           width="12"
//           height="12"
//           viewBox="0 0 12 12"
//         >
//           <rect fill="currentColor" width="10" height="1" x="1" y="6"></rect>
//         </svg>
//       </button>
//       <button
//         title="Maximize"
//         type="button"
//         className="p-2 hover:bg-slate-300"
//         onClick={maximizeWindow}
//       >
//         <svg
//           aria-hidden="true"
//           role="img"
//           width="12"
//           height="12"
//           viewBox="0 0 12 12"
//         >
//           <rect
//             width="9"
//             height="9"
//             x="1.5"
//             y="1.5"
//             fill="none"
//             stroke="currentColor"
//           ></rect>
//         </svg>
//       </button>
//       <button
//         type="button"
//         title="Close"
//         className="p-2 hover:bg-red-300"
//         onClick={closeWindow}
//       >
//         <svg
//           aria-hidden="true"
//           role="img"
//           width="12"
//           height="12"
//           viewBox="0 0 12 12"
//         >
//           <polygon
//             fill="currentColor"
//             fillRule="evenodd"
//             points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
//           ></polygon>
//         </svg>
//       </button>
//     </div>
//   );
// }
