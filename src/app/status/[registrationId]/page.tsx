import { SiteHeader } from "@/components/layout/SiteHeader";
import { RegistrationStatusView } from "@/components/status/RegistrationStatusView";

export default async function StatusPage({
  params,
}: {
  params: Promise<{ registrationId: string }>;
}) {
  const { registrationId } = await params;

  return (
    <>
      <SiteHeader />
      <RegistrationStatusView registrationId={registrationId} />
    </>
  );
}
