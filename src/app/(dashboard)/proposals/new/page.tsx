"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2, ArrowLeft, Sparkles } from "lucide-react";

const PROJECT_TYPES = [
  "Web Design & Development",
  "Mobile App Development",
  "Branding & Identity",
  "SEO & Digital Marketing",
  "Content Writing",
  "UI/UX Design",
  "E-commerce Development",
  "Social Media Management",
  "Video Production",
  "Consulting",
  "Other",
];

export default function NewProposalPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const [form, setForm] = useState({
    title: "",
    clientName: "",
    clientEmail: "",
    projectType: PROJECT_TYPES[0],
    budget: "",
    currency: "USD",
    description: "",
    content: "",
    validDays: "30",
  });

  async function generateWithAI() {
    if (!form.clientName || !form.projectType || !form.budget) return;
    setAiGenerating(true);

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: form.clientName,
        projectType: form.projectType,
        budget: form.budget,
        currency: form.currency,
        description: form.description,
      }),
    });

    const data = await res.json();
    if (data.content) {
      setGeneratedContent(data.content);
      setForm((f) => ({
        ...f,
        content: data.content,
        title: data.title || `${form.projectType} Proposal — ${form.clientName}`,
      }));
    }
    setAiGenerating(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`/proposals/${data.id}`);
    } else {
      alert(data.error || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/proposals" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Proposal</h1>
          <p className="text-slate-500 text-sm mt-0.5">Generate with AI or write manually</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setMode("ai")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            mode === "ai"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Zap className="w-4 h-4" />
          AI Generation
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            mode === "manual"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Manual
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Client info */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Client Info</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Client name *</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="Acme Corporation"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Client email</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                placeholder="client@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Project info */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Project Info</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Project type *</label>
              <select
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Budget *</label>
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="5000"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>CAD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {mode === "ai" && (
          <div className="bg-white rounded-xl border border-slate-100 p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-4">Project Description (optional)</h2>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add any specific details about the project scope, requirements, or key deliverables..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <button
              type="button"
              onClick={generateWithAI}
              disabled={aiGenerating || !form.clientName || !form.budget}
              className="mt-4 flex items-center gap-2 bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate proposal with AI
                </>
              )}
            </button>
          </div>
        )}

        {/* Proposal content */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Proposal Title & Content</h2>
            {generatedContent && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                ✓ AI generated
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Web Design Proposal — Acme Corp"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Content *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder={mode === "ai" ? "Generate with AI above, or write your proposal here..." : "Write your proposal content here..."}
              rows={12}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/proposals" className="text-sm text-slate-500 hover:text-slate-700">
            Cancel
          </Link>
          <div className="flex gap-3">
            <button
              type="submit"
              name="action"
              value="draft"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Save as draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create & send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
