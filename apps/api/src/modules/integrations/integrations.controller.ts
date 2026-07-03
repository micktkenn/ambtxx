import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("integrations")
export class IntegrationsController {
  @Get("status")
  status() {
    return { module: "integrations", feature: "status", status: "mock" };
  }
  @Get("test")
  test() {
    return { module: "integrations", feature: "test", status: "mock" };
  }
  @Get("webhooks")
  webhooks() {
    return { module: "integrations", feature: "webhooks", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
