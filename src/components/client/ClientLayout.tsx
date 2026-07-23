"use client";

import React from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import Header from "../layout/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.18),_transparent_34%),linear-gradient(180deg,_#f7fbfb_0%,_#eef8f7_100%)]">
      <Header />
      <div className="flex min-h-screen pt-16">
        <ClientSidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
