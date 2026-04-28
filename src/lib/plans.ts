export const PLANS = {
  FREE: {
    name: "Starter",
    proposals: 3,
    price: 0,
    priceId: null,
    features: [
      "3 proposals/month",
      "Basic templates",
      "PDF export",
      "Email delivery",
    ],
  },
  PRO: {
    name: "Pro",
    proposals: -1,
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    features: [
      "Unlimited proposals",
      "AI proposal generation",
      "E-signature",
      "Auto follow-up",
      "View tracking",
      "Custom branding",
    ],
  },
  AGENCY: {
    name: "Agency",
    proposals: -1,
    price: 79,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID ?? null,
    features: [
      "Everything in Pro",
      "5 team seats",
      "White-label client portal",
      "Priority support",
      "API access",
    ],
  },
} as const;
