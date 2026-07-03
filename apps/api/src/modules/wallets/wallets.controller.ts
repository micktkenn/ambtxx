import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("wallet")
export class WalletsController {
  @Get("connect")
  connect() {
    return { module: "wallets", feature: "connect", status: "mock" };
  }
  @Get("balances")
  balances() {
    return { module: "wallets", feature: "balances", status: "mock" };
  }
  @Get("signature-challenge")
  signature_challenge() {
    return { module: "wallets", feature: "signature-challenge", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
