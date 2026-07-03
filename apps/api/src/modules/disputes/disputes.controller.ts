import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("disputes")
export class DisputesController {
  @Get("open")
  open() {
    return { module: "disputes", feature: "open", status: "mock" };
  }
  @Get("evidence")
  evidence() {
    return { module: "disputes", feature: "evidence", status: "mock" };
  }
  @Get("resolve")
  resolve() {
    return { module: "disputes", feature: "resolve", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
