import { Body, Controller, Get, Param, Post } from "@nestjs/common";

const orders = [
  { id: "TRD-9021", status: "payment_pending", asset: "USDT", amount: 150 },
  { id: "TRD-9018", status: "marked_paid", asset: "USDT", amount: 75 }
];

@Controller("orders")
export class OrdersController {
  @Get()
  list() {
    return orders;
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return orders.find((order) => order.id === id) ?? null;
  }

  @Post(":id/mark-paid")
  markPaid(@Param("id") id: string) {
    return { id, status: "marked_paid", event: "Buyer marked payment as paid" };
  }

  @Post(":id/release/prepare")
  prepareRelease(@Param("id") id: string) {
    return { id, requires: ["totp", "wallet_signature"], warning: "Only release crypto after fiat payment is visible." };
  }

  @Post(":id/dispute")
  dispute(@Param("id") id: string, @Body() body: { reason?: string }) {
    return { id, disputeId: "DSP-MOCK", reason: body.reason ?? "Other" };
  }
}
