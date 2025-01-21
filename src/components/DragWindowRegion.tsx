import {
  closeWindow,
  maximizeWindow,
  minimizeWindow,
} from "@/helpers/window_helpers";
import React, { type ReactNode } from "react";
import { Button } from "./ui/button";

import { toggleTheme } from "@/helpers/theme_helpers";
import { Input } from "./ui/input";
import { Moon, Search, Sun } from "lucide-react";
import { UserNav } from "./UserNav";

interface DragWindowRegionProps {
  title?: ReactNode;
}

export default function DragWindowRegion({ title }: DragWindowRegionProps) {
  return (
    <div className="draglayer flex w-screen items-center items-stretch justify-between p-2 pr-4">
      <div className="flex-1">
        {/* Meeting AI */}
        {/* You can add a logo or site title here */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="no-drag relative">
          <Input
            type="search"
            placeholder="Search..."
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
            className="pr-8"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <UserNav />
      </div>
    </div>
  );
}

function WindowButtons() {
  return (
    <div className="flex">
      <button
        title="Minimize"
        type="button"
        className="p-2 hover:bg-slate-300"
        onClick={minimizeWindow}
      >
        <svg
          aria-hidden="true"
          role="img"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <rect fill="currentColor" width="10" height="1" x="1" y="6"></rect>
        </svg>
      </button>
      <button
        title="Maximize"
        type="button"
        className="p-2 hover:bg-slate-300"
        onClick={maximizeWindow}
      >
        <svg
          aria-hidden="true"
          role="img"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <rect
            width="9"
            height="9"
            x="1.5"
            y="1.5"
            fill="none"
            stroke="currentColor"
          ></rect>
        </svg>
      </button>
      <button
        type="button"
        title="Close"
        className="p-2 hover:bg-red-300"
        onClick={closeWindow}
      >
        <svg
          aria-hidden="true"
          role="img"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <polygon
            fill="currentColor"
            fillRule="evenodd"
            points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
          ></polygon>
        </svg>
      </button>
    </div>
  );
}
