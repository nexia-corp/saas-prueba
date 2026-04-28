"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap,
  FileText,
  Eye,
  PenLine,
  Bell,
  TrendingUp,
  Check,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marcus Chen",
    role: "Freelance Web Developer",
    avatar: "MC",
    text: "I used to spend 3 hours on every proposal. Now I generate them in 30 seconds and my close rate went from 22% to 41%. ProposalKit paid for itself in the first week.",
    stars: 5,
  },
  {
    name: "Sofia Herrera",
    role: "Brand Consultant",
    avatar: "SH",
    text: "The auto follow-up feature alone is worth it. I used to forget to chase clients. Now ProposalKit does it for me and I closed 2 deals I would have lost.",
    stars: 5,
  },
  {
    name: "James O'Brien",
    role: "Marketing Agency Owner",
    avatar: "JO",
    text: "We onboarded the whole team in 10 minutes. Our proposals look 10x more professional and clients consistently comment on how polished they are.",
    stars: 5,
  },
];

const FAQS = [
  {
    q: "How does the AI proposal generation work?",
    a: "You enter the client name, project type, and budget. Our AI writes a complete, professional proposal in under 30 seconds — including scope of work, timeline, pricing, and terms. You can edit anything before sending.",
  },
  {
    q: "Can I use my own branding?",
    a: "Yes. On the Pro and Agency plans you can add your logo, choose your brand colors, and customize the proposal template to match your business identity.",
  },
  {
    q: "How does e-signature work?",
    a: "Clients receive a link to view and sign your proposal digitally. You get notified instantly when they sign. All signatures are legally binding in the US and EU.",
  },
  {
    q: "What is the auto follow-up feature?",
    a: "If a client hasn't responded within 3 days of opening your proposal, ProposalKit automatically sends a friendly follow-up email. You set the template once, it runs forever.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. No contracts, no lock-in. Cancel from your account settings and you'll keep access until the end of your billing period.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-slate-900 hover:bg-slate-50 transition-colors"
      >
        {q}
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="font-[var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">ProposalKit</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-slate-900 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI-powered proposals in 30 seconds
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Win more clients with{" "}
            <span className="text-indigo-600">proposals that close</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            ProposalKit uses AI to generate professional proposals in 30 seconds.
            Know when clients view them, collect e-signatures, and automate follow-ups.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-indigo-200"
            >
              Start free — no credit card
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border border-slate-200 text-slate-700 font-medium px-8 py-4 rounded-xl hover:bg-slate-50 transition-colors text-lg"
            >
              Sign in →
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            Free plan includes 3 proposals/month · No credit card required
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 bg-slate-700 rounded h-5 flex items-center px-3">
                <span className="text-slate-400 text-xs">app.proposalkit.com/dashboard</span>
              </div>
            </div>
            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Proposals sent", value: "12", trend: "+3 this week" },
                  { label: "Close rate", value: "41%", trend: "+18% vs last month" },
                  { label: "Revenue won", value: "$24,800", trend: "+$8,200 this month" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-xs mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-green-600 text-xs mt-1">{stat.trend}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-sm">Recent Proposals</span>
                  <span className="text-indigo-600 text-xs cursor-pointer">View all</span>
                </div>
                {[
                  { name: "Website Redesign — Acme Corp", amount: "$4,800", status: "VIEWED", time: "2h ago" },
                  { name: "SEO Campaign — TechStart", amount: "$2,200", status: "ACCEPTED", time: "Yesterday" },
                  { name: "Brand Identity — Bloom Co", amount: "$3,500", status: "SENT", time: "3 days ago" },
                ].map((p) => (
                  <div key={p.name} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{p.name}</div>
                      <div className="text-slate-400 text-xs">{p.time}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-700 text-sm">{p.amount}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                        p.status === "VIEWED" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {p.status === "ACCEPTED" ? "✓ Accepted" : p.status === "VIEWED" ? "👁 Viewed" : "→ Sent"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-10 border-y border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm mb-6">Trusted by freelancers and agencies worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["2,400+ freelancers", "94% customer satisfaction", "$12M+ in proposals sent", "4.9★ on Product Hunt"].map((item) => (
              <div key={item} className="text-slate-500 text-sm font-medium">{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need to close deals faster
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Stop losing clients to slow proposals and forgotten follow-ups.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                color: "bg-indigo-100 text-indigo-600",
                title: "AI Proposal Generation",
                desc: "Describe the project in 3 fields. Our AI writes a complete, professional proposal — including scope, timeline, and terms — in under 30 seconds.",
              },
              {
                icon: Eye,
                color: "bg-blue-100 text-blue-600",
                title: "Real-time View Tracking",
                desc: "Get notified the moment your client opens your proposal. See how many times they viewed it — know the perfect moment to follow up.",
              },
              {
                icon: PenLine,
                color: "bg-violet-100 text-violet-600",
                title: "E-Signature Built-in",
                desc: "Clients sign directly in their browser — no accounts needed. Legally binding in 40+ countries. Get the signed copy in your inbox instantly.",
              },
              {
                icon: Bell,
                color: "bg-amber-100 text-amber-600",
                title: "Automated Follow-ups",
                desc: "If a client hasn't responded in 3 days, ProposalKit sends a personalized follow-up on your behalf — in your tone, with your name.",
              },
              {
                icon: FileText,
                color: "bg-green-100 text-green-600",
                title: "Professional Templates",
                desc: "Start from 20+ battle-tested templates built to convert. Customize with your brand colors and logo for every proposal.",
              },
              {
                icon: TrendingUp,
                color: "bg-pink-100 text-pink-600",
                title: "Pipeline & Analytics",
                desc: "Track every proposal from sent to signed. See your close rate, average deal size, and time-to-close. Know where to improve.",
              },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">From idea to signed deal in minutes</h2>
          <p className="text-lg text-slate-500 mb-16">3 steps is all it takes.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Describe the project", desc: "Enter the client name, project type, and budget. Takes 30 seconds." },
              { step: "2", title: "AI writes the proposal", desc: "Get a complete, professional proposal you can review and customize before sending." },
              { step: "3", title: "Client signs, you get paid", desc: "Share a link. Client views, signs, and you get notified in real time." },
            ].map((s) => (
              <div key={s.step}>
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Freelancers love ProposalKit</h2>
            <p className="text-slate-500">Real results from real freelancers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, honest pricing</h2>
            <p className="text-slate-500">Start free. Upgrade when you are ready to close more deals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {[
              {
                plan: "Starter",
                price: "$0",
                period: "forever free",
                desc: "For freelancers just getting started",
                features: ["3 proposals/month", "Basic templates", "PDF export", "Email delivery"],
                cta: "Start free",
                href: "/register",
                highlight: false,
              },
              {
                plan: "Pro",
                price: "$29",
                period: "per month",
                desc: "For freelancers who want to close more deals",
                features: [
                  "Unlimited proposals",
                  "AI proposal generation",
                  "E-signature",
                  "Auto follow-up",
                  "Real-time view tracking",
                  "Custom branding",
                ],
                cta: "Start 14-day free trial",
                href: "/register?plan=pro",
                highlight: true,
              },
              {
                plan: "Agency",
                price: "$79",
                period: "per month",
                desc: "For agencies with multiple team members",
                features: [
                  "Everything in Pro",
                  "5 team seats",
                  "White-label portal",
                  "Team analytics",
                  "Priority support",
                  "API access",
                ],
                cta: "Start 14-day free trial",
                href: "/register?plan=agency",
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.plan}
                className={`rounded-2xl p-8 border ${
                  p.highlight
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 md:-mt-4"
                    : "bg-white border-slate-200"
                }`}
              >
                {p.highlight && (
                  <div className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <div className={`text-sm font-medium mb-2 ${p.highlight ? "text-indigo-200" : "text-slate-500"}`}>
                  {p.plan}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-4xl font-bold ${p.highlight ? "text-white" : "text-slate-900"}`}>
                    {p.price}
                  </span>
                  <span className={`text-sm mb-1 ${p.highlight ? "text-indigo-200" : "text-slate-400"}`}>
                    /{p.period}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${p.highlight ? "text-indigo-200" : "text-slate-500"}`}>{p.desc}</p>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 shrink-0 ${p.highlight ? "text-indigo-200" : "text-indigo-500"}`} />
                      <span className={p.highlight ? "text-indigo-100" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`block text-center font-semibold py-3 rounded-xl transition-colors ${
                    p.highlight
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">
            All plans include a 14-day free trial · Cancel anytime · No credit card for Starter
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start closing more deals today
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Join 2,400+ freelancers who use ProposalKit to win better clients, faster.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors text-lg shadow-lg"
          >
            Start free — no credit card
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-indigo-300 text-sm mt-4">Free plan available forever · Setup in 2 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900">ProposalKit</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/login" className="hover:text-slate-800">Sign in</Link>
            <Link href="/register" className="hover:text-slate-800">Sign up</Link>
            <a href="#pricing" className="hover:text-slate-800">Pricing</a>
            <a href="#faq" className="hover:text-slate-800">FAQ</a>
          </div>
          <p className="text-sm text-slate-400">2026 ProposalKit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
