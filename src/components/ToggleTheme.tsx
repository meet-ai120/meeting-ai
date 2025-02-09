import { Moon, Sun } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export default function ToggleTheme({ className }: { className?: string }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant={"ghost"}
      size="icon"
      className={`rounded-full ${className}`}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
