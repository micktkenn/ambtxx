import { Module } from "@nestjs/common";
import { HealthController } from "./modules/health/health.controller";
import { OrdersController } from "./modules/orders/orders.controller";
import { AdminController } from "./modules/admin/admin.controller";
import { AuthController } from "./modules/auth/auth.controller";
import { UsersController } from "./modules/users/users.controller";
import { AdsController } from "./modules/ads/ads.controller";
import { DisputesController } from "./modules/disputes/disputes.controller";
import { KycController } from "./modules/kyc/kyc.controller";
import { WalletsController } from "./modules/wallets/wallets.controller";
import { FeesController } from "./modules/fees/fees.controller";
import { NotificationsController } from "./modules/notifications/notifications.controller";
import { RiskController } from "./modules/risk/risk.controller";
import { ContentController } from "./modules/content/content.controller";
import { IntegrationsController } from "./modules/integrations/integrations.controller";
import { AuditController } from "./modules/audit/audit.controller";


@Module({
  controllers: [HealthController, OrdersController, AdminController, AuthController, UsersController, AdsController, DisputesController, KycController, WalletsController, FeesController, NotificationsController, RiskController, ContentController, IntegrationsController, AuditController],
  providers: []
})
export class AppModule {}
