"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { trackServiceClick } from "@/lib/analytics/gtag";

interface TrackedServicesLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  serviceId?: string;
  serviceName?: string;
  therapistId?: string;
  therapistName?: string;
  query?: string;
  clickTarget:
    | "service_specialists_cta"
    | "related_therapist"
    | "featured_topic"
    | "empty_state"
    | "bottom_cta";
}

export function TrackedServicesLink({
  href,
  children,
  className,
  serviceId,
  serviceName,
  therapistId,
  therapistName,
  query,
  clickTarget,
}: TrackedServicesLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackServiceClick({
          service_id: serviceId,
          service_name: serviceName,
          therapist_id: therapistId,
          therapist_name: therapistName,
          query,
          click_target: clickTarget,
        })
      }
    >
      {children}
    </Link>
  );
}

