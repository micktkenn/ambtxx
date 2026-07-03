import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("kyc")
export class KycController {
  @Get("session")
  session() {
    return { module: "kyc", feature: "session", status: "mock" };
  }
  @Get("webhook")
  webhook() {
    return { module: "kyc", feature: "webhook", status: "mock" };
  }
  @Get("status")
  status() {
    return { module: "kyc", feature: "status", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
