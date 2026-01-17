# 武林外传人物图鉴网站项目大纲

## 项目结构（当前实现）

当前网站基于 React + TypeScript + Vite 构建，并通过 GitHub Pages 部署。

```text
wlwz/
├── index.html                 # Vite 入口 HTML（挂载 React 应用）
├── docs/                      # Vite 构建输出目录，用于 GitHub Pages 部署
├── src/                       # 前端源码（React + TypeScript）
│   ├── main.tsx               # 应用入口，挂载 <App />
│   ├── App.tsx                # 路由配置与整体结构
│   ├── pages/
│   │   └── Home.tsx           # 主页（当前实际页面）
│   ├── components/            # 通用 UI 组件
│   ├── hooks/                 # 自定义 Hook
│   ├── lib/                   # 工具函数
│   └── index.css              # 全局样式（基于 Tailwind 等）
├── characters/                # 人物原始数据与模板
│   ├── avatars/               # 人物头像图片
│   ├── data/                  # 每个角色一个 JSON 数据文件
│   └── templates/             # 人物数据模板
├── resources/                 # 由脚本生成的聚合数据
│   ├── characters-data.js     # 前端使用的聚合脚本
│   └── characters.json        # 聚合的 JSON 数据
├── services/
│   └── characterService.js    # 人物数据服务层
├── add_character.js           # 交互式添加人物脚本
├── update_script.js           # 同步 characters -> resources 的脚本
└── CHARACTERS_README.md       # 人物系统使用说明
```

> 说明：未来会在 `src/pages/` 中继续增加人物详情页、关系图谱页、行为预测页等页面，通过 React Router 实现单页应用的多页面导航。

## 页面与路由功能概览

当前网站采用单页应用结构，通过 React Router 在前端处理路由。随着开发推进，会逐步实现以下几个核心页面。

### 1. 首页 Home（路径 `/`）

**功能（目标）**: 网站入口，提供人物搜索和快速浏览
**内容结构**:
- 导航栏: 网站logo、搜索框、主要功能导航
- 英雄区域: 同福客栈场景展示，配合经典台词
- 人物搜索区: 
  - 智能搜索框（支持拼音、汉字、绰号）
  - 筛选器（门派、职业、阵营）
  - 搜索结果网格展示
- 热门角色推荐: 轮播展示主要角色
- 网站功能介绍: 四大核心功能展示

**交互功能**:
- 实时搜索建议
- 角色卡片悬停效果
- 筛选器动态更新
- 轮播图自动播放

> 当前实现状态：`Home.tsx` 已创建，为功能承载容器，后续会逐步接入以上模块。

### 2. 人物详情页（规划路由，如 `/characters/:id`）

**功能**: 展示单个角色的完整信息
**内容结构**:
- 角色基本信息区:
  - 头像和姓名
  - 门派和武功
  - 经典台词
- 性格画像区:
  - 性格特点雷达图
  - 兴趣爱好标签
  - 优缺点分析
- 人物经历区:
  - 主要剧情节点
  - 武功成长历程
  - 重要关系变化
- 相关推荐区:
  - 关联角色推荐
  - 相关剧情推荐
  - 衍生内容推荐

**交互功能**:
- 性格雷达图动画展示
- 剧情时间轴交互
- 语音台词播放
- 关系跳转链接

### 3. 关系图谱页（规划路由，如 `/relations`）

**功能**: 可视化展示人物关系网络
**内容结构**:
- 图谱控制区:
  - 关系类型筛选
  - 布局模式切换
  - 搜索定位功能
- 关系网络图:
  - 力导向图展示
  - 节点和连线的交互
  - 详细信息弹窗
- 关系统计区:
  - 关系类型统计
  - 重要关系排行
  - 关系变化分析

**交互功能**:
- 节点拖拽和缩放
- 关系筛选和聚焦
- 动态布局调整
- 关系详情查看

### 4. 行为预测页（规划路由，如 `/activities`）

**功能**: 基于角色性格的智能行为预测
**内容结构**:
- 预测控制区:
  - 季节选择器
  - 时间段选择器
  - 天气条件设置
- 行为预测结果:
  - 可能的活动列表
  - 活动地点推荐
  - 互动对象预测
- 活动日志:
  - 详细活动描述
  - 情感状态分析
  - 相关道具需求
- 衍生内容区:
  - 相关道具展示
  - 场景建筑介绍
  - 剧情发展预测

**交互功能**:
- 多维度条件筛选
- 预测结果动画展示
- 活动详情展开
- 时间轴滚动查看

### 5. 其他页面与占位路由

- `/other`：当前在 `App.tsx` 中存在的占位页面，用于后续扩展新功能或调试。

## 前端功能模块（当前技术栈）

### React 应用结构

1. **应用入口 (`src/main.tsx`)**
   - 使用 `ReactDOM.createRoot` 挂载应用。
   - 引入全局样式 `index.css`。

2. **路由与布局 (`src/App.tsx`)**
   - 使用 `react-router-dom` 提供的 `BrowserRouter`、`Routes`、`Route` 配置前端路由。
   - 当前已配置：
     - `/` → `Home` 页面
     - `/other` → 占位页面
   - 通过 `basename` 适配 GitHub Pages 的 `/wlwz/` 子路径。

3. **页面与组件**
   - `src/pages/Home.tsx`：主页容器组件，后续承载人物搜索与展示。
   - `src/components/`：通用 UI 组件（卡片、布局、控件等）。
   - `src/hooks/`：自定义 Hook（状态管理、主题切换等）。
   - `src/lib/`：工具函数（字符串处理、数据转换等）。

### 人物数据相关模块

1. **原始数据与模板**
   - `characters/data/*.json`：单个人物的完整配置（见 `CHARACTERS_README.md`）。
   - `characters/avatars/`：人物头像资源。
   - `characters/templates/`：标准人物数据模板。

2. **数据同步与聚合**
   - `add_character.js`：交互式命令行工具，创建新人物 JSON。
   - `update_script.js`：将 `characters/data` 聚合并生成：
     - `resources/characters.json`
     - `resources/characters-data.js`

3. **前端数据访问**
   - `services/characterService.js`：封装人物数据的读取、查询与过滤逻辑，为 React 组件提供统一的数据接口。

## 数据结构设计

### 角色数据模型
```javascript
{
  id: "character_001",
  name: "佟湘玉",
  aliases: ["佟掌柜", "玉美人"],
  faction: "龙门镖局",
  occupation: "客栈掌柜",
  martialArts: [],
  personality: {
    traits: ["抠门", "善良", "唠叨"],
    scores: { kindness: 80, greed: 70, wisdom: 85 }
  },
  relationships: [
    { target: "character_002", type: "爱情", strength: 90 }
  ],
  activities: {
    spring: [{ time: "morning", activity: "算账", location: "客栈大堂" }]
  }
}
```

### 关系数据模型
```javascript
{
  source: "character_001",
  target: "character_002", 
  type: "爱情",
  strength: 90,
  description: "相知相守的恋人",
  timeline: [
    { episode: 1, event: "初次相遇", relationshipChange: 10 }
  ]
}
```

## 技术实现要点

### 响应式设计
- 使用Tailwind CSS实现响应式布局
- 移动端优化的触摸交互
- 不同屏幕尺寸的内容适配

### 性能优化
- 图片懒加载和压缩
- 数据分页加载
- 动画性能优化
- 缓存策略实施

### 用户体验
- 加载状态指示
- 错误处理和反馈
- 无障碍访问支持
- 浏览器兼容性保证

这个项目将创造一个功能丰富、视觉精美的武林外传人物图鉴网站，为用户提供沉浸式的江湖世界体验。
