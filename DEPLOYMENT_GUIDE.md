# 🚀 ShopAdmin 服务器部署指南

## 📋 部署前准备

### 1. 服务器环境要求
- Ubuntu 20.04+ 或 CentOS 7+
- Node.js 18+ 
- MySQL 8.0+
- Git
- PM2 (进程管理器)

### 2. 安装基础环境

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# 安装PM2
sudo npm install -g pm2

# 安装Git
sudo apt install git -y
```

## 🔧 部署步骤

### 1. 克隆项目
```bash
cd /var/www
sudo git clone https://github.com/Janice0516/ShopAdmin.git
cd ShopAdmin
sudo chown -R $USER:$USER /var/www/ShopAdmin
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
# 复制环境变量文件
cp .env.local .env.production

# 编辑生产环境配置
nano .env.production
```

**生产环境配置示例：**
```env
# MySQL数据库连接 - 修改为你的服务器配置
DATABASE_URL="mysql://shopadmin:your_password@localhost:3306/shopadmin"

# JWT密钥 - 使用强密码
JWT_SECRET="your-super-secure-jwt-secret-key"

# NextAuth配置
NEXTAUTH_SECRET="your-super-secure-nextauth-secret"
NEXTAUTH_URL="http://your-server-ip:3000"
```

### 4. 配置MySQL数据库
```bash
# 登录MySQL
sudo mysql -u root -p

# 创建数据库和用户
CREATE DATABASE shopadmin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'shopadmin'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON shopadmin.* TO 'shopadmin'@'localhost';
GRANT CREATE ON *.* TO 'shopadmin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. 运行数据库迁移
```bash
# 部署数据库结构
npx prisma migrate deploy

# 生成Prisma客户端
npx prisma generate

# 运行种子数据（可选）
npx prisma db seed
```

### 6. 构建项目
```bash
npm run build
```

### 7. 启动应用
```bash
# 使用PM2启动
pm2 start npm --name "shopadmin" -- start

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
# 按照提示运行显示的命令
```

## 🔒 安全配置

### 1. 配置防火墙
```bash
# 允许SSH、HTTP和应用端口
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 3000
sudo ufw enable
```

### 2. 配置Nginx反向代理（推荐）
```bash
# 安装Nginx
sudo apt install nginx -y

# 创建配置文件
sudo nano /etc/nginx/sites-available/shopadmin
```

**Nginx配置示例：**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/sholadmin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 📊 监控和维护

### 1. PM2 常用命令
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs shopadmin

# 重启应用
pm2 restart shopadmin

# 停止应用
pm2 stop shopadmin

# 监控资源使用
pm2 monit
```

### 2. 更新部署
```bash
# 拉取最新代码
git pull origin main

# 安装新依赖（如有）
npm install

# 运行数据库迁移（如有）
npx prisma migrate deploy

# 重新构建
npm run build

# 重启应用
pm2 restart shopadmin
```

## 🎯 测试部署

### 1. 检查应用状态
```bash
# 检查端口是否监听
sudo netstat -tlnp | grep :3000

# 测试HTTP响应
curl http://localhost:3000
```

### 2. 访问应用
- 主页：`http://your-server-ip:3000`
- 商店：`http://your-server-ip:3000/uk/store`
- 管理后台：`http://your-server-ip:3000/admin`

### 3. 测试账户
- 管理员：`admin@test.com` / `admin123`
- 客户：`customer@test.com` / `123456`

## 🆘 故障排除

### 常见问题
1. **数据库连接失败**：检查DATABASE_URL配置和MySQL服务状态
2. **端口被占用**：使用`sudo lsof -i :3000`查看端口使用情况
3. **权限问题**：确保应用目录有正确的用户权限
4. **内存不足**：检查服务器内存使用情况，考虑增加swap

### 日志查看
```bash
# PM2日志
pm2 logs shopadmin

# Nginx日志
sudo tail -f /var/log/nginx/error.log

# 系统日志
sudo journalctl -u mysql
```

---

🎉 **部署完成！** 你的ShopAdmin应用现在应该在服务器上正常运行了。