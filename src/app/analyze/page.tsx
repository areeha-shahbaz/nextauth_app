import { redirect } from "next/navigation";
import { getUser } from "src/app/non-auth/session";

export default async function AnalyzePage() {
  const user = await getUser();

  if (!user || !user.hasPaid) {
    redirect("/payment");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Analyze Page</h1>
      <p>Welcome {user.name}! You have access to Image Analyzer.</p>
    </div>
  );
}
