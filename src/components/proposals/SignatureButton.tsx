"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export default function SignatureButton({
  proposalId,
  proposalToken,
}: {
  proposalId: string;
  proposalToken: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSign() {
    if (!name || !email) return;
    setLoading(true);

    const res = await fetch("/api/proposals/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId, token: proposalToken, signerName: name, signerEmail: email }),
    });

    if (res.ok) {
      setSigned(true);
    }
    setLoading(false);
  }

  if (signed) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <div>
          <p className="font-semibold text-green-800">Proposal accepted!</p>
          <p className="text-green-600 text-sm">Thank you, {name}. A confirmation has been sent to {email}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <button
        onClick={handleSign}
        disabled={loading || !name || !email}
        className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Accept & Sign Proposal
      </button>
      <p className="text-xs text-slate-400">
        Your electronic signature is legally binding. By clicking above you agree to the terms of this proposal.
      </p>
    </div>
  );
}
