// import ResetPasswordClient from "./ResetPasswordClient";

// export default function ResetPasswordPage() {
//   return <ResetPasswordClient />;
// }
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ResetPasswordClient = dynamic(
  () => import("./ResetPasswordClient"),
  { ssr: false } 
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
