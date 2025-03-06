# 晋韵古建 · AR 启智

## 项目简介

晋韵古建 · AR 启智是一个融合传统文化与现代科技的移动应用项目，致力于通过AR技术展示山西省的文物古迹，为用户提供沉浸式的文化体验。本项目采用 uni-app 框架开发，支持多端运行。

## 功能特点

### 1. 首页功能
- **智能搜索**: 支持景点、文物、活动的快速搜索
- **功能导航**: 提供首页、导览、AR体验、文物展示、预约讲解等核心功能入口
- **热门景点**: 展示热门景区信息，包含图片、名称、描述等详细信息

### 2. AR体验
- AR扫描识别文物
- 3D模型展示
- 文物信息交互展示

### 3. 导览功能
- 景点实时导航
- 语音讲解
- 路线规划

### 4. 文物展示
- 高清图片展示
- 文物详细信息
- 历史背景介绍

### 5. 预约讲解
- 在线预约讲解员
- 时间段选择
- 预约状态查询

## 技术栈

- 前端框架：uni-app
- UI组件：uni-ui
- 状态管理：Vuex
- AR功能：AR Foundation
- 网络请求：uni.request

## 安装说明

1. **环境要求**
   ```bash
   # Node.js版本要求
   Node.js >= 14.0.0
   
   # 开发工具
   HBuilderX
   ```

2. **安装步骤**
   ```bash
   # 克隆项目
   git clone [项目地址]

   # 安装依赖
   npm install

   # 运行项目
   # HBuilderX中运行或使用命令行
   npm run dev:h5
   # 或
   npm run dev:app-android
   # 或
   npm run dev:app-ios
   ```

3. **开发环境配置**
   - 在HBuilderX中安装必要的插件
   - 配置APP打包环境
   - 配置AR相关SDK

## 项目结构

```
Jin_AR_Heritage/
├── api/                # API接口文件
├── components/         # 公共组件
├── pages/             # 页面文件
│   ├── index/         # 首页
│   ├── login/         # 登录页
│   ├── spot/          # 景点详情
│   └── ar/            # AR功能
├── static/            # 静态资源
│   ├── spots/         # 景点图片
│   └── taber/         # 图标资源
├── store/             # Vuex状态管理
├── utils/             # 工具函数
└── App.vue            # 应用入口
```

## 开发指南

### API接口规范
- 接口基础路径：`/api`
- 请求方法：GET、POST、PUT、DELETE
- 响应格式：
  ```json
  {
    "code": 200,
    "msg": "success",
    "data": {}
  }
  ```

### 组件开发规范
- 组件名称：PascalCase
- Props 命名：camelCase
- 事件命名：kebab-case

### 样式规范
- 使用SCSS预处理器
- 遵循BEM命名规范
- 使用rpx作为单位

## 发布部署

1. **打包构建**
   ```bash
   # H5版本
   npm run build:h5

   # App版本
   # 使用HBuilderX进行云打包
   ```

2. **部署说明**
   - H5版本可部署到任意Web服务器
   - App版本可发布到各大应用商店

## 贡献指南

1. Fork 本仓库
2. 创建新的功能分支
3. 提交代码
4. 创建 Pull Request

## 版本历史

- v1.0.0 (2024-03)
  - 首页功能实现
  - 用户登录注册
  - 热门景点展示

## 联系方式

- 项目维护者：[维护者姓名]
- 邮箱：[联系邮箱]

## 许可证

本项目采用 MIT 许可证
