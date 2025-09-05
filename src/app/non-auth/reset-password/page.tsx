// import ResetPasswordClient from "./ResetPasswordClient";

// export default function ResetPasswordPage() {
//   return <ResetPasswordClient />;
// }
"use client";

import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
