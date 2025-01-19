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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (!showOTP) {
          const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
            },
          });
          if (error) throw error;
          setShowOTP(true);
        } else {
          const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: "signup",
          });
          if (error) throw error;
          navigate({ to: "/" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate({ to: "/" });
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
            {showOTP
              ? "Enter Verification Code"
              : isSignUp
                ? "Sign Up"
                : "Login"}
          </CardTitle>
          <CardDescription>
            {showOTP
              ? "Enter the verification code sent to your email"
              : isSignUp
                ? "Enter your email below to create your account"
                : "Enter your email below to login to your account"}
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
                    {/* <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div> */}
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Loading..."
                  : showOTP
                    ? "Verify"
                    : isSignUp
                      ? "Sign Up"
                      : "Login"}
              </Button>
              {!showOTP && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  {isSignUp ? "Sign Up" : "Login"} with Google
                </Button>
              )}
            </div>
            {!showOTP && (
              <div className="mt-4 text-center text-sm">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => {
                    setError(null);
                    setIsSignUp(!isSignUp);
                  }}
                >
                  {isSignUp ? "Login" : "Sign up"}
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
