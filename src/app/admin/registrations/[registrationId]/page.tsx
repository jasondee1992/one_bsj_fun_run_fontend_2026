import { AdminRegistrationDetailView } from "@/components/admin/AdminRegistrationDetailView";

export default async function AdminRegistrationDetailPage({
  params,
}: {
  params: Promise<{ registrationId: string }>;
}) {
  const { registrationId } = await params;

  return <AdminRegistrationDetailView registrationId={registrationId} />;
}
