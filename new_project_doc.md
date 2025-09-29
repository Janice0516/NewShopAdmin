# 项目文档（NewShopAdmin）

本文件为项目的简要说明与接口速查，涵盖架构概览、页面路由、API 概述、核心业务流程、数据模型与错误处理。适合新成员快速上手与联调。

---

## 1. 架构概览
- 前端：Next.js（App Router），Server/Client 组件混合，样式位于 src/app/globals.css。
- 后端：Next.js API Routes（位于 src/app/api），使用 Prisma 连接 MySQL；认证采用 JWT（Authorization: Bearer 或 Cookie）。
- 数据库：Prisma Schema 定义用户、地址、分类、商品、购物车、订单、优惠券、抽奖、物流跟踪、首页栏目、系统配置等模型。
- 关键库：prisma、bcryptjs、jsonwebtoken、zod（部分接口使用）、ETag 缓存与短 TTL（产品列表）。

参考文件：
- 认证与权限：src/lib/auth.ts；数据库客户端：src/lib/prisma.ts；模型：prisma/schema.prisma。

---

## 2. 页面路由（节选）
- 顶层页面：
  - /（首页）
  - /login、/register（登录/注册）
  - /cart（购物车）
  - /checkout（结算）
  - /orders、/orders/[id]（订单列表/详情）、/orders/[id]/tracking（物流跟踪）
  - /support（FAQ、物流、积分）、/privacy、/terms
  - /lottery（抽奖演示）、/test-analytics（分析演示）
- 管理后台（/admin）：
  - /admin/login、/admin/dashboard
  - /admin/products、/admin/categories、/admin/orders、/admin/users
  - /admin/home-sections、/admin/analytics、/admin/lottery
- 英国站（/uk/store）：
  - /uk/store 入口
  - /uk/store/lifestyle、/uk/store/smart-home、/uk/store/wearables
  - /uk/store/smartphones、/uk/store/tablets、/uk/store/coupons（如存在）

---

## 3. API 概述与关键接口
- 基础路径：/api；认证：Cookie(token/admin_token) 或 Authorization: Bearer <JWT>
- 分类：
  - 认证：/api/auth/login、/api/auth/register、/api/auth/me、/api/auth/logout、/api/auth/verify、/api/auth/admin
  - 商品：/api/products、/api/products/[id]
  - 分类：/api/categories、/api/categories/[id]
  - 购物车：/api/cart
  - 地址：/api/addresses
  - 订单：/api/orders、/api/orders/[id]、/api/orders/export
  - 支付：/api/payments、/api/payments/webhook、/api/payments/refund（如实现）
  - 用户：/api/users、/api/users/[id]
  - 首页栏目：/api/home-sections、/api/home-sections/[id]
  - 分析：/api/analytics、/api/analytics/export

核心说明（节选）：
- 认证
  - POST /api/auth/register：注册，邮箱/密码校验，哈希存储，签发 JWT。
  - POST /api/auth/login：登录并签发 JWT，设置安全 Cookie（7 天）。
  - GET /api/auth/me：返回当前用户信息；未登录 401。
- 商品
  - GET /api/products：分页/搜索/过滤；支持 ETag 与短 TTL 缓存（约 60s）。
  - GET /api/products/[id]：商品详情。
- 分类
  - GET /api/categories：返回启用分类及 code（稳定英文映射）。
  - POST /api/categories：管理员创建分类，校验 name、唯一性。
- 购物车 /api/cart（需登录）
  - GET：返回当前用户购物车及商品信息。
  - POST：添加商品（含库存校验与数量合并）。
  - PUT：更新数量；DELETE：移除项。
- 地址 /api/addresses（需登录）
  - CRUD；默认地址唯一性处理，返回默认优先与近期排序。
- 订单
  - GET /api/orders：当前用户订单列表（管理员可查全量）。
  - POST /api/orders：创建订单（自购物车/地址生成，支持优惠券）。
  - GET /api/orders/[id]：订单详情（含 items、trackingHistory）。
- 支付
  - POST /api/payments：创建支付（校验订单/金额/方式），因无 Payment 模型，临时用 Order.paymentId 记录流水。
  - GET /api/payments/status：查询支付状态（临时通过订单查找）。
  - POST /api/payments/webhook：处理第三方回调（alipay/wechat/stripe），签名校验、状态转换、更新订单为 PAID，并执行后置处理（扣库存、发货）。

---

## 4. 业务流程（Mermaid 简版）
```mermaid
flowchart TD
A[浏览商品] --> B{筛选/搜索}
B --> C[加入购物车]
C --> D{已登录?}
D -- 否 --> E[登录/注册]
D -- 是 --> F[选择地址]
E --> F
F --> G[提交订单]
G --> H[创建支付 /api/payments]
H --> I{支付回调 /api/payments/webhook}
I -- 成功 --> J[订单变更为 PAID]
J --> K[发货/物流记录]
K --> L[查看物流 /orders/[id]/tracking]
```

---

## 5. 数据模型速览（Prisma）
- User：id、email(unique)、phone?、password、name?、avatar?、role、isNewUser、timestamps；关联：addresses、orders、cartItems、userCoupons、lotteryLogs。
- Address：基础地址信息、isDefault；关联：user、orders。
- Category：name(unique)、code?（英文标识）、parent 层级、products。
- Product：name(unique)、price、originalPrice?、images(Text JSON)、stock、sold、specs(Json?)、categoryId；关联：orderItems、cartItems。
- CartItem：@@unique([userId,productId])、quantity；关联：user、product。
- Order：orderNo(unique)、金额字段、status、paymentMethod、paymentId、物流字段；关联：items、coupons、trackingHistory、user、address。
- OrderItem：order、product、quantity、price。
- Coupon / UserCoupon / OrderCoupon：优惠券发放与使用关联。
- LotteryActivity / LotteryPrize / LotteryLog：抽奖活动、奖品与记录。
- TrackingHistory：订单物流状态记录。
- HomeSection：首页模块配置；SystemConfig：系统配置键值。

---

## 6. 错误处理与状态码
- 统一返回：{ success, data?, error?, message? }
- 认证：未登录返回 401（引导登录）；权限不足返回 403。
- 校验：缺参数 400；资源不存在 404；业务冲突 409；限流 429；服务器错误 500。
- 前端：统一鉴权提示；用 NoticeModal/ClosableBanner 做公告与提示；失败提供重试与友好文案。

---

## 7. 备注
- 英国站（/uk/store）页面已统一加入鉴权提示与 NoticeModal（部分页面）；
- /api/products 含 ETag/TTL 缓存与可能的限流中间件；
- 支付模块暂未建 Payment 表，采用 Order.paymentId 作为支付流水号进行关联与回调处理。

如需将本文档提交到仓库（Git 提交）或扩展更详尽的 API 字段与示例，请告知。