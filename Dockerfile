# --- 第一阶段：构建 (Builder) ---
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 启用 Corepack (Node 20 内置了 pnpm 支持，无需 npm install -g)
RUN corepack enable

# 复制依赖定义文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖 (使用 frozen-lockfile 确保版本一致性)
RUN pnpm install --frozen-lockfile

# 复制项目源代码
COPY . .

# 执行构建 (Vite 会打包到 /app/dist)
RUN pnpm build

# --- 第二阶段：部署 (Runner) ---
FROM nginx:alpine

# 从构建阶段复制构建产物到 Nginx 默认目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置 (防止页面刷新 404)
# 注意：你需要先在项目根目录创建这个 nginx.conf 文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80 443

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]