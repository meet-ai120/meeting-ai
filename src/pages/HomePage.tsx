import React, { useEffect, useState } from "react";
import ToggleTheme from "@/components/ToggleTheme";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/LangToggle";
import { supabase } from "@/lib/supabase";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useCurrentUser();

  const isSignedIn = user !== null;

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-bold">{t("title")}</h1>

        {isSignedIn ? (
          <div className="flex flex-col items-center justify-center gap-2">
            User: {user?.email}
            <Button onClick={() => supabase.auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <Link to="/signup">Sign Up</Link>
        )}
      </div>
    </>
  );
}
