"use client";

import dynamic from "next/dynamic";
import { useRequireAuth } from "../../../authCondition";

const AdminPage = dynamic(() => import("src/app/components/admin"), { ssr: false });

export default function Admin() {
  useRequireAuth(); 
  return <AdminPage />;
}
