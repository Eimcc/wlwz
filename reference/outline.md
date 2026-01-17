# 虚拟人物行为日志网站 - 项目文件结构

## 文件组织结构

```
/mnt/okcomputer/output/
├── index.html              # 主页面 - 实时日志观察
├── history.html            # 历史日志页面
├── about.html              # 关于项目页面
├── main.js                 # 主要JavaScript逻辑
├── character.js            # 角色属性和行为生成器
├── weather.js              # 天气API集成和天气效果
├── resources/              # 资源文件夹
│   ├── avatar.jpg         # 角色头像图片
│   ├── bg-paper.jpg       # 纸质背景纹理
│   └── weather-icons/     # 天气图标
├── interaction.md          # 交互设计文档
├── design.md              # 设计风格指南
├── character.md           # 角色设定文档
└── outline.md             # 项目大纲（本文件）
```

## 页面功能规划

### 1. index.html - 主页面
**功能**: 实时观察和监控虚拟人物的当前活动

**主要区域**:
- **顶部导航栏**: Logo + 页面切换 + 当前时间
- **左侧角色面板**: 
  - 角色头像和基本信息
  - 当前状态显示（心情、活动、位置）
  - 性格特质可视化
  - 可展开查看详细背景
- **中央日志区域**:
  - 当前日志条目显示
  - 自动滚动更新
  - 日志内容包含时间、天气、行为、内心独白
  - 最多显示最近10条日志
- **右侧信息面板**:
  - 新乡市实时天气信息
  - 时间控制面板（实时/模拟模式）
  - 当前季节和节气
  - 角色心情变化图表

**交互功能**:
- 日志自动更新（每30秒）
- 角色信息面板可展开/收起
- 时间控制（暂停、加速、减速）
- 天气影响提示

### 2. history.html - 历史日志页面
**功能**: 浏览和分析历史行为数据

**主要区域**:
- **筛选控制面板**:
  - 日期范围选择器
  - 活动类型筛选
  - 心情状态筛选
  - 天气条件筛选
- **日志列表**:
  - 分页显示历史日志
  - 每条日志显示完整信息
  - 支持搜索功能
- **数据统计图表**:
  - 每日活动分布图
  - 心情变化趋势图
  - 天气影响分析图
  - 月度行为模式总结

**交互功能**:
- 动态筛选和搜索
- 图表交互和数据钻取
- 日志导出功能
- 统计报告生成

### 3. about.html - 关于页面
**功能**: 介绍项目概念和技术实现

**主要内容**:
- **项目介绍**:
  - 虚拟人物概念说明
  - 行为生成算法简介
  - 技术栈和实现方法
- **角色设定**:
  - 林雨晴的完整背景故事
  - 性格分析和心理特征
  - 行为模式解释
- **开发说明**:
  - 使用的API和数据源
  - 开源代码说明
  - 扩展可能性

## JavaScript模块规划

### main.js - 主控制器
**功能**:
- 页面初始化和导航控制
- 全局状态管理
- 定时器控制
- 事件监听器管理

**主要函数**:
```javascript
initApp()           // 应用初始化
updateUI()          // 界面更新
handleNavigation()  // 页面导航
setupTimers()       // 定时器设置
handleResize()      // 响应式处理
```

### character.js - 角色核心模块
**功能**:
- 角色属性管理
- 行为日志生成
- 心情和状态计算
- 性格特征应用

**主要函数**:
```javascript
Character()         // 角色类定义
generateActivity()  // 生成行为日志
calculateMood()     // 计算心情状态
applyWeatherEffect() // 应用天气影响
updateStatus()      // 更新角色状态
```

### weather.js - 天气模块
**功能**:
- 天气API调用
- 天气数据解析
- 天气效果渲染
- 地理位置信息

**主要函数**:
```javascript
getWeatherData()    // 获取天气数据
parseWeatherInfo()  // 解析天气信息
renderWeatherEffect() // 渲染天气效果
getSeasonInfo()     // 获取季节信息
```

## 数据结构设计

### 角色状态对象
```javascript
{
  name: "林雨晴",
  age: 28,
  occupation: "咖啡馆店主",
  location: "河南省新乡市",
  currentStatus: {
    mood: "平静",
    activity: "阅读",
    location: "咖啡馆",
    energy: 75,
    socialNeed: 40,
    creativity: 80
  },
  personality: {
    mbti: "INFP",
    bigFive: {
      openness: 85,
      conscientiousness: 60,
      extraversion: 35,
      agreeableness: 80,
      neuroticism: 55
    }
  }
}
```

### 日志条目结构
```javascript
{
  id: "uuid",
  timestamp: "2026-01-16T14:30:00Z",
  timeOfDay: "下午",
  weather: {
    condition: "晴天",
    temperature: 8,
    humidity: 45,
    windSpeed: 3
  },
  activity: {
    type: "创作",
    description: "在咖啡馆的角落里绘画",
    duration: 120,
    location: "雨晴小筑"
  },
  thoughts: "阳光透过窗户洒在画纸上，这样的时光总是那么美好...",
  mood: {
    primary: "愉悦",
    intensity: 7,
    factors: ["好天气", "创作灵感"]
  },
  socialInteraction: null,
  energyLevel: 75
}
```

### 天气数据结构
```javascript
{
  city: "新乡市",
  temperature: 8,
  feelsLike: 6,
  condition: "晴",
  humidity: 45,
  windSpeed: 3.2,
  windDirection: "东北风",
  pressure: 1013,
  visibility: 10,
  uvIndex: 3,
  airQuality: "良"
}
```

## 技术实现要点

### 响应式设计
- 使用Tailwind CSS网格系统
- 断点设置: sm(640px), md(768px), lg(1024px), xl(1280px)
- 移动端优化：触摸友好的交互元素

### 性能优化
- 图片懒加载和压缩
- JavaScript代码分割
- CSS和JS文件压缩
- 使用Web Workers处理数据计算

### 数据持久化
- 使用localStorage保存历史日志
- 定期清理过期数据（保留最近30天）
- 导出功能支持JSON格式

### 动画和效果
- 使用requestAnimationFrame优化动画
- CSS transform3d加速渲染
- 避免引起重排的CSS属性

### 错误处理
- API调用失败时的降级方案
- 网络断开时的离线模式
- 数据验证和异常捕获

## 开发时间线

1. **第一阶段**: 创建基础页面结构和样式
2. **第二阶段**: 实现角色系统和日志生成器
3. **第三阶段**: 集成天气API和实时更新
4. **第四阶段**: 添加历史页面和数据分析
5. **第五阶段**: 优化动画效果和用户体验
6. **第六阶段**: 测试、调试和部署

这个项目将创造一个独特而有趣的数字体验，让用户能够观察和理解一个虚拟人物的内在世界，同时探索技术与人性的交集。