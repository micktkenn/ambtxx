import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(24),
  password: z.string().min(10),
  country: z.string().min(2),
  acceptTerms: z.literal(true)
});

export const createAdSchema = z.object({
  side: z.enum(["buy", "sell"]),
  asset: z.string().min(2),
  fiat: z.string().min(2),
  priceType: z.enum(["fixed", "market_margin", "market_discount"]),
  price: z.coerce.number().positive(),
  minFiat: z.coerce.number().positive(),
  maxFiat: z.coerce.number().positive(),
  paymentMethods: z.array(z.string()).min(1),
  paymentWindowMinutes: z.coerce.number().min(5).max(120),
  terms: z.string().min(10).max(1000)
}).refine((data) => data.maxFiat >= data.minFiat, { message: "Maximum amount must be greater than minimum amount", path: ["maxFiat"] });

export const openDisputeSchema = z.object({
  reason: z.enum(["payment_not_received", "wrong_amount", "third_party_payment", "not_responding", "fraud_suspicion", "other"]),
  description: z.string().min(20).max(2000)
});

export const releaseCryptoSchema = z.object({
  orderId: z.string().min(1),
  paymentReceived: z.literal(true),
  authenticatorCode: z.string().regex(/^\d{6}$/),
  walletSignature: z.string().optional()
});

export const paymentMethodSchema = z.object({
  methodName: z.string().min(2),
  providerName: z.string().min(2),
  accountHolderName: z.string().min(2),
  accountIdentifier: z.string().min(4),
  fiat: z.string().min(2),
  instructions: z.string().max(500).optional()
});

export const adminDecisionSchema = z.object({
  note: z.string().min(10),
  decision: z.enum(["approve", "reject", "request_more_info", "escalate", "release_to_buyer", "refund_seller"])
});
