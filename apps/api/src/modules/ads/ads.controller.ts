import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("ads")
export class AdsController {
  @Get("create")
  create() {
    return { module: "ads", feature: "create", status: "mock" };
  }
  @Get("pause")
  pause() {
    return { module: "ads", feature: "pause", status: "mock" };
  }
  @Get("resume")
  resume() {
    return { module: "ads", feature: "resume", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
