# ShopAdmin API 文档（截至 2025-09-28）

本文档梳理当前项目的 API 接口，实现功能、前后端对接状态、数据格式规范、请求/响应示例、状态码与错误处理、调用频率限制（如适用），并标注尚未完成前后端对接的接口及其开发进度。

## 1. 功能模块与端点总览

- 认证与授权
  - POST /api/auth/login
  - POST /api/auth/admin/login
  - GET  /api/auth/me
  - POST /api/auth/register
  - GET  /api/auth/verify
  - POST /api/auth/logout
- 商品（Products）
  - GET  /api/products
  - POST /api/products
  - PUT  /api/products
  - DELETE /api/products
  - GET  /api/products/[id]
  - PUT  /api/products/[id]
  - DELETE /api/products/[id]
- 分类（Categories）
  - GET  /api/categories
  - POST /api/categories
  - PUT  /api/categories/[id]
  - DELETE /api/categories/[id]
- 首页板块（Home Sections）
  - GET  /api/home-sections
  - POST /api/home-sections
  - GET  /api/home-sections/[id]
  - PUT  /api/home-sections/[id]
  - DELETE /api/home-sections/[id]
- 订单（Orders）
  - GET  /api/orders
  - POST /api/orders
  - PUT  /api/orders（批量更新状态）
  - GET  /api/orders/[id]
  - PUT  /api/orders/[id]
  - DELETE /api/orders/[id]
  - GET  /api/orders/[id]/tracking
  - POST /api/orders/[id]/tracking
  - GET  /api/orders/export（csv/excel）
- 分析（Analytics）
  - GET  /api/analytics（overview/sales/products/users/orders）
  - POST /api/analytics（导出 JSON/CSV 占位）
  - GET  /api/analytics/export（导出 Excel/JSON）
- 支付（Payments）
  - POST /api/payments（创建支付订单）
  - GET  /api/payments（查询支付状态）
  - POST /api/payments/refund
  - GET  /api/payments/refund
  - POST /api/payments/webhook?provider=alipay|wechat|stripe
- 用户（Users）
  - GET  /api/users
  - POST /api/users
  - PUT  /api/users（批量更新）
  - DELETE /api/users（批量删除）

## 2. 前后端对接状态

- 已对接（页面已调用并展示/操作功能）：
  - 认证：/api/auth/admin/login（Admin Login 页面）、/api/auth/login（Login 页面）、/api/auth/register（Register 页面）、/api/auth/verify（Admin 布局校验）
  - 商品：/api/products（Admin 产品页、UK Store 页面）、/api/products POST（AddProductModal）
  - 分类：/api/categories（多 UK Store 分类页、Admin 分类页）、/api/categories/[id]（Admin 分类页）
  - 首页板块：/api/home-sections、/api/home-sections/[id]（Admin 首页版块页）
  - 订单：/api/orders、/api/orders/[id]（Admin 订单页单条更新）、/api/orders PUT（批量更新）、/api/orders/export（导出）、/api/orders/[id]/tracking（TrackingModal 与订单追踪页）
  - 分析：/api/analytics、/api/analytics/export（Admin Analytics 页面与测试页）
- 未对接或部分对接：
  - 认证：/api/auth/logout（Admin 布局退出已接入）
  - 订单：/api/orders POST（Checkout 页面已接入）
  - 支付：/api/payments、/refund、/webhook（后端实现占位，前端未调用；Payment 模型在 Prisma 中缺失）
  - 用户：/api/users 的 POST/PUT/DELETE（Admin 用户页已调用 GET；批量更新/删除在后端有实现，前端使用情况需完善）

## 3. 通用数据格式规范

- 成功：{ success: true, data: any, message?: string }
- 失败：{ success: false, error: string }
- 部分认证接口返回：{ message, user, token } 或 { error }
- 列表类响应包含分页：{ page, limit, total, totalPages }
- 约定：所有时间戳为 ISO 字符串；金额字段为数字（Number）。

## 4. 状态码与错误处理

