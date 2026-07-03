-- AMLBT Supabase seed data v0.4

insert into public.profiles (id, username, display_name, email, country, avatar_initials, kyc_level, kyc_status, risk_level, status, completed_trades, completion_rate, rating, average_release_minutes, wallet_address, created_at) values
('user_001','MilkessaT','Milkessa Tesso','milkessa@example.com','Ethiopia','MT',2,'approved','low','active',42,98.4,4.8,6,'0x7b21E9f7A91dF4c8aF00291c9A21b771114A91dF','2025-01-14T10:15:00Z'),
('user_002','AbdiPay','Abdi Tesfaye','merchant@amlbt.mock','Ethiopia','AB',3,'approved','low','active',1248,99.2,4.9,4,'0xA91dF4c8Af00291c9A21B771114A91Df7b21E9f7','2024-09-08T09:30:00Z'),
('user_003','HanaMarket','Hana Bekele',null,'Ethiopia','HM',2,'approved','low','active',728,97.8,4.7,7,null,'2024-11-03T12:00:00Z'),
('user_004','DawitFX','Dawit Alemu',null,'Ethiopia','DF',3,'approved','low','active',2014,98.7,4.9,3,null,'2024-03-22T08:00:00Z'),
('user_005','LomiTrade','Lomi Gebre',null,'Ethiopia','LM',1,'requires_review','medium','restricted',421,96.4,4.5,null,null,'2025-06-01T14:00:00Z'),
('user_006','BirukFast','Biruk K.',null,'Ethiopia','BK',0,'not_started','high','frozen',8,71.2,3.1,null,null,'2026-06-20T14:00:00Z')
on conflict (id) do update set username = excluded.username, display_name = excluded.display_name, updated_at = now();

insert into public.assets (symbol, name, network, contract, decimals, status, min_trade, max_trade, icon, escrow_enabled) values
('USDT','Tether USD','BNB Chain','0x55d398326f99059fF775485246999027B3197955',18,'active',10,20000,'₮',true),
('USDC','USD Coin','Polygon','0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',6,'paused',10,10000,'$',false),
('BNB','BNB','BNB Chain','native',18,'active',0,0,'◎',false)
on conflict (symbol) do update set status = excluded.status, updated_at = now();

insert into public.networks (name, chain_id, rpc_provider, explorer_url, escrow_contract, confirmations, status, latest_synced_block, gas_policy) values
('BNB Smart Chain',56,'Alchemy','https://bscscan.com','0xEscrowMockA102',12,'active',41289118,'user_pays'),
('Polygon',137,'Alchemy','https://polygonscan.com','0xEscrowMockB880',64,'paused',58902441,'user_pays')
on conflict (chain_id) do update set status = excluded.status, latest_synced_block = excluded.latest_synced_block, updated_at = now();

insert into public.payment_methods (id, name, type, country, fiat, status, kyc_level, risk_level, min_order_amount, max_order_amount, instructions) values
('pm_cbe','CBE Bank Transfer','bank_transfer','Ethiopia','ETB','active',1,'low',500,250000,'Use your own verified bank account only.'),
('pm_telebirr','Telebirr','mobile_money','Ethiopia','ETB','active',1,'medium',100,50000,'Payment name must match account profile.'),
('pm_awash','Awash Bank','bank_transfer','Ethiopia','ETB','active',1,'low',500,200000,'Bank transfer only.')
on conflict (id) do update set status = excluded.status, updated_at = now();

insert into public.user_payment_methods (id, user_id, method_type, provider_name, account_holder_name, account_identifier_masked, currency, instructions, status, visible) values
('upm_001','user_001','bank_transfer','CBE','Milkessa Tesso','****7781','ETB','Use order ID in payment note.','active',true),
('upm_002','user_001','mobile_money','Telebirr','Milkessa Tesso','****2199','ETB','Send screenshot after transfer.','active',true)
on conflict (id) do update set status = excluded.status, visible = excluded.visible, updated_at = now();

