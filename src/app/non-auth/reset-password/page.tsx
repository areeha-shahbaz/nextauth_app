
import dynamic from "next/dynamic";

const ResetPasswordClient = dynamic(
  () => import("./ResetPassword"),
  { ssr: false } 
);

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}

