/**
 * Login Page
 * Unified auth page with sign-in and sign-up for booking and account access
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  getCurrentUserData,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/firebase/auth";
import { trackException, trackLogin, trackSignUp } from "@/lib/analytics/gtag";
import type { UserRole } from "@/types/database";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

type AuthTab = "signin" | "signup";

const PHONE_COUNTRIES = [
  { code: "AE", label: "UAE", dialCode: "+971", flag: "🇦🇪" },
  { code: "IN", label: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "SA", label: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "QA", label: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { code: "KW", label: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
  { code: "OM", label: "Oman", dialCode: "+968", flag: "🇴🇲" },
  { code: "BH", label: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
  { code: "US", label: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", label: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
] as const;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const roleFromUrl = searchParams.get("role") as UserRole | null;
  const redirectTo = searchParams.get("redirect") || "/";
  const initialTab =
    searchParams.get("mode") === "signup" || redirectTo === "/"
      ? "signup"
      : "signin";

  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    phoneCountry: "AE",
    role: (roleFromUrl || "client") as UserRole | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (roleFromUrl && (roleFromUrl === "client" || roleFromUrl === "therapist")) {
      setSignUpData((prev) => ({ ...prev, role: roleFromUrl }));
    }
  }, [roleFromUrl]);

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      if (user && !authLoading) {
        if (redirectTo && redirectTo !== "/") {
          router.push(redirectTo);
          return;
        }

        const userData = await getCurrentUserData();
        if (userData?.role === "client") {
          router.push("/client");
        } else if (userData?.role === "therapist") {
          router.push("/therapist");
        } else if (userData?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    };

    redirectBasedOnRole();
  }, [user, authLoading, redirectTo, router]);

  const clearStatus = () => {
    if (generalError) setGeneralError("");
    if (Object.keys(errors).length > 0) setErrors({});
  };

  const handleRoleSelect = (role: UserRole) => {
    clearStatus();
    setSignUpData((prev) => ({ ...prev, role }));
  };

  const handleClose = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(redirectTo && redirectTo !== "/" ? redirectTo : "/");
  };

  const getPostAuthDestination = (role?: UserRole | null) => {
    if (redirectTo && redirectTo !== "/") {
      return redirectTo;
    }

    if (role === "client") {
      return "/client";
    }

    if (role === "therapist") {
      return "/therapist";
    }

    if (role === "admin") {
      return "/admin";
    }

    return "/dashboard";
  };

  const validateSignInForm = () => {
    const newErrors: Record<string, string> = {};

    if (!signInData.email.trim()) {
      newErrors.signinEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) {
      newErrors.signinEmail = "Please enter a valid email address";
    }

    if (!signInData.password) {
      newErrors.signinPassword = "Password is required";
    } else if (signInData.password.length < 6) {
      newErrors.signinPassword = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUpForm = () => {
    const newErrors: Record<string, string> = {};

    if (!signUpData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!signUpData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!signUpData.email.trim()) {
      newErrors.signUpEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email)) {
      newErrors.signUpEmail = "Please enter a valid email address";
    }
    if (!signUpData.password) {
      newErrors.signUpPassword = "Password is required";
    } else if (signUpData.password.length < 6) {
      newErrors.signUpPassword = "Password must be at least 6 characters";
    }
    if (!signUpData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!signUpData.role) {
      newErrors.role = "Please select how you’ll use MindGood";
    }
    if (
      signUpData.phoneNumber &&
      !/^[\d\s-()]+$/.test(signUpData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectedPhoneCountry =
    PHONE_COUNTRIES.find((country) => country.code === signUpData.phoneCountry) ||
    PHONE_COUNTRIES[0];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateSignInForm()) return;

    setLoading(true);

    try {
      await signInWithEmail(signInData.email, signInData.password);

      setTimeout(async () => {
        const userData = await getCurrentUserData();
        trackLogin("email", userData?.role);
        window.location.href = getPostAuthDestination(userData?.role);
      }, 500);
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        trackException(error.message || "login_failed");
        if (error.message.includes("user-not-found")) {
          setGeneralError("No account found with this email address");
        } else if (error.message.includes("wrong-password")) {
          setGeneralError("Incorrect password");
        } else if (error.message.includes("invalid-credential")) {
          setGeneralError("Invalid email or password");
        } else {
          setGeneralError("Failed to sign in. Please try again.");
        }
      } else {
        setGeneralError("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateSignUpForm()) return;

    setLoading(true);

    try {
      await signUpWithEmail(signUpData.email, signUpData.password, {
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        role: signUpData.role as UserRole,
        phoneNumber: signUpData.phoneNumber
          ? `${selectedPhoneCountry.dialCode} ${signUpData.phoneNumber.trim()}`
          : undefined,
      });

      trackSignUp("email", signUpData.role);

      router.push(getPostAuthDestination(signUpData.role as UserRole));
    } catch (error: unknown) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        trackException(error.message || "sign_up_failed");
        if (error.message.includes("email-already-in-use")) {
          setGeneralError("An account with this email already exists");
        } else if (error.message.includes("weak-password")) {
          setGeneralError("Password is too weak. Please choose a stronger password.");
        } else {
          setGeneralError("Failed to create account. Please try again.");
        }
      } else {
        setGeneralError("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (mode: AuthTab) => {
    clearStatus();
    setLoading(true);

    try {
      const selectedRole =
        mode === "signup"
          ? ((signUpData.role || roleFromUrl || "client") as UserRole)
          : "client";

      await signInWithGoogle(selectedRole);

      setTimeout(async () => {
        const userData = await getCurrentUserData();

        if (mode === "signup") {
          trackSignUp("google", userData?.role || selectedRole);
        } else {
          trackLogin("google", userData?.role);
        }
        window.location.href = getPostAuthDestination(userData?.role || selectedRole);
      }, 500);
    } catch (error: unknown) {
      console.error("Google auth error:", error);
      if (error instanceof Error) {
        trackException(error.message || "google_auth_failed");
        if (error.message.includes("popup-closed-by-user")) {
          setGeneralError("Google sign-in was cancelled");
        } else if (error.message.includes("popup-blocked")) {
          setGeneralError("Your browser blocked the Google sign-in popup");
        } else if (error.message.includes("account-exists-with-different-credential")) {
          setGeneralError("This email already exists with another sign-in method. Please sign in with email and password.");
        } else {
          setGeneralError("Failed to sign in with Google. Please try again.");
        }
      } else {
        setGeneralError("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  const handleSignInChange = (field: "email" | "password", value: string) => {
    clearStatus();
    setSignInData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUpChange = (field: string, value: string) => {
    clearStatus();
    setSignUpData((prev) => ({ ...prev, [field]: value }));
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f3fbf9_0%,_#ffffff_48%,_#f8fcfb_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <section>
            <Card className="mx-auto w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
              <CardHeader className="space-y-4 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
                <div className="flex items-start justify-between gap-4">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-11 w-28">
                      <Image
                        src="/Mindgood.png"
                        alt="MindGood Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close and go back"
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-3xl font-semibold tracking-tight text-slate-950">
                    {activeTab === "signup" ? "Create your MindGood account" : "Sign in to continue"}
                  </CardTitle>
                  <CardDescription className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                    {activeTab === "signup"
                      ? "Start here if this is your first time."
                      : "Enter your details below to continue."}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-5 py-5 sm:px-8 sm:py-7">
                {generalError && (
                  <Alert variant="destructive" className="mb-5">
                    <AlertDescription>{generalError}</AlertDescription>
                  </Alert>
                )}

                <Tabs
                  value={activeTab}
                  onValueChange={(value) => {
                    clearStatus();
                    setActiveTab(value as AuthTab);
                  }}
                  className="space-y-6"
                >
                  <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl bg-teal-50 p-1">
                    <TabsTrigger
                      value="signin"
                      className="min-h-11 rounded-xl px-4 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="min-h-11 rounded-xl px-4 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
                    >
                      Create Account
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-slate-950">
                        Sign in
                      </h2>
                      <p className="text-sm leading-6 text-slate-600">
                        Sign in to continue with your appointments, messages, or booking.
                      </p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-5">
                      <Button
                        type="button"
                        variant="outline"
                        className="min-h-12 w-full rounded-xl border-slate-200 text-base font-semibold"
                        onClick={() => handleGoogleAuth("signin")}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                        )}
                        Continue with Google
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
                          <span className="bg-white px-3 text-slate-400">Or use email</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-4 w-4 text-teal-500" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signInData.email}
                            onChange={(e) =>
                              handleSignInChange("email", e.target.value)
                            }
                            className={`min-h-12 rounded-xl border-slate-200 pl-10 focus-visible:border-teal-500 focus-visible:ring-teal-500/20 ${
                              errors.signinEmail ? "border-red-500" : ""
                            }`}
                            disabled={loading}
                          />
                        </div>
                        {errors.signinEmail && (
                          <p className="text-sm text-red-500">{errors.signinEmail}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-teal-500" />
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={signInData.password}
                            onChange={(e) =>
                              handleSignInChange("password", e.target.value)
                            }
                            className={`min-h-12 rounded-xl border-slate-200 pl-10 pr-10 focus-visible:border-teal-500 focus-visible:ring-teal-500/20 ${
                              errors.signinPassword ? "border-red-500" : ""
                            }`}
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 transition-colors hover:text-teal-700"
                            disabled={loading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {errors.signinPassword && (
                          <p className="text-sm text-red-500">{errors.signinPassword}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href="/forgot-password"
                          className="text-sm font-medium text-teal-700 hover:text-teal-800 hover:underline"
                        >
                          Forgot password?
                        </Link>
                        {redirectTo !== "/" && (
                          <p className="text-xs text-slate-500">
                            You&apos;ll return to your booking
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="min-h-12 w-full rounded-xl bg-teal-600 text-base font-semibold text-white hover:bg-teal-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <p className="text-center text-sm text-slate-600">
                        New user?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            clearStatus();
                            setActiveTab("signup");
                          }}
                          className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                        >
                          Sign up
                        </button>
                      </p>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-slate-950">
                        Create your account
                      </h2>
                      <p className="text-sm leading-6 text-slate-600">
                        Fill in the details below and continue in one step.
                      </p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-5">
                      <div className="space-y-3">
                        <Label>How will you use MindGood?</Label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => handleRoleSelect("client")}
                            className={`min-h-24 rounded-2xl border p-4 text-left transition-all ${
                              signUpData.role === "client"
                                ? "border-teal-500 bg-teal-50 shadow-sm"
                                : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50"
                            }`}
                          >
                            <Users className="mb-3 h-5 w-5 text-teal-600" />
                            <p className="font-semibold text-slate-900">I’m looking for therapy</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              Book a psychologist, manage sessions, and continue care.
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRoleSelect("therapist")}
                            className={`min-h-24 rounded-2xl border p-4 text-left transition-all ${
                              signUpData.role === "therapist"
                                ? "border-teal-500 bg-teal-50 shadow-sm"
                                : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50"
                            }`}
                          >
                            <Stethoscope className="mb-3 h-5 w-5 text-teal-600" />
                            <p className="font-semibold text-slate-900">I’m a therapist</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              Join the platform, complete onboarding, and start offering care.
                            </p>
                          </button>
                        </div>
                        {errors.role && (
                          <p className="text-sm text-red-500">{errors.role}</p>
                        )}
                      </div>

                      {signUpData.role && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            className="min-h-12 w-full rounded-xl border-slate-200 text-base font-semibold"
                            onClick={() => handleGoogleAuth("signup")}
                            disabled={loading}
                          >
                            {loading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                  fill="#4285F4"
                                />
                                <path
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                  fill="#34A853"
                                />
                                <path
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                  fill="#FBBC05"
                                />
                                <path
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                  fill="#EA4335"
                                />
                              </svg>
                            )}
                            Continue with Google
                          </Button>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
                              <span className="bg-white px-3 text-slate-400">Or create with email</span>
                            </div>
                          </div>
                        </>
                      )}

                      {signUpData.role && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input
                            id="first-name"
                            value={signUpData.firstName}
                            onChange={(e) =>
                              handleSignUpChange("firstName", e.target.value)
                            }
                            className={`min-h-12 rounded-xl ${
                              errors.firstName ? "border-red-500" : ""
                            }`}
                            disabled={loading}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-500">{errors.firstName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input
                            id="last-name"
                            value={signUpData.lastName}
                            onChange={(e) =>
                              handleSignUpChange("lastName", e.target.value)
                            }
                            className={`min-h-12 rounded-xl ${
                              errors.lastName ? "border-red-500" : ""
                            }`}
                            disabled={loading}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-500">{errors.lastName}</p>
                          )}
                        </div>
                      </div>
                      )}

                      {signUpData.role && (
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-4 w-4 text-teal-500" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signUpData.email}
                            onChange={(e) =>
                              handleSignUpChange("email", e.target.value)
                            }
                            className={`min-h-12 rounded-xl border-slate-200 pl-10 focus-visible:border-teal-500 focus-visible:ring-teal-500/20 ${
                              errors.signUpEmail ? "border-red-500" : ""
                            }`}
                            disabled={loading}
                          />
                        </div>
                        {errors.signUpEmail && (
                          <p className="text-sm text-red-500">{errors.signUpEmail}</p>
                        )}
                      </div>
                      )}

                      {signUpData.role && (
                      <div className="space-y-2">
                        <Label htmlFor="phone-number">Phone number</Label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
                          <Select
                            value={signUpData.phoneCountry}
                            onValueChange={(value) =>
                              handleSignUpChange("phoneCountry", value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger className="min-h-12 rounded-xl border-slate-200 focus:ring-teal-500/20">
                              <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {PHONE_COUNTRIES.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.flag} {country.label} {country.dialCode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="relative">
                            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-teal-500" />
                            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                              {selectedPhoneCountry.dialCode}
                            </span>
                            <div className="pointer-events-none absolute left-[5.6rem] top-3 h-6 w-px bg-slate-200" />
                            <Input
                              id="phone-number"
                              placeholder="Phone number"
                              value={signUpData.phoneNumber}
                              onChange={(e) =>
                                handleSignUpChange("phoneNumber", e.target.value)
                              }
                              className={`min-h-12 rounded-xl border-slate-200 pl-[6.4rem] focus-visible:border-teal-500 focus-visible:ring-teal-500/20 ${
                                errors.phoneNumber ? "border-red-500" : ""
                              }`}
                              disabled={loading}
                              inputMode="tel"
                            />
                          </div>
                        </div>
                        {errors.phoneNumber && (
                          <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                        )}
                      </div>
                      )}

                      {signUpData.role && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-teal-500" />
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              value={signUpData.password}
                              onChange={(e) =>
                                handleSignUpChange("password", e.target.value)
                              }
                              className={`min-h-12 rounded-xl border-slate-200 pl-10 focus-visible:border-teal-500 focus-visible:ring-teal-500/20 ${
                                errors.signUpPassword ? "border-red-500" : ""
                              }`}
                              disabled={loading}
                            />
                          </div>
                          {errors.signUpPassword && (
                            <p className="text-sm text-red-500">{errors.signUpPassword}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-teal-500" />
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Repeat password"
                              value={signUpData.confirmPassword}
                              onChange={(e) =>
                                handleSignUpChange("confirmPassword", e.target.value)
                              }
                              className={`min-h-12 rounded-xl border-slate-200 pl-10 pr-10 focus-visible:border-teal-500 focus-visible:ring-teal-500/20 ${
                                errors.confirmPassword ? "border-red-500" : ""
                              }`}
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-3 text-slate-400 transition-colors hover:text-teal-700"
                              disabled={loading}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                      )}

                      {signUpData.role && (
                        <Button
                          type="submit"
                          className="min-h-12 w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-base font-semibold text-white hover:opacity-90"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              Create Account
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
