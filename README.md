# 智能家居商城 (ShopAdmin)

一个基于 Next.js 15 开发的现代化智能家居电商平台，包含完整的前端用户界面和后端API系统，提供用户购物、管理员后台、支付系统、优惠券系统、抽奖活动等完整的电商功能。

## 🚀 技术栈

- **前端框架**: Next.js 15 (React 19)
- **样式框架**: Tailwind CSS 4
- **数据库**: PostgreSQL + Prisma ORM
- **认证系统**: JWT + NextAuth.js
- **UI组件**: Headless UI + Heroicons + Lucide React
- **类型检查**: TypeScript
- **代码规范**: ESLint

## ✨ 主要功能

### 用户端功能
- 🛍️ **商品浏览**: 商品搜索、分类筛选、价格排序
- 🛒 **购物车系统**: 商品管理、数量修改、价格计算
- 👤 **用户认证**: 登录注册、密码验证、状态管理
- 🎲 **抽奖活动**: 新用户欢迎抽奖、动画效果、中奖记录
- 💳 **订单管理**: 下单结算、订单跟踪、支付处理

### 管理员后台
- 📊 **数据仪表板**: 核心数据统计、趋势分析、热销排行
- 📦 **商品管理**: 商品CRUD、库存监控、销量统计
- 📋 **订单管理**: 订单搜索、状态更新、详情查看
- 👥 **用户管理**: 用户信息、权限控制、状态管理
- 🎟️ **优惠券系统**: 券类管理、使用统计、批量发放
- 🎰 **抽奖管理**: 活动配置、奖品设置、概率控制

## 🛠️ 快速开始

### 环境要求
- Node.js 18+ 
- PostgreSQL 数据库
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd shopadmin
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
创建 `.env.local` 文件并配置以下环境变量：
```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/shopadmin"

# JWT密钥
JWT_SECRET="your-jwt-secret-key"

# NextAuth配置
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. **数据库初始化**
```bash
# 生成Prisma客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 填充初始数据（可选）
npx prisma db seed
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看用户端界面
访问 [http://localhost:3000/admin](http://localhost:3000/admin) 查看管理后台

### 默认管理员账户
- 邮箱: `admin@test.com`
- 密码: `admin123`

## 📁 项目结构

```
sholadmin/
├── prisma/                 # 数据库配置
│   ├── migrations/         # 数据库迁移文件
│   ├── schema.prisma      # 数据库模型定义
│   └── seed.ts            # 初始数据填充
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── admin/         # 管理后台页面
│   │   ├── api/           # API路由
│   │   ├── cart/          # 购物车页面
│   │   ├── checkout/      # 结算页面
│   │   ├── login/         # 登录页面
│   │   ├── lottery/       # 抽奖页面
│   │   ├── products/      # 商品页面
│   │   └── register/      # 注册页面
│   ├── lib/               # 工具库
│   │   ├── auth.ts        # 认证工具
│   │   └── prisma.ts      # 数据库客户端
│   └── middleware.ts      # 中间件配置
├── public/                # 静态资源
└── 项目功能文档.md        # 详细功能文档
```

## 🔧 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 数据库相关
npx prisma studio          # 打开数据库管理界面
npx prisma migrate dev     # 运行数据库迁移
npx prisma db seed         # 填充测试数据
```

## 🌐 API 接口

### 认证相关
- `POST /api/auth/admin/login` - 管理员登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户信息

### 商品管理
- `GET /api/products` - 获取商品列表
- `POST /api/products` - 创建商品
- `GET /api/products/[id]` - 获取商品详情
- `PUT /api/products/[id]` - 更新商品
- `DELETE /api/products/[id]` - 删除商品

### 订单管理
- `GET /api/orders` - 获取订单列表
- `POST /api/orders` - 创建订单
- `GET /api/orders/[id]` - 获取订单详情
- `PUT /api/orders/[id]` - 更新订单状态

### 优惠券系统
- `GET /api/coupons` - 获取优惠券列表
- `POST /api/coupons` - 创建优惠券
- `POST /api/coupons/claim` - 领取优惠券
- `POST /api/coupons/validate` - 使用优惠券

### 抽奖系统
- `GET /api/lottery` - 获取抽奖活动
- `POST /api/lottery/draw` - 参与抽奖
- `GET /api/lottery/prizes` - 获取奖品列表

## 🔒 权限系统

系统支持三种用户角色：
- **USER**: 普通用户，可以浏览商品、购买、参与抽奖
- **ADMIN**: 管理员，可以管理商品、订单、用户
- **SUPER_ADMIN**: 超级管理员，拥有所有权限

## 📱 响应式设计

项目采用移动优先的响应式设计，支持：
- 📱 移动设备 (320px+)
- 📟 平板设备 (768px+)  
- 💻 桌面设备 (1024px+)

## 🚀 部署

### Vercel 部署
1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署完成

### 其他平台
项目支持部署到任何支持 Node.js 的平台，如：
- Railway
- Render
- DigitalOcean App Platform
- AWS
- 阿里云

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**注意**: 更多详细的功能说明请查看 `项目功能文档.md` 文件。
