# 终末地基质筛选终端

> 专为《明日方舟：终末地》设计的数据查询辅助工具

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)

---

## 在线演示

**[https://gujiaming0813.github.io/endfield-tool/](https://gujiaming0813.github.io/endfield-tool/)**

---

## 功能特性

### 基质检索终端
- 角色适配反查：点击角色名称，一键筛选可使用的武器
- 属性组合筛选：基础属性（最多3项）、附加属性、技能属性
- 智能产地定位：自动计算最佳刷取地点

### 干员档案终端
- 阵营、种族、职业多维筛选
- 关联查询，快速定位

### 信用商店
- 商品性价比排行
- 支持多维度排序（价格、体力、性价比）

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite |
| 包管理 | pnpm |
| 样式 | CSS (Grid/Flexbox) + CSS Variables |
| 部署 | GitHub Pages / Docker |

---

## 项目结构

```
src/
├── components/         # 可复用组件
│   ├── Icons.tsx       # SVG 图标
│   ├── LoadingScreen.tsx
│   ├── MobileNav.tsx   # 移动端导航
│   └── Sidebar.tsx     # 桌面端侧边栏
├── pages/              # 页面组件
│   ├── MatrixTool.tsx  # 基质检索
│   ├── CharacterTool.tsx # 干员档案
│   ├── TradeTool.tsx   # 信用商店
│   └── AboutPage.tsx   # 关于页面
├── constants/          # 常量定义
├── data/               # JSON 数据
├── types.ts            # TypeScript 类型
└── App.tsx             # 入口组件
```

---

## 本地运行

```bash
# 克隆仓库
git clone https://github.com/gujiaming0813/endfield-tool.git
cd endfield-tool

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

---

## Docker 部署

```bash
# 构建镜像
docker build -t endfield-tool .

# 运行容器
docker run -d -p 80:80 endfield-tool
```

---

## 致谢

- [b站：皇战萌新轲](https://space.bilibili.com/329400340) - 基质数据来源
- [NGA：2235hhh](https://bbs.nga.cn/nuke.php?func=ucp&uid=41796691) - 信用商店数据来源

---

## 许可证

[MIT License](LICENSE)

---

> **免责声明**：本项目为玩家自制工具，与游戏官方无任何关联。
