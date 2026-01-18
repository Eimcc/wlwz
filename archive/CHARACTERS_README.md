# 人物管理系统文档

本文档详细介绍了本项目的人物管理系统，包括文件结构、添加人物的方法、数据字段说明以及常见问题解决。

## 1. 文件结构示意图

本项目采用标准化的目录结构来管理人物数据，位于根目录下的 `characters/` 文件夹中。

```
wlwz/
├── characters/
│   ├── avatars/              # 存放人物头像图片 (.png, .jpg)
│   ├── data/                 # 存放人物 JSON 数据文件 (每个文件代表一个人物)
│   ├── events/               # 存放通用事件 JSON
│   └── templates/
│       └── character_template.json  # 标准人物数据模板
├── resources/
│   ├── characters-data.js    # [自动生成] 前端使用的聚合数据脚本
│   └── characters.json       # [自动生成] 聚合的 JSON 数据文件
├── services/
│   └── characterService.js   # 前端数据服务层
├── add_character.js          # [工具] 交互式添加人物脚本
├── build_data.js             # [工具] 统一生成人物与事件数据
└── archive/
    ├── CHARACTERS_README.md  # 本文档与归档脚本
    └── update_script.js      # 旧版数据同步脚本示例
```

## 2. 人物添加操作指南

您可以通过以下两种方式添加新人物：

### 方法一：使用交互式命令行工具 (推荐)

我们提供了一个简单的命令行工具来引导您完成创建过程。

1. 打开终端 (Terminal)。
2. 运行以下命令：
   ```bash
   node add_character.js
   ```
3. 按照提示输入人物的基本信息 (姓名、ID、职业、阵营、描述)。
   - ID 如果留空，将自动根据姓名生成。
4. 脚本会自动在 `characters/data/` 下生成对应的 JSON 文件。
5. **重要**：添加完成后，请运行同步脚本以更新前端数据 (见下文)。

### 方法二：手动创建

1. 复制 `characters/templates/character_template.json` 文件。
2. 将副本重命名为 `[人物ID].json` (例如 `bai-zhantang.json`)。
3. 将文件移动到 `characters/data/` 目录下。
4. 使用文本编辑器打开并填写详细信息。
5. 将人物头像图片放入 `characters/avatars/` 目录，并在 JSON 中更新 `avatar` 字段路径。

### 数据同步（当前推荐）

无论使用哪种方式，添加或修改人物或事件数据后，都需要更新前端资源文件。

**标准同步方式：**
```bash
npm run update-data
```

该命令会调用根目录下的 `build_data.js`，生成/更新 `resources/characters-data.js` 和 `resources/characters.json`。

如果你更习惯直接运行 Node，也可以使用：

```bash
node build_data.js
```

如需监听模式（开发时自动同步），可以执行：

```bash
node build_data.js --watch
```

## 3. 数据字段说明

每个人物的 JSON 文件包含以下核心字段：

| 字段名 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `id` | String | **唯一标识符**，用于URL和内部引用 | `"tong-xiangyu"` |
| `name` | String | 显示名称 | `"佟湘玉"` |
| `aliases` | Array | 别名/绰号列表 | `["佟掌柜", "湘玉"]` |
| `faction` | String | 所属势力/门派 | `"同福客栈"` |
| `occupation` | String | 职业/身份 | `"掌柜"` |
| `martialArts` | Array | 武功招式 | `["移魂大法"]` |
| `avatar` | String | 头像路径 (相对于项目根目录) | `"characters/avatars/tong.png"` |
| `description` | String | 人物简介 | `"同福客栈老板娘..."` |
| `quote` | String | 经典台词 | `"额滴神啊！"` |
| `category` | String | 分类 (tongfu, official, jianghu, family) | `"tongfu"` |
| `personality` | Object | 性格雷达图数据 | `{ "traits": { "善良": 80 ... } }` |
| `relationships` | Array | 人际关系列表 | `[{ "target": "bai-zhantang", "type": "love" ... }]` |
| `timeline` | Array | 生平大事记 | `[{ "year": "...", "event": "..." }]` |

## 4. 部署与更新使用方法

人物数据最终会通过 GitHub Pages 部署到线上网站（例如 `https://Eimcc.github.io/wlwz/`）。推荐的完整更新流程如下：

1. 在本地添加或修改人物  
   - 按 “2. 人物添加操作指南” 中的方法修改 `characters/data/*.json`。  
   - 如有需要，更新头像等资源。

