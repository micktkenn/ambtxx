// Real database repositories for the v0.5 Supabase mode.
// Import from this file when gradually replacing mock API calls with normalized Supabase queries.

export {
  getProfiles as getSupabaseProfiles,
  getAds as getSupabaseAds,
  createOrderFromAd as createSupabaseOrderFromAd,
  updateOrderStatus as updateSupabaseOrderStatus,
  sendOrderMessage as sendSupabaseOrderMessage,
  createAuditLog as createSupabaseAuditLog
} from "@amlbt/supabase";

export {
  recordActivity,
  recordUserActivity,
  recordAdminActivity,
  createPersistentAd,
  createPersistentOrder,
  updatePersistentOrderStatus,
  sendPersistentOrderMessage,
  openPersistentDispute,
  updatePersistentProfileStatus,
  createPersistentNotification
} from "@amlbt/supabase";

// v0.6 concrete remote action layer. These are the files to call from buttons/forms
// when replacing mock UI actions with normalized Supabase writes.
export {
  runRemoteTableAction,
  enqueueRemoteAction,
  getLocalRemoteActionOutbox,
  persistWebActivity,
  persistAdCreateRemote,
  persistAdStatusRemote,
  persistOrderCreateRemote,
  persistOrderStatusRemote,
  persistOrderEventRemote,
  persistOrderMessageRemote,
  persistEvidenceRemote,
  persistDisputeOpenRemote,
  persistPaymentMethodRemote,
  persistSupportTicketRemote,
  persistAdminActivityRemote,
  persistAdminAuditRemote,
  persistAdminUserStatusRemote,
  persistAdminKycDecisionRemote,
  persistAdminDisputeDecisionRemote,
  persistAdminAdStatusRemote,
  persistAdminFeeRuleRemote,
  persistAdminConfigStatusRemote,
  persistAdminRiskFlagRemote,
  persistAdminSystemSettingRemote,
  persistAdminSupportTicketRemote,
  syncWebStateTables,
  syncAdminStateTables,
  scheduleWebStateTableSync,
  scheduleAdminStateTableSync
} from "@amlbt/supabase";
