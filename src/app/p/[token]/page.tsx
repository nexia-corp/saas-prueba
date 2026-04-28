import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, CheckCircle, Calendar } from "lucide-react";
import SignatureButton from "@/components/proposals/SignatureButton";

async function trackView(proposalId: string) {
  await db.proposal.update({
    where: { id: proposalId },
    data: {
      viewCount: { increment: 1 },
      viewedAt: new Date(),
      status: "VIEWED",
    },
  });
}

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const proposal = await db.proposal.findUnique({
    where: { publicToken: token },
    include: { user: true, client: true },
  });

  if (!proposal) notFound();

  await trackView(proposal.id);

  const isAccepted = proposal.status === "ACCEPTED";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: proposal.user.primaryColor || "#6366f1" }}
            >
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">
              {proposal.user.businessName || proposal.user.name}
            </span>
          </div>
          {proposal.validUntil && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              Valid until {formatDate(proposal.validUntil)}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {isAccepted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-green-800 font-medium">
              This proposal has been accepted. {proposal.client?.name || "Client"} signed on{" "}
              {proposal.acceptedAt ? formatDate(proposal.acceptedAt) : "recently"}.
            </p>
          </div>
        )}

        {/* Proposal card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Proposal header */}
          <div
            className="px-10 py-10 text-white"
            style={{
              background: `linear-gradient(135deg, ${proposal.user.primaryColor || "#6366f1"}, ${proposal.user.primaryColor || "#6366f1"}cc)`,
            }}
          >
            <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
            {proposal.client && (
              <p className="text-white/80">
                Prepared for {proposal.client.name}
                {proposal.client.company ? ` · ${proposal.client.company}` : ""}
              </p>
            )}
            {proposal.amount && (
              <div className="mt-4 inline-block bg-white/20 rounded-xl px-4 py-2">
                <span className="text-white/80 text-sm">Investment: </span>
                <span className="font-bold text-lg">
                  {formatCurrency(proposal.amount, proposal.currency)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-10 py-8">
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
                {proposal.content}
              </div>
            </div>
          </div>

          {/* Signature section */}
          {!isAccepted && (
            <div className="px-10 py-8 border-t border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-900 text-xl mb-2">Accept this proposal</h2>
              <p className="text-slate-500 text-sm mb-6">
                By signing below, you agree to the terms and scope outlined in this proposal.
              </p>
              <SignatureButton proposalId={proposal.id} proposalToken={token} />
            </div>
          )}
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          Powered by ProposalKit · proposalkit.com
        </p>
      </div>
    </div>
  );
}