- 200：成功
- 201：创建成功（部分创建接口）
- 400：参数校验失败/业务非法（如库存不足、金额不符）
- 401：未认证（需登录）
- 403：权限不足（需管理员角色）
- 404：资源不存在/无访问权限（如订单不属于当前用户）
- 429：触发限流（含 Retry-After、X-RateLimit-* 头）
- 500：服务内部错误

错误处理统一返回 JSON，包含 error 描述；部分接口附带 message。

## 5. 调用频率限制（Rate Limit）

- /api/products GET：每分钟 100 次（返回 X-RateLimit-Limit/Remaining/Reset 及 429 Retry-After）；支持 ETag 与 Last-Modified 缓存，命中返回 304。
- 其他接口当前未显式应用限流（后续可按需接入）。

## 6. 关键接口详细说明与示例

以下示例均为 JSON，示例中参数仅供参考，实际以业务模型为准。

### 6.1 认证

- POST /api/auth/admin/login
  - 入参：{ email: string, password: string }
  - 返回：{ message, user: { id,email,name,role,createdAt }, token }
  - 侧效：设置 Cookie admin_token 与 token（HttpOnly）
  - 错误：400（账号不存在/密码错误）、403（非管理员）

- POST /api/auth/login
  - 入参：{ email, password }
  - 行为：禁止管理员在此登录；成功后设置 HttpOnly token Cookie

- GET /api/auth/verify
  - 行为：校验登录态，返回 { user }

- POST /api/auth/register
  - 入参：{ email, password, name, phone }
  - 返回：注册后设置 token Cookie，返回基本用户信息

- POST /api/auth/logout
  - 行为：清除登录 Cookie

### 6.2 商品（Products）

- GET /api/products
  - 查询参数：page, limit, search, category, status(active|inactive|out_of_stock), sortBy, sortOrder, lastModified
  - 返回：{ success, data: { products, pagination, stats, timestamp } }，并附带 ETag/Cache-Control/Last-Modified
  - 示例响应简化：
    {
      "success": true,
      "data": {
        "products": [{ "id": "p1", "name": "Phone", "images": [], "price": 699, "stock": 100, "category": { "id": "c1", "name": "Smartphones" } }],
        "pagination": { "page": 1, "limit": 10, "total": 120, "totalPages": 12 },
        "stats": { "active": 0, "inactive": 0, "draft": 0, "outOfStock": 0 },
        "timestamp": 1690000000000
      }
    }
  - 限流：每分钟 100 次；304 处理：含 If-Modified-Since/ETag

- POST /api/products（需管理员）
  - 入参：{ name, description, price, stock, categoryId, images }
  - 返回：创建后的产品对象；错误返回权限不足/校验失败

- PUT/DELETE /api/products（需管理员）
  - 行为：批量更新/删除（具体字段以实现为准）

- /api/products/[id]
  - GET：获取指定产品详情
  - PUT/DELETE：更新/删除指定产品（需管理员，删除前检查关联订单项）

### 6.3 分类（Categories）

- GET /api/categories
  - 行为：返回激活的分类列表（含代码映射）

- POST /api/categories（需管理员）
  - 入参：{ name, code?, isActive? }
  - 行为：重复名校验，创建分类

- PUT/DELETE /api/categories/[id]（需管理员）
  - PUT：部分更新；
  - DELETE：支持软删（isActive=false）与硬删

### 6.4 首页板块（Home Sections）

- GET /api/home-sections；POST /api/home-sections（创建）
- /api/home-sections/[id]：GET/PUT/DELETE 管理单个板块

### 6.5 订单（Orders）

- GET /api/orders
  - 查询参数：page, limit, search（用户姓名/邮箱），status，startDate，endDate，sortBy，sortOrder
  - 返回：{ success, data: { orders, pagination, stats } }

- POST /api/orders（需登录）
  - 入参：{ items: [{ productId, quantity }...], shippingAddress, addressId?, paymentMethod?, couponCode?, notes? }
  - 行为：校验库存与上下架；计算金额；应用有效优惠券；生成订单项

