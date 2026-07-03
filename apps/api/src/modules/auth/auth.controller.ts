import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  @Get("login")
  login() {
    return { module: "auth", feature: "login", status: "mock" };
  }
  @Get("register")
  register() {
    return { module: "auth", feature: "register", status: "mock" };
  }
  @Get("verify-2fa")
  verify_2fa() {
    return { module: "auth", feature: "verify-2fa", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
