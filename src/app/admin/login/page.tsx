import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="flex min-h-dvh items-center justify-center bg-admin-bg px-4">
      <LoginForm next={params.next} configError={params.error === "not-configured"} />
    </div>
  );
}