insert into public.ads (id, trader_id, side, asset, fiat, price, price_type, margin_percent, available_amount, min_fiat, max_fiat, payment_methods, payment_window_minutes, terms, requirements, status, created_at) values
('ad_001','user_002','sell','USDT','ETB',132.80,'fixed',null,2450,1000,80000,array['CBE','Telebirr','Bank transfer'],30,'Pay using your own verified account only.','{"minKycLevel":1,"require2fa":true}'::jsonb,'active','2026-07-01T10:00:00+03:00'),
('ad_002','user_003','sell','USDT','ETB',133.15,'fixed',null,910,500,30000,array['Awash','Dashen'],20,'Fast release after confirmed payment.','{"minKycLevel":1,"minRating":4}'::jsonb,'active','2026-07-01T11:00:00+03:00'),
('ad_003','user_004','sell','USDT','ETB',133.45,'market_margin',0.4,7500,5000,250000,array['Bank transfer'],45,'Merchant orders only. No third-party payments.','{"minKycLevel":2,"minCompletedTrades":10}'::jsonb,'active','2026-06-29T10:00:00+03:00'),
('ad_004','user_001','buy','USDT','ETB',131.90,'market_discount',-0.3,1500,1000,60000,array['CBE'],30,'I pay from verified bank account.','{"minKycLevel":1}'::jsonb,'paused','2026-06-25T10:00:00+03:00')
on conflict (id) do update set status = excluded.status, available_amount = excluded.available_amount, updated_at = now();

insert into public.orders (id, ad_id, side, buyer_id, seller_id, asset, asset_amount, fiat, fiat_amount, price, status, escrow_status, payment_method, payment_account_name, payment_account_masked, timer_ends_at, escrow_tx, fee_amount, created_at, updated_at) values
('TRD-9021','ad_001','buy','user_001','user_002','USDT',150,'ETB',19920,132.80,'payment_pending','funded','CBE','Abdi Tesfaye','****4432','2026-07-03T15:00:00+03:00','0x8a4219f74a90127e2dd44caa0019f',0.45,'2026-07-03T14:14:00+03:00','2026-07-03T14:16:00+03:00'),
('TRD-9018',null,'sell','user_003','user_001','USDT',75,'ETB',9960,132.80,'marked_paid','funded','Telebirr',null,null,null,null,0.23,'2026-07-03T12:15:00+03:00','2026-07-03T12:36:00+03:00'),
('TRD-9007',null,'buy','user_001','user_004','USDT',48.5,'ETB',6438,132.75,'completed','released',null,null,null,null,null,0.15,'2026-07-02T16:00:00+03:00','2026-07-02T16:18:00+03:00'),
('TRD-8975',null,'sell','user_006','user_002','USDT',220,'ETB',29260,133,'disputed','funded','CBE',null,null,null,null,0.66,'2026-07-03T10:20:00+03:00','2026-07-03T11:40:00+03:00')
on conflict (id) do update set status = excluded.status, escrow_status = excluded.escrow_status, updated_at = now();

insert into public.order_events (id, order_id, type, label, description, actor_type, created_at) values
('evt_001','TRD-9021','order_created','Order created','MilkessaT accepted AbdiPay offer.','buyer','2026-07-03T14:14:00+03:00'),
('evt_002','TRD-9021','escrow_funded','Escrow funded','150 USDT locked in smart-contract escrow.','system','2026-07-03T14:15:00+03:00'),
('evt_003','TRD-9018','payment_marked_paid','Payment marked paid','Buyer uploaded Telebirr receipt.','buyer','2026-07-03T12:36:00+03:00'),
('evt_004','TRD-8975','dispute_opened','Dispute opened','Seller reported payment not received.','seller','2026-07-03T11:40:00+03:00')
on conflict (id) do nothing;

