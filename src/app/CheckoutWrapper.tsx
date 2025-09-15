// // "use client";

// // import { loadStripe } from "@stripe/stripe-js";
// // import { Elements } from "@stripe/react-stripe-js";
// // import CheckoutForm from "./CheckoutForm";

// // const stripePromise = loadStripe(
// //   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// // );

// // export default function CheckoutWrapper() {
// //   return (
// //     <Elements stripe={stripePromise}>
// //       <CheckoutForm />
// //     </Elements>
// //   );
// // }
// "use client";

// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import CheckoutForm from "./CheckoutForm";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// export default function CheckoutWrapper() {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm />
//     </Elements>
//   );
// }


"use client";

import CheckoutForm from "./CheckoutForm";

interface CheckoutWrapperProps {
  onPaymentSuccess: () => void;
}

export default function CheckoutWrapper({ onPaymentSuccess }: CheckoutWrapperProps) {
  return (
    <div className="w-full max-w-md p-6 border rounded shadow flex flex-col gap-4">
      <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
    </div>
  );
}
