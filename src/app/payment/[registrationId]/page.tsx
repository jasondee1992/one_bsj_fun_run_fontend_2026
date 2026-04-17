import { SiteHeader } from "@/components/layout/SiteHeader";
import { PendingPaymentView } from "@/components/status/PendingPaymentView";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ registrationId: string }>;
}) {
  const { registrationId } = await params;

  return (
    <>
      <SiteHeader />
      <PendingPaymentView registrationId={registrationId} />
    </>
  );
}
