import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/plans";
import { formatDate } from "@/lib/utils";
import BillingButton from "@/components/settings/BillingButton";
import { Check, Zap } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user!.id as string;

  const subscription = await db.subscription.findUnique({ where: { userId } });
  const currentPlan = (subscription?.plan || "FREE") as keyof typeof PLANS;
  const planData = PLANS[currentPlan];

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Settings</h1>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Name</label>
            <p className="text-slate-900">{session!.user!.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
            <p className="text-slate-900">{session!.user!.email}</p>
          </div>
        </div>
      </div>

      {/* Billing */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-slate-900">Billing & Plan</h2>
          <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
            {planData.name} Plan
          </span>
        </div>

        {currentPlan === "FREE" ? (
          <div>
            <p className="text-slate-500 text-sm mb-6">
              You&apos;re on the free plan. Upgrade to unlock AI generation, unlimited proposals, and more.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {(["PRO", "AGENCY"] as const).map((plan) => {
                const p = PLANS[plan];
                return (
                  <div
                    key={plan}
                    className={`rounded-xl border p-5 ${plan === "PRO" ? "border-indigo-300 bg-indigo-50" : "border-slate-200"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold text-slate-900">{p.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-3">
                      ${p.price}<span className="text-sm font-normal text-slate-400">/mo</span>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <BillingButton plan={plan} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl mb-4">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Active subscription</p>
                {subscription?.currentPeriodEnd && (
                  <p className="text-green-600 text-sm">
                    Renews {formatDate(subscription.currentPeriodEnd)}
                  </p>
                )}
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {planData.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500">
              To manage or cancel your subscription, contact support or visit the billing portal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
