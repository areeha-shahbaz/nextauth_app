import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Your payment is confirmed. You now have full access to{" "}
          <span className="font-semibold">Image Analyzer</span>.
        </p>
        <Link
          href="/analyze"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Go to Analyze Page
        </Link>
      </div>
    </div>
  );
}
