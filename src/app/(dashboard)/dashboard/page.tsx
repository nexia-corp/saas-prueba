import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { FileText, TrendingUp, DollarSign, CheckCircle, Plus, ArrowRight } from "lucide-react";

async function getDashboardData(userId: string) {
  const [proposals, totalProposals] = await Promise.all([
    db.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { client: true },
    }),
    db.proposal.count({ where: { userId } }),
  ]);

  const accepted = await db.proposal.count({ where: { userId, status: "ACCEPTED" } });
  const sent = await db.proposal.count({ where: { userId, status: { not: "DRAFT" } } });
  const wonRevenue = await db.proposal.aggregate({
    where: { userId, status: "ACCEPTED" },
    _sum: { amount: true },
  });

  return {
    proposals,
    totalProposals,
    closeRate: sent > 0 ? Math.round((accepted / sent) * 100) : 0,
    wonRevenue: wonRevenue._sum.amount || 0,
    acceptedCount: accepted,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData(session!.user!.id as string);

  const stats = [
    {
      label: "Total proposals",
      value: data.totalProposals,
      icon: FileText,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Close rate",
      value: `${data.closeRate}%`,
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Revenue won",
      value: formatCurrency(data.wonRevenue),
      icon: DollarSign,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Accepted",
      value: data.acceptedCount,
      icon: CheckCircle,
      color: "text-violet-600 bg-violet-50",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back, {session!.user!.name}</p>
        </div>
        <Link
          href="/proposals/new"
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-slate-500 text-sm mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent proposals */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Proposals</h2>
          <Link href="/proposals" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data.proposals.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="font-medium text-slate-700 mb-1">No proposals yet</h3>
            <p className="text-slate-400 text-sm mb-4">Create your first proposal and start closing deals.</p>
            <Link
              href="/proposals/new"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create proposal
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {data.proposals.map((p) => (
              <Link
                key={p.id}
                href={`/proposals/${p.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm truncate">{p.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    {p.client?.name || "No client"} · {formatDate(p.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  {p.amount && (
                    <span className="font-semibold text-slate-700 text-sm">
                      {formatCurrency(p.amount, p.currency)}
                    </span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(p.status)}`}>
                    {getStatusLabel(p.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
