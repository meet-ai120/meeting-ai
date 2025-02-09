import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    electronAPI: {
      openExternal: (url: string) => Promise<void>;
    };
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (showOTP) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "signup",
        });
        if (error) throw error;
        navigate({ to: "/" });
      } else {
        // Try to sign in first
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // If user doesn't exist, try to sign up
        if (signInError?.message?.includes("Invalid login credentials")) {
          const { error: signUpError, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
            },
          });
          if (signUpError) throw signUpError;
          setShowOTP(true);
        } else if (signInError) {
          throw signInError;
        } else {
          navigate({ to: "/" });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          skipBrowserRedirect: false,
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {showOTP ? "Enter Verification Code" : "Sign In"}
          </CardTitle>
          <CardDescription>
            {showOTP
              ? "Enter the verification code sent to your email"
              : "Enter your email to sign in or create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && <div className="text-sm text-red-500">{error}</div>}
              {showOTP ? (
                <div className="grid gap-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter code"
                    required
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : showOTP ? "Verify" : "Continue"}
              </Button>
              {/* {!showOTP && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </Button>
              )} */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
