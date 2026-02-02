# Endfield Matrix Tool | 终末地基质筛选终端

> 专为《明日方舟：终末地》设计的基质/武器合成检索工具。
> A fan-made matrix construction simulator for Arknights: Endfield.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)

## 🔗 在线演示 (Live Demo)

**[点击访问在线终端](https://gujiaming0813.github.io/endfield-tool/)**

---

## 📖 项目简介 (Introduction)

本项目是一个仿照游戏内 UI 风格开发的 Web 工具，旨在帮助玩家快速检索武器合成配方。用户可以通过选择**适配角色**或**武器属性**（基础、附加、技能），快速找到对应的武器，并计算出最佳的素材刷取地点（枢纽区、源石研究园等）。

## ✨ 核心功能 (Features)

* **🕵️‍♂️ 角色适配反查**：
    * 支持点击角色名称（Tag 标签），一键筛选该角色可使用的所有武器。
    * 支持多角色数据解析与高亮显示。
* **🧬 属性组合筛选**：
    * **A 基础属性**：支持多选（最多 3 项）。
    * **B/C 附加与技能**：互斥选择逻辑，精准定位配方。
    * **智能联动**：支持“角色 + 属性”的交集筛选（例如：查找“管理员”能用的“敏捷”武器）。
* **📍 最佳产地定位**：
    * 根据筛选结果，自动统计并计算出该组合产出率最高的地图区域。
* **🎨 沉浸式 UI 设计**：
    * 复刻《终末地》工业科技风格。
    * JetBrains Mono 编程字体 + 动态切角按钮 + 呼吸灯效。
    * 响应式布局，适配桌面端与部分移动端。

## 🛠️ 技术栈 (Tech Stack)

* **核心框架**: React 18 + TypeScript
* **构建工具**: Vite
* **包管理器**: pnpm
* **样式方案**: CSS (Grid/Flexbox) + CSS Variables + Clip-path (实现切角效果)
* **部署托管**: GitHub Pages

## 🚀 本地运行 (Getting Started)

如果您想在本地运行或修改本项目，请按照以下步骤操作：

### 1. 克隆仓库
```bash
git clone [https://github.com/gujiaming0813/endfield-tool.git](https://github.com/gujiaming0813/endfield-tool.git)
cd endfield-tool
