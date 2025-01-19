import { LoginForm } from "@/components/LoginForm";
import React from "react";
import { useTranslation } from "react-i18next";

export default function SignUp() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}