insert into public.order_messages (id, order_id, sender_type, sender_name, body, created_at) values
('msg_001','TRD-9021','system',null,'Escrow funded. Buyer can now pay the seller.','2026-07-03T14:15:00+03:00'),
('msg_002','TRD-9021','counterparty','AbdiPay','Hi, please use the CBE account shown in the payment details.','2026-07-03T14:16:00+03:00'),
('msg_003','TRD-9021','user','MilkessaT','Okay. I will pay now and upload the receipt.','2026-07-03T14:17:00+03:00'),
('msg_004','TRD-9021','counterparty','AbdiPay','Please include order ID in the payment note.','2026-07-03T14:18:00+03:00'),
('msg_005','TRD-8975','moderator','Sara Admin','Please upload seller bank statement for the trade window.','2026-07-03T11:45:00+03:00')
on conflict (id) do nothing;

insert into public.disputes (id, order_id, reason, status, priority, amount, asset, buyer_evidence_count, seller_evidence_count, assigned_moderator, created_at) values
('DSP-401','TRD-8975','Payment not received','waiting_for_evidence','urgent',220,'USDT',2,1,'Sara Admin','2026-07-03T11:40:00+03:00')
on conflict (id) do update set status = excluded.status, updated_at = now();

insert into public.fee_rules (id, name, payer, percentage, min_fee, max_fee, asset, status) values
('fee_001','Standard P2P trade','seller',0.30,0.10,20,'USDT','active'),
('fee_002','Merchant tier','seller',0.20,0.05,15,'USDT','active'),
('fee_003','Launch promo','platform',0,0,0,'USDT','scheduled')
on conflict (id) do update set percentage = excluded.percentage, status = excluded.status, updated_at = now();

insert into public.integrations (key, name, category, status, mode, masked_key, webhook_url, last_success, last_error) values
('wallet_provider','MetaMask Embedded Wallets','Wallet','connected','sandbox','pk_test_••••91df',null,'2026-07-03T13:12:00+03:00',null),
('rpc','Alchemy RPC','Blockchain','healthy','sandbox',null,'/webhooks/blockchain','2026-07-03T14:01:00+03:00',null),
('kyc','Sumsub Sandbox','Verification','setup_required','sandbox',null,'/webhooks/kyc',null,null),
('telegram','Telegram Bot','Notifications','connected','sandbox',null,'/telegram/webhook','2026-07-03T13:55:00+03:00',null),
('email','Resend','Notifications','connected','sandbox',null,null,'2026-07-03T13:59:00+03:00',null),
('aml','AML Screening','Risk','error','sandbox',null,null,null,'API key missing in sandbox')
on conflict (key) do update set status = excluded.status, updated_at = now();

insert into public.risk_rules (id, name, trigger, severity, status) values
('rule_001','New account high-value trade','> 1000 USDT within 24h','high','active'),
('rule_002','Payment method changed recently','Changed within 48h','medium','active'),
('rule_003','Price outlier','±8% from market median','medium','active'),
('rule_004','High dispute rate','3+ disputes in 30 days','high','active')
on conflict (id) do update set status = excluded.status, updated_at = now();

insert into public.content_items (id, title, placement, body, status) values
('content_001','Escrow safety FAQ','home_faq','Crypto is locked in escrow until payment is confirmed.','published'),
('content_002','Maintenance banner','dashboard','BNB Chain sync may be delayed tonight.','scheduled'),
('content_003','Fee explanation','market','Standard trades include a transparent platform fee shown before confirmation.','published')
on conflict (id) do update set status = excluded.status, updated_at = now();

insert into public.system_settings (key, label, description, value) values
('registration_enabled','Registration enabled','Allow new user registrations','true'::jsonb),
('trading_enabled','Trading enabled','Allow users to create new orders','true'::jsonb),
('ad_creation_enabled','Ad creation enabled','Allow users to create ads','true'::jsonb),
('maintenance_mode','Maintenance mode','Show maintenance mode and block risky actions','false'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- Initialize empty functional snapshot rows. The frontend fills these with full JSON state on first load.
insert into public.app_state_snapshots (id, app, payload) values
('web:functional-state','web','{}'::jsonb),
('admin:functional-state','admin','{}'::jsonb)
on conflict (id) do nothing;