2. 同步聚合数据  
   在项目根目录执行：
   ```bash
   npm run update-data
   ```
   该命令会运行 `build_data.js`，生成/更新 `resources/characters-data.js` 和 `resources/characters.json`，供前端使用。

3. 构建前端站点  
   ```bash
   npm run build
   ```
   Vite 会根据 `vite.config.ts` 将网站打包到 `docs/` 目录，用于 GitHub Pages 部署。

4. 提交并推送到 GitHub  
   ```bash
   git add .
   git commit -m "Update characters"
   git push
   ```
   推送到 `main` 分支后，GitHub Pages 会自动从 `docs/` 目录重新部署网站。

只要按照 “添加/修改人物 → `update_script` 同步 → `npm run build` 构建 → `git push` 发布” 这个顺序，线上人物图鉴就会保持最新。

## 5. 常见问题解决方法

### Q1: 添加了人物但网页上不显示？
**A:** 请确认您是否运行了 `npm run update-data`。前端读取的是 `resources/characters-data.js`，该文件需要通过脚本生成。

### Q2: 人物详情页显示 "Character not found"？
**A:** 
1. 检查 URL 中的 ID 是否与 JSON 文件中的 `id` 字段一致。
2. 确认 `resources/characters-data.js` 已更新（必要时重新执行 `npm run update-data`）。
3. 检查浏览器控制台是否有错误信息。

### Q3: 头像无法显示？
**A:** 
1. 确认图片文件已放入 `characters/avatars/` 目录。
2. 确认 JSON 中的 `avatar` 路径正确 (应为相对路径，如 `characters/avatars/xxx.png`)。
3. 注意文件名大小写敏感。

### Q4: 中文乱码或 JSON 解析错误？
**A:** 
1. 请确保 JSON 文件使用 **UTF-8** 编码保存。
2. JSON 格式必须严格（属性名用双引号，不能有多余逗号）。

### Q5: 监听模式 (`--watch`) 没有反应？
**A:** 监听模式依赖于文件系统事件。某些编辑器保存文件时可能会使用"原子保存"（先创建临时文件再重命名），这有时会导致监听器失效。如果遇到此问题，请尝试重新启动脚本，或直接运行一次 `npm run update-data` 进行手动更新。

## 6. 事件系统与数据更新新方法（当前项目用法）

本项目现在支持通过 JSON 文件管理“日常事件”和“角色专属事件”，并通过统一脚本生成前端可用的数据。

### 6.1 事件文件位置

- 通用事件：放在 `characters/events/` 目录下，文件格式为 `.json`。
- 角色专属事件：直接写在对应人物 JSON 中的 `events` 字段内，例如：

```json
"events": [
    {
        "id": "bai_practice_point",
        "title": "偷偷练习点穴",
        "detail": "{name} 趁大堂没人注意，对着空气比划了两下“葵花点穴手”，确认手生没生。",
        "location": "大堂角落",
        "type": "personal",
        "baseWeight": 20,
        "conditions": {
            "timeOfDay": ["afternoon", "evening"]
        }
    }
]
```

常用条件字段（可选）：

- `timeOfDay`: `"morning"`, `"afternoon"`, `"evening"`, `"night"`
- `weather`: `"sunny"`, `"rainy"`, `"cloudy"`, `"snowy"`
- `occupation`: 字符串或字符串数组，如 `"厨子"` 或 `["捕快", "捕头"]`
- `identity`: 根据人物 `identity` 中的标签做包含匹配，如 `"爱财如命"`
- `characterId`: 限制只对某些人物 ID 生效

事件文案中可以使用 `{name}`，运行时会自动替换成人物名字。

### 6.2 数据生成与同步命令

每次修改 `characters/data/*.json` 或 `characters/events/*.json` 后，执行：

```bash
npm run update-data
```

该命令会运行 `build_data.js`，自动：

- 聚合人物数据为 `resources/characters.json`
- 生成前端使用的 `resources/characters-data.js`
- 在浏览器中通过 `window.charactersData` 和 `window.eventsData` 访问

之后如需部署到线上，仍然按原流程执行：

```bash
npm run build
git add .
git commit -m "Update characters and events"
git push
```

简单记忆流程：

> 改人物或事件 JSON → `npm run update-data` → `npm run build` → `git push`
