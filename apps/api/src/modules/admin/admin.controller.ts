import { Controller, Get } from "@nestjs/common";

@Controller("admin")
export class AdminController {
  @Get("dashboard")
  dashboard() {
    return { activeUsers: 8412, activeOrders: 312, openDisputes: 14, pendingKyc: 47, systemHealth: "healthy" };
  }

  @Get("audit-logs")
  auditLogs() {
    return [
      { id: "audit_001", admin: "Sara Admin", action: "disputes.request_evidence", target: "DSP-401" },
      { id: "audit_002", admin: "Noah Risk", action: "users.restrict", target: "user_006" }
    ];
  }
}
