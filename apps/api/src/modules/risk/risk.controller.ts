import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("risk")
export class RiskController {
  @Get("rules")
  rules() {
    return { module: "risk", feature: "rules", status: "mock" };
  }
  @Get("flags")
  flags() {
    return { module: "risk", feature: "flags", status: "mock" };
  }
  @Get("review")
  review() {
    return { module: "risk", feature: "review", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
