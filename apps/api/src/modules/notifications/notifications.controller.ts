import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("notifications")
export class NotificationsController {
  @Get("templates")
  templates() {
    return { module: "notifications", feature: "templates", status: "mock" };
  }
  @Get("test")
  test() {
    return { module: "notifications", feature: "test", status: "mock" };
  }
  @Get("logs")
  logs() {
    return { module: "notifications", feature: "logs", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
