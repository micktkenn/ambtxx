import { runRemoteTableAction, type RemoteActionTone } from "./remote-action-engine";

const adminActor = {
  app: "admin" as const,
  actorType: "admin" as const,
  actorId: "admin_super",
  actorName: "Super Admin",
};

export async function persistAdminActivityRemote(actionKey: string, payload?: Record<string, unknown>, tone: RemoteActionTone = "success") {
  return runRemoteTableAction({
    ...adminActor,
    actionKey,
    operation: "activity",
    targetType: String(payload?.targetType ?? "ui"),
    targetId: String(payload?.targetId ?? "prototype"),
    payload,
    tone,
    audit: true,
  });
}

export async function persistAdminAuditRemote(action: string, targetType = "prototype", targetId = "mock", result = "success") {
  return runRemoteTableAction({
    ...adminActor,
    actionKey: "admin.audit.create",
    operation: "insert",
    tableName: "admin_audit_logs",
    targetType,
    targetId,
    values: {
      id: `AUD-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      admin_name: "Super Admin",
      action,
      target_type: targetType,
      target_id: targetId,
      ip_masked: "196.188.xxx.xxx",
      result,
    },
    payload: { action, targetType, targetId, result },
    tone: result === "success" ? "success" : "warning",
  });
}

export async function persistAdminUserStatusRemote(userId: string, status: string, action = "users.status.update") {
  await persistAdminAuditRemote(action, "user", userId);
  return runRemoteTableAction({
    ...adminActor,
    actionKey: action,
    operation: "update",
    tableName: "profiles",
    targetType: "user",
    targetId: userId,
    match: { id: userId },
    values: { status, updated_at: new Date().toISOString() },
    payload: { userId, status },
    tone: status === "frozen" ? "danger" : "warning",
  });
}

export async function persistAdminKycDecisionRemote(caseId: string, userId: string, status: string, requestedLevel?: number, note?: string) {
  await persistAdminAuditRemote(`kyc.${status}`, "kyc_case", caseId);
  await runRemoteTableAction({
    ...adminActor,
    actionKey: "kyc.case.update",
    operation: "update",
    tableName: "kyc_cases",
    targetType: "kyc_case",
    targetId: caseId,
    match: { id: caseId },
    values: { status, reviewer: "Super Admin", review_note: note ?? null, updated_at: new Date().toISOString() },
    payload: { caseId, userId, status, requestedLevel, note },
    tone: status === "approved" ? "success" : status === "rejected" ? "danger" : "warning",
  });

  if (status === "approved") {
    return runRemoteTableAction({
      ...adminActor,
      actionKey: "profiles.kyc.approve",
      operation: "update",
      tableName: "profiles",
      targetType: "user",
      targetId: userId,
      match: { id: userId },
      values: { kyc_status: "approved", kyc_level: requestedLevel ?? 1, updated_at: new Date().toISOString() },
      payload: { userId, requestedLevel },
      tone: "success",
    });
  }

  return { source: "supabase" as const, status: "ok" as const, actionId: caseId };
}

export async function persistAdminDisputeDecisionRemote(disputeId: string, orderId: string, status: string, orderStatus?: string, escrowStatus?: string, note?: string) {
  await persistAdminAuditRemote(`disputes.${status}`, "dispute", disputeId);
  await runRemoteTableAction({
    ...adminActor,
    actionKey: "disputes.status.update",
    operation: "update",
    tableName: "disputes",
    targetType: "dispute",
    targetId: disputeId,
    match: { id: disputeId },
    values: { status, moderator_notes: note ? [note] : undefined, updated_at: new Date().toISOString() },
    payload: { disputeId, orderId, status, orderStatus, escrowStatus, note },
    tone: status === "resolved" ? "danger" : "warning",
  });

  if (orderStatus) {
    return runRemoteTableAction({
      ...adminActor,
      actionKey: "orders.admin.status.update",
      operation: "update",
      tableName: "orders",
      targetType: "order",
      targetId: orderId,
      match: { id: orderId },
      values: { status: orderStatus, escrow_status: escrowStatus ?? undefined, updated_at: new Date().toISOString() },
      payload: { disputeId, orderId, orderStatus, escrowStatus },
      tone: orderStatus === "released" ? "danger" : "warning",
    });
  }

  return { source: "supabase" as const, status: "ok" as const, actionId: disputeId };
}

export async function persistAdminAdStatusRemote(adId: string, status: string) {
  await persistAdminAuditRemote("ads.status.update", "ad", adId);
  return runRemoteTableAction({
    ...adminActor,
    actionKey: "ads.admin.status.update",
    operation: "update",
    tableName: "ads",
    targetType: "ad",
    targetId: adId,
    match: { id: adId },
    values: { status, updated_at: new Date().toISOString() },
    payload: { adId, status },
    tone: status === "active" ? "success" : "warning",
  });
}

export async function persistAdminFeeRuleRemote(ruleId: string, values: { status?: string; percentage?: number }) {
  await persistAdminAuditRemote("fees.rule.update", "fee_rule", ruleId);
  return runRemoteTableAction({
    ...adminActor,
    actionKey: "fees.rule.update",
    operation: "update",
    tableName: "fee_rules",
    targetType: "fee_rule",
    targetId: ruleId,
    match: { id: ruleId },
    values: { ...values, updated_at: new Date().toISOString() },
    payload: { ruleId, values },
    tone: "warning",
  });
}

export async function persistAdminConfigStatusRemote(tableName: string, targetIdColumn: string, targetId: string | number, status: string, actionKey: string) {
  await persistAdminAuditRemote(actionKey, tableName, String(targetId));
  return runRemoteTableAction({
    ...adminActor,
    actionKey,
    operation: "update",
    tableName,
    targetType: tableName,
    targetId: String(targetId),
    match: { [targetIdColumn]: targetId },
    values: { status, updated_at: new Date().toISOString() },
    payload: { tableName, targetIdColumn, targetId, status },
    tone: status === "active" || status === "published" || status === "healthy" ? "success" : "warning",
  });
}

export async function persistAdminRiskFlagRemote(flagId: string, status: string) {
  await persistAdminAuditRemote("risk.flag.update", "risk_flag", flagId);
  return runRemoteTableAction({
    ...adminActor,
    actionKey: "risk.flag.update",
    operation: "update",
    tableName: "risk_flags",
    targetType: "risk_flag",
    targetId: flagId,
    match: { id: flagId },
    values: { status, resolved_at: status === "resolved" ? new Date().toISOString() : null },
    payload: { flagId, status },
    tone: status === "resolved" ? "success" : "warning",
  });
}

export async function persistAdminSystemSettingRemote(key: string, value: unknown) {
  await persistAdminAuditRemote("system.setting.update", "system_setting", key);
  return runRemoteTableAction({
    ...adminActor,
    actionKey: "system.setting.update",
    operation: "upsert",
    tableName: "system_settings",
    targetType: "system_setting",
    targetId: key,
    values: { key, label: key, value, updated_at: new Date().toISOString() },
    payload: { key, value },
    tone: "warning",
  });
}

export async function persistAdminSupportTicketRemote(ticketId: string, status: string) {
  await persistAdminAuditRemote("support.ticket.update", "support_ticket", ticketId);
  return runRemoteTableAction({
    ...adminActor,
    actionKey: "support.ticket.update",
    operation: "update",
    tableName: "support_tickets",
    targetType: "support_ticket",
    targetId: ticketId,
    match: { id: ticketId },
    values: { status, updated_at: new Date().toISOString() },
    payload: { ticketId, status },
    tone: status === "resolved" ? "success" : "warning",
  });
}
