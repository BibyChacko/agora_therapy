"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const generalItems = [
  {
    name: "Dashboard",
    href: "/client",
    icon: LayoutDashboard,
  },
];

const therapyItems = [
  {
    name: "My Appointments",
    href: "/client/appointments",
    icon: Calendar,
  },
  {
    name: "Find Therapists",
    href: "/client/therapists",
    icon: Users,
  },
];

const billingItems = [
  {
    name: "Invoices",
    href: "/client/invoices",
    icon: FileText,
  },
];

const accountItems = [
  {
    name: "Settings",
    href: "/client/settings",
    icon: Settings,
  },
];

const mobileDockItems = [
  {
    name: "Home",
    href: "/client",
    icon: LayoutDashboard,
  },
  {
    name: "Sessions",
    href: "/client/appointments",
    icon: Calendar,
  },
  {
    name: "Therapists",
    href: "/client/therapists",
    icon: Users,
  },
  {
    name: "Invoices",
    href: "/client/invoices",
    icon: FileText,
  },
];

export function ClientSidebar() {
  const pathname = usePathname();
  const { user, userData, signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden w-[18rem] border-r border-teal-100 bg-white/95 shadow-2xl backdrop-blur transition-transform duration-200 ease-in-out lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:shadow-none"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="border-b border-teal-100 px-5 py-5">
            <Link href="/client">
              <div className="flex items-center gap-3 rounded-2xl bg-[linear-gradient(135deg,_#ecfeff_0%,_#f0fdfa_46%,_#fdf2f8_100%)] p-4 transition-transform hover:scale-[1.01]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-lg font-semibold text-white shadow-md">
                  {userData?.profile?.firstName?.[0] || "C"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {userData?.profile?.firstName || "Client"}{" "}
                    {userData?.profile?.lastName || ""}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-teal-700">
                    <Sparkles className="h-3 w-3" />
                    Care dashboard
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-5">
            {/* General Section */}
            <div className="mb-6">
              <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                General
              </h3>
              <ul className="space-y-1">
                {generalItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Therapy Section */}
            <div className="mb-6">
              <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Therapy
              </h3>
              <ul className="space-y-1">
                {therapyItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Billing Section */}
            <div className="mb-6">
              <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Billing
              </h3>
              <ul className="space-y-1">
                {billingItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Account Section */}
            <div>
              <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Account
              </h3>
              <ul className="space-y-1">
                {accountItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Sign Out */}
          <div className="border-t border-teal-100 p-4">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950 px-2 py-2 shadow-[0_-12px_32px_rgba(15,23,42,0.18)] lg:hidden">
        <ul className="grid grid-cols-4 items-center gap-1">
          {mobileDockItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-[1.4rem] px-2 py-2 text-[11px] font-medium transition-colors",
                    isActive
                      ? "bg-teal-500 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="mb-1 h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the home page and will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
