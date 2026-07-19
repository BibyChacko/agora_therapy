"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientLayout } from "@/components/client/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Video, 
  Calendar, 
  Clock, 
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { AppointmentService } from "@/lib/services/appointment-service";
import { Appointment } from "@/types/database";
import { useToast } from "@/lib/hooks/useToast";

export default function SessionsPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      router.replace("/client/appointments");
    }
  }, [router, user?.uid]);

  return (
    <ClientLayout>
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    </ClientLayout>
  );
}
