import AuthGuard from "@/components/AuthGuard";
import GeneratorClient from "./GeneratorClient";

export default function GeneratorPage() {
  return (
    <AuthGuard>
      <GeneratorClient />
    </AuthGuard>
  );
}
