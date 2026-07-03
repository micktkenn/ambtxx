import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("audit-logs")
export class AuditController {
  @Get()
  list() {
    return [{ module: "audit", action: "read", status: "mock" }];
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
