import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Plus, FileText, Eye, Filter } from "lucide-react";

export default async function ProposalsPage() {
  const session = await auth();
  const proposals = await db.proposal.findMany({
    where: { userId: session!.user!.id as string },
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proposals</h1>
          <p className="text-slate-500 text-sm mt-0.5">{proposals.length} total</p>
        </div>
        <Link
          href="/proposals/new"
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </Link>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-16 text-center">
          <FileText className="w-14 h-14 text-slate-200 mx-auto mb-4" />
          <h2 className="font-semibold text-slate-700 mb-2">No proposals yet</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Create your first AI-generated proposal and start closing deals faster.
          </p>
          <Link
            href="/proposals/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create first proposal
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">All proposals</span>
          </div>
          <div className="divide-y divide-slate-50">
            {proposals.map((p) => (
              <Link
                key={p.id}
                href={`/proposals/${p.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                    {p.title}
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5 flex items-center gap-3">
                    <span>{p.client?.name || "No client"}</span>
                    <span>·</span>
                    <span>{formatDate(p.createdAt)}</span>
                    {p.viewCount > 0 && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {p.viewCount} views
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4 shrink-0">
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
        </div>
      )}
    </div>
  );
}
