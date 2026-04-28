"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function BillingButton({ plan }: { plan: "PRO" | "AGENCY" }) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      Upgrade to {plan === "PRO" ? "Pro" : "Agency"}
    </button>
  );
}
