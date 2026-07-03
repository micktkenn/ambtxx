import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("fees")
export class FeesController {
  @Get("rules")
  rules() {
    return { module: "fees", feature: "rules", status: "mock" };
  }
  @Get("transactions")
  transactions() {
    return { module: "fees", feature: "transactions", status: "mock" };
  }
  @Get("estimate")
  estimate() {
    return { module: "fees", feature: "estimate", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