- PUT /api/orders（批量更新状态，需管理员）
  - 入参：{ orderIds: string[], status: 'PENDING'|'PAID'|'SHIPPED'|'DELIVERED'|'CANCELLED'|'REFUNDED' }

- /api/orders/[id]
  - GET/PUT/DELETE：获取/更新/删除单个订单（更新状态在 Admin 订单页已对接）

- /api/orders/[id]/tracking
  - GET：获取订单物流追踪信息
  - POST：新增/更新订单追踪记录（Admin TrackingModal 已对接）

- GET /api/orders/export
  - 查询参数：format=csv|excel，status?，startDate?，endDate?
  - 返回：文件下载（csv/xlsx）

### 6.6 分析（Analytics）

- GET /api/analytics（需管理员）
  - 查询：type=overview|sales|products|users|orders，startDate，endDate
  - 返回：按类型聚合数据（概览、销量按日/分类、热门产品/客户等）
  - 注意：当前代码检查角色为 'admin'（小写），与系统角色 'ADMIN'/'SUPER_ADMIN' 不一致，需统一

- POST /api/analytics（导出占位）
  - 行为：导出 JSON（CSV 暂为占位）

- GET /api/analytics/export（需管理员）
  - 查询：format=excel|json，startDate，endDate
  - 返回：Excel 或 JSON 的综合分析数据（概览、订单/用户/产品 Top 等）

### 6.7 支付（Payments）

- POST /api/payments（需登录）
  - 入参：{ orderId, paymentMethod: 'alipay'|'wechat'|'stripe'|'balance', amount, currency?, returnUrl?, notifyUrl? }
  - 行为：校验订单归属与金额；生成支付流水号；按支付方式走占位流程；更新订单状态（PAID/PENDING）
  - 限制：Prisma 中暂无 Payment 模型，支付记录为占位模拟；正式接入需完善模型与第三方 SDK

- GET /api/payments（需登录）
  - 查询：paymentId 或 paymentNumber
  - 行为：通过订单记录间接查询支付状态

- POST /api/payments/refund（需登录）
  - 入参：{ orderId, amount?, reason? }；状态允许：PAID/SHIPPED/DELIVERED；成功后订单置为 REFUNDED

- GET /api/payments/refund（需登录）
  - 查询：orderId；返回简化退款信息（基于订单状态）

- POST /api/payments/webhook（第三方回调）
  - 查询：provider=alipay|wechat|stripe；按平台解析/验签（占位）；根据 paymentNumber 更新订单支付状态

### 6.8 用户（Users）（需管理员）

- GET /api/users：分页与筛选用户列表，返回角色统计（ADMIN/SUPER_ADMIN/USER 等）
- POST /api/users：创建用户（规范化字段，需结合前端表单）
- PUT /api/users：批量更新，{ userIds, updates }，禁止修改自己的状态
- DELETE /api/users：批量删除，ids=逗号分隔；校验不可删除自身与有关联订单的用户

## 7. 已对接接口的测试与验证

- 列表/详情展示：Admin Products/Orders/Categories/Home Sections 页面已通过接口拉取并展示数据；分页与筛选正常。
- 订单追踪：TrackingModal 与订单追踪页，可获取与更新追踪信息。
- 导出：订单与分析导出（CSV/Excel/JSON）在页面操作后能下载文件。
- 认证：登录、注册、验证已在页面链路中使用；Admin 布局基于 /api/auth/verify 做守卫。
- 注意事项：Analytics 路由角色判断与系统角色大小写不一致，可能导致权限校验问题；建议统一为 'ADMIN'/'SUPER_ADMIN'。

## 8. 未完成前后端对接与进度

- /api/auth/logout：后端已实现，前端待接入退出流程。
- /api/orders POST：前端结算/创建订单流程待接入；后端逻辑已具备库存/优惠券校验。
- 支付模块：后端为占位实现，缺少 Payment 模型与正式第三方 SDK；前端未接入支付创建/状态查询；Webhook 解析与验签为示例逻辑，需替换为正式实现。
- 用户管理：前端待完善批量更新/删除操作的调用与 UI。

—— 完 ——