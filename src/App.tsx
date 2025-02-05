import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { syncThemeWithLocal } from "./helpers/theme_helpers";
import { useTranslation } from "react-i18next";
import "./localization/i18n";
import { updateAppLanguage } from "./helpers/language_helpers";
import { router } from "./routes/router";
import { RouterProvider } from "@tanstack/react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCurrentUser } from "./hooks/useCurrentUser";
import SignUp from "./pages/SignUp";
import { supabase } from "./lib/supabase";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queries";
import { useChat } from "ai/react";
import { AppProvider } from "./store/AppContext";

export default function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    // syncThemeWithLocal();
    updateAppLanguage(i18n);
  }, [i18n]);

  return <RouterProvider router={router} />;
}

const root = createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <App />
        </AppProvider>
      </QueryClientProvider>
    </TooltipProvider>
  </React.StrictMode>,
);
