import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Users, FileText } from "lucide-react";

export default async function ClientsPage() {
  const session = await auth();
  const clients = await db.client.findMany({
    where: { userId: session!.user!.id as string },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { proposals: true } } },
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500 text-sm mt-0.5">{clients.length} total</p>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-16 text-center">
          <Users className="w-14 h-14 text-slate-200 mx-auto mb-4" />
          <h2 className="font-semibold text-slate-700 mb-2">No clients yet</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Clients are automatically added when you create a proposal with a client name.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
            {clients.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center">
                    {c.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{c.name}</div>
                    <div className="text-slate-400 text-xs">{c.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {c._count.proposals} proposal{c._count.proposals !== 1 ? "s" : ""}
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs">{formatDate(c.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
