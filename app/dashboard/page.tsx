import AuthGuard from "@/components/AuthGuard";
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardClient />
    </AuthGuard>
  );
}
