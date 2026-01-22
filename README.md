# 武林外传人物图鉴 (Wulin Waizhuan Character Encyclopedia)

## 项目简介
这是一个基于 React 和 Vite 构建的武林外传人物图鉴网站，展示了剧中人物的详细信息、关系图谱和动态活动日志。

## 文件结构说明

```
wlwz/
├── src/                    # React 源代码
│   ├── components/         # UI 组件
│   ├── pages/              # 页面组件 (Home, Character, Relations, Activities)
│   ├── data/
│   │   └── source/         # 原始数据源 (JSON)
│   │       ├── data/       # 角色数据
│   │       ├── events/     # 事件数据
│   │       └── avatars/    # 原始头像资源
│   └── ...
├── public/                 # 静态资源 (Vite 直接服务)
│   ├── resources/          # 生成的数据和背景图
│   ├── characters/         # 优化后的头像资源 (WebP)
│   ├── services/           # 遗留服务脚本
│   └── js/                 # 遗留主逻辑脚本 (main.js)
├── build_data.js           # 数据构建脚本 (JSON -> JS/WebP paths)
├── optimize_images.js      # 图片优化脚本 (PNG/JPG -> WebP)
├── vite.config.ts          # Vite 配置
└── package.json            # 项目依赖和脚本
```

## 开发指南

1.  **安装依赖**:
    ```bash
    npm install
    ```

2.  **启动开发服务器**:
    ```bash
    npm run dev
    ```

3.  **构建项目**:
    ```bash
    npm run build
    ```
    构建产物将输出到 `docs/` 目录（用于 GitHub Pages）。

4.  **更新数据**:
    如果修改了 `src/data/source` 下的 JSON 文件，请运行：
    ```bash
    npm run update-data
    ```

5.  **优化图片**:
    如果添加了新图片到 `public/`，请运行：
    ```bash
    node optimize_images.js
    ```

## 优化说明

-   **图片优化**: 所有 PNG/JPG 图片已转换为 WebP 格式，大幅减小体积。
-   **数据加载**: 数据通过 `build_data.js` 预处理并注入到全局 `window` 对象（兼容旧逻辑），路径自动替换为 WebP。
-   **文件清理**: 移除了未使用的归档文件和冗余的 HTML 入口。

## 部署

项目配置为输出到 `docs` 目录，可直接部署到 GitHub Pages。
