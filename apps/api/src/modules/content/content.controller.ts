import { Controller, Get, Post, Body, Param } from "@nestjs/common";

@Controller("content")
export class ContentController {
  @Get("banners")
  banners() {
    return { module: "content", feature: "banners", status: "mock" };
  }
  @Get("faq")
  faq() {
    return { module: "content", feature: "faq", status: "mock" };
  }
  @Get("publish")
  publish() {
    return { module: "content", feature: "publish", status: "mock" };
  }

  @Post(":id/action")
  action(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return { id, received: body, status: "accepted_mock" };
  }
}
