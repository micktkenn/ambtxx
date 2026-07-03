import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get("profile")
  profile() {
    return { module: "users", feature: "profile", status: "mock" };
  }
  @Get("sessions")
  sessions() {
    return { module: "users", feature: "sessions", status: "mock" };
  }
  @Get("payment-methods")
  payment_methods() {
    return { module: "users", feature: "payment-methods", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
