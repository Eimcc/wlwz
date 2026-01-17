/**
 * 虚拟人物角色核心模块
 * 包含角色属性、行为生成算法、心情计算等功能
 */

// 角色类定义
class Character {
    constructor() {
        // 基本信息
        this.name = "林雨晴";
        this.age = 28;
        this.occupation = "咖啡馆店主";
        this.location = "河南省新乡市";
        
        // 性格特质 (MBTI和大五人格)
        this.personality = {
            mbti: "INFP",
            bigFive: {
                openness: 85,      // 开放性 - 极具想象力
                conscientiousness: 60, // 尽责性 - 中等自律
                extraversion: 35,    // 外向性 - 内向倾向
                agreeableness: 80,   // 宜人性 - 富有同情心
                neuroticism: 55      // 神经质 - 中等敏感
            }
        };
        
        // 核心价值观
        this.coreValues = ["真实性", "创造力", "连接", "自由", "成长", "美", "独处"];
        
        // 当前状态
        this.currentStatus = {
            mood: "平静",
            activity: "阅读",
            location: "雨晴小筑",
            energy: 75,
            socialNeed: 40,
            creativity: 80,
            lastUpdate: new Date()
        };
        
        // 活动类型和权重 (基于INFP性格特征)
        this.activities = {
            // 创作类活动 (高权重，符合INFP特质)
            creative: [
                { name: "绘画水彩画", weight: 25, location: "雨晴小筑", energy: -10, creativity: +20 },
                { name: "写随笔日记", weight: 20, location: "雨晴小筑", energy: -5, creativity: +15 },
                { name: "阅读诗歌集", weight: 18, location: "雨晴小筑", energy: +5, creativity: +10 },
                { name: "设计插画", weight: 15, location: "雨晴小筑", energy: -15, creativity: +25 },
                { name: "拍摄照片", weight: 12, location: "户外", energy: -10, creativity: +15 },
                { name: "练习书法", weight: 10, location: "雨晴小筑", energy: -5, creativity: +10 }
            ],
            
            // 工作类活动
            work: [
                { name: "准备咖啡", weight: 30, location: "雨晴小筑", energy: -10, socialNeed: +10 },
                { name: "整理店面", weight: 20, location: "雨晴小筑", energy: -15, conscientiousness: +5 },
                { name: "接待顾客", weight: 25, location: "雨晴小筑", energy: -15, socialNeed: +15 },
                { name: "采购原料", weight: 15, location: "市场", energy: -20, conscientiousness: +10 },
                { name: "财务记账", weight: 10, location: "雨晴小筑", energy: -10, conscientiousness: +15 }
            ],
            
            // 个人活动
            personal: [
                { name: "冥想思考", weight: 20, location: "雨晴小筑", energy: +15, mood: +10 },
                { name: "浇花养草", weight: 15, location: "阳台", energy: +5, mood: +5 },
                { name: "听音乐", weight: 18, location: "雨晴小筑", energy: +10, mood: +8 },
                { name: "泡茶品茗", weight: 16, location: "雨晴小筑", energy: +8, mood: +12 },
                { name: "散步", weight: 12, location: "公园", energy: +5, mood: +15 },
                { name: "烹饪美食", weight: 10, location: "家中", energy: -10, mood: +10 }
            ],
            
            // 社交活动 (权重较低，符合内向特质)
            social: [
                { name: "与熟客聊天", weight: 8, location: "雨晴小筑", energy: -10, socialNeed: +20 },
                { name: "与朋友通话", weight: 6, location: "雨晴小筑", energy: -5, socialNeed: +15 },
                { name: "参加小聚", weight: 4, location: "朋友家", energy: -20, socialNeed: +25 },
                { name: "家庭聚会", weight: 5, location: "父母家", energy: -15, socialNeed: +20 }
            ]
        };
        
        // 心情类型和对应的天气偏好
        this.moods = {
            happy: {
                states: ["愉悦", "兴奋", "满足", "欣喜"],
                weatherBonus: ["晴", "多云"],
                activityBonus: ["creative", "personal"]
            },
            calm: {
                states: ["平静", "安详", "放松", "舒适"],
                weatherBonus: ["多云", "阴"],
                activityBonus: ["personal", "creative"]
            },
            thoughtful: {
                states: ["沉思", "忧郁", "敏感", "内省"],
                weatherBonus: ["雨", "雪", "阴"],
                activityBonus: ["creative", "personal"]
            },
            tired: {
                states: ["疲惫", "倦怠", "无力", "沉闷"],
                weatherBonus: ["阴", "雨"],
                activityBonus: ["personal"]
            },
            anxious: {
                states: ["焦虑", "不安", "紧张", "烦躁"],
                weatherBonus: ["雷雨", "大风"],
                activityBonus: ["personal"]
            }
        };
        
        // 时间偏好 (基于性格特征)
        this.timePreferences = {
            morning: {    // 6:00-12:00
                preferred: ["personal", "creative"],
                avoided: ["social", "work"],
                energy: 60,
                mood: "平静"
            },
            afternoon: {  // 12:00-18:00
                preferred: ["work", "creative"],
                avoided: ["social"],
                energy: 80,
                mood: "专注"
            },
            evening: {    // 18:00-22:00
                preferred: ["personal", "social"],
                avoided: ["work"],
                energy: 50,
                mood: "放松"
            },
            night: {      // 22:00-6:00
                preferred: ["personal", "creative"],
                avoided: ["work", "social"],
                energy: 30,
                mood: "内省"
            }
        };
        
        // 天气影响矩阵
        this.weatherEffects = {
            "晴": { mood: +15, energy: +10, activity: "outdoor" },
            "多云": { mood: +5, energy: 0, activity: "indoor" },
            "阴": { mood: -5, energy: -5, activity: "indoor" },
            "雨": { mood: +10, energy: -5, activity: "creative" },
            "雪": { mood: +20, energy: 0, activity: "personal" },
            "雷雨": { mood: -10, energy: -10, activity: "indoor" },
            "大风": { mood: -5, energy: -5, activity: "indoor" },
            "雾": { mood: -15, energy: -10, activity: "indoor" }
        };
    }
    
    /**
     * 根据时间、天气和当前状态生成行为日志
     * @param {Object} weather - 天气信息
     * @param {Date} time - 当前时间
     * @returns {Object} 生成的日志条目
     */
    generateActivityLog(weather, time = new Date()) {
        const timeOfDay = this.getTimeOfDay(time);
        const timePref = this.timePreferences[timeOfDay];
        
        // 根据时间和天气计算活动概率
        let activityPool = [];
        
        // 添加偏好的活动类型
        timePref.preferred.forEach(type => {
            this.activities[type].forEach(activity => {
                let weight = activity.weight;
                
                // 天气影响
                if (weather && this.weatherEffects[weather.condition]) {
                    const weatherEffect = this.weatherEffects[weather.condition];
                    if (weatherEffect.activity === "outdoor" && activity.location === "户外") {
                        weight *= 1.5;
                    } else if (weatherEffect.activity === "indoor" && activity.location !== "户外") {
                        weight *= 1.3;
                    } else if (weatherEffect.activity === "creative" && type === "creative") {
                        weight *= 1.4;
                    }
                }
                
                // 能量影响
                if (this.currentStatus.energy < 30 && activity.energy < 0) {
                    weight *= 0.5; // 低能量时减少耗能活动
                }
                
                activityPool.push({...activity, type, weight});
            });
        });
        
        // 随机选择活动 (加权随机)
        const selectedActivity = this.weightedRandomSelect(activityPool);
        
        // 生成心情状态
        const mood = this.calculateMood(weather, selectedActivity, timeOfDay);
        
        // 生成内心独白
        const thoughts = this.generateThoughts(selectedActivity, weather, mood, timeOfDay);
        
        // 更新角色状态
        this.updateStatus(selectedActivity, mood, weather);
        
        // 返回日志对象
        return {
            id: this.generateId(),
            timestamp: time.toISOString(),
            timeOfDay: timeOfDay,
            timeString: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            weather: weather ? {
                condition: weather.condition,
                temperature: weather.temperature,
                humidity: weather.humidity
            } : null,
            activity: {
                type: selectedActivity.type,
                name: selectedActivity.name,
                description: this.generateActivityDescription(selectedActivity, weather),
                location: selectedActivity.location,
                duration: Math.floor(Math.random() * 60) + 30 // 30-90分钟
            },
            thoughts: thoughts,
            mood: {
                primary: mood,
                intensity: Math.floor(Math.random() * 5) + 6, // 6-10强度
                factors: this.getMoodFactors(weather, selectedActivity)
            },
            energyChange: selectedActivity.energy || 0,
            socialInteraction: selectedActivity.type === 'social' ? {
                type: 'conversation',
                satisfaction: Math.floor(Math.random() * 5) + 5
            } : null
        };
    }
    
    /**
     * 根据时间获取时间段
     */
    getTimeOfDay(time) {
        const hour = time.getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }
    
    /**
     * 加权随机选择
     */
    weightedRandomSelect(items) {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of items) {
            random -= item.weight;
            if (random <= 0) {
                return item;
            }
        }
        
        return items[items.length - 1];
    }
    
    /**
     * 计算心情状态
     */
    calculateMood(weather, activity, timeOfDay) {
        let moodPool = [];
        
        // 基础心情 (基于性格)
        if (activity.type === 'creative') {
            moodPool.push('thoughtful', 'calm', 'happy');
        } else if (activity.type === 'personal') {
            moodPool.push('calm', 'thoughtful');
        } else if (activity.type === 'work') {
            moodPool.push('calm', 'focused');
        } else if (activity.type === 'social') {
            moodPool.push('happy', 'calm');
        }
        
        // 天气影响
        if (weather && this.weatherEffects[weather.condition]) {
            const weatherEffect = this.weatherEffects[weather.condition];
            if (weatherEffect.mood > 0) {
                moodPool.push('happy', 'calm');
            } else if (weatherEffect.mood < 0) {
                moodPool.push('thoughtful', 'tired');
            }
        }
        
        // 时间影响
        if (timeOfDay === 'morning') {
            moodPool.push('calm', 'thoughtful');
        } else if (timeOfDay === 'evening' || timeOfDay === 'night') {
            moodPool.push('thoughtful', 'calm');
        }
        
        // 随机选择
        const selectedMood = moodPool[Math.floor(Math.random() * moodPool.length)];
        
        // 映射到具体的中文状态
        const moodMap = {
            'happy': ['愉悦', '兴奋', '满足', '欣喜'],
            'calm': ['平静', '安详', '放松', '舒适'],
            'thoughtful': ['沉思', '忧郁', '敏感', '内省'],
            'tired': ['疲惫', '倦怠', '无力', '沉闷'],
            'focused': ['专注', '投入', '认真', '严谨']
        };
        
        const moodStates = moodMap[selectedMood] || moodMap['calm'];
        return moodStates[Math.floor(Math.random() * moodStates.length)];
    }
    
    /**
     * 生成活动描述
     */
    generateActivityDescription(activity, weather) {
        const descriptions = {
            '绘画水彩画': [
                '阳光透过窗户洒在画纸上，她专注地调配着色彩',
                '在柔和的灯光下，她用画笔捕捉内心的情感',
                '水彩在纸上渐渐晕染开来，就像她此刻的心情'
            ],
            '写随笔日记': [
                '她坐在窗边，笔尖在纸上轻轻滑动',
                '文字如流水般倾泻而出，记录着生活的点滴',
                '日记本翻到新的一页，她开始记录今天的感悟'
            ],
            '阅读诗歌集': [
                '手捧诗集，她沉浸在诗意的美好中',
                '诗句在她心中激起层层涟漪',
                '她轻声诵读着喜爱的诗篇，感受文字的韵律'
            ],
            '准备咖啡': [
                '咖啡的香气弥漫在整个空间里',
                '她熟练地操作着咖啡机，为客人准备饮品',
                '磨豆机发出轻柔的声响，新的一天开始了'
            ],
            '冥想思考': [
                '她闭上眼睛，让思绪在宁静中流淌',
                '深呼吸，感受着内心的平静',
                '在独处中，她与自己的灵魂对话'
            ]
        };
        
        const activityDescriptions = descriptions[activity.name];
        if (activityDescriptions) {
            return activityDescriptions[Math.floor(Math.random() * activityDescriptions.length)];
        }
        
        return `她正在${activity.name}`;
    }
    
    /**
     * 生成内心独白
     */
    generateThoughts(activity, weather, mood, timeOfDay) {
        const thoughtTemplates = {
            creative: [
                '创作的灵感总是在不经意间涌现',
                '艺术让我看到了生活中隐藏的美好',
                '每一笔每一画都是内心世界的表达',
                '在创作中，我找到了真正的自己'
            ],
            personal: [
                '独处的时候，才能真正听见内心的声音',
                '生活需要慢下来，才能品味其中的美好',
                '有时候，沉默比言语更有力量',
                '在平凡的日子里，寻找不平凡的意义'
            ],
            work: [
                '经营咖啡馆不仅是工作，更是生活方式',
                '每一个顾客都有自己的故事',
                '用心做好每一件事，就是对生活的尊重',
                '简单的事情重复做，就是不简单'
            ],
            social: [
                '与人交流让我看到了不同的世界',
                '真诚的对话总能触动心灵',
                '朋友不在多，知心就好',
                '倾听，是最好的陪伴'
            ]
        };
        
        const templates = thoughtTemplates[activity.type] || thoughtTemplates.personal;
        let thought = templates[Math.floor(Math.random() * templates.length)];
        
        // 根据天气调整
        if (weather) {
            if (weather.condition === '雨') {
                thought += ' 雨天总能让人的心沉静下来。';
            } else if (weather.condition === '晴') {
                thought += ' 阳光总是那么治愈人心。';
            } else if (weather.condition === '雪') {
                thought += ' 雪花飘落的样子真美。';
            }
        }
        
        return thought;
    }
    
    /**
     * 获取心情影响因素
     */
    getMoodFactors(weather, activity) {
        const factors = [];
        
        if (weather) {
            if (this.weatherEffects[weather.condition] && this.weatherEffects[weather.condition].mood > 0) {
                factors.push("好天气");
            } else if (this.weatherEffects[weather.condition] && this.weatherEffects[weather.condition].mood < 0) {
                factors.push("天气影响");
            }
        }
        
        if (activity.type === 'creative') {
            factors.push("创作灵感");
        } else if (activity.type === 'social') {
            factors.push("社交互动");
        } else if (activity.type === 'work') {
            factors.push("工作成就");
        }
        
        return factors;
    }
    
    /**
     * 更新角色状态
     */
    updateStatus(activity, mood, weather) {
        // 更新当前活动
        this.currentStatus.activity = activity.name;
        this.currentStatus.location = activity.location;
        this.currentStatus.mood = mood;
        
        // 更新能量
        if (activity.energy) {
            this.currentStatus.energy = Math.max(0, Math.min(100, 
                this.currentStatus.energy + activity.energy));
        }
        
        // 更新社交需求
        if (activity.type === 'social') {
            this.currentStatus.socialNeed = Math.max(0, this.currentStatus.socialNeed - 15);
        } else {
            this.currentStatus.socialNeed = Math.min(100, this.currentStatus.socialNeed + 2);
        }
        
        // 更新创造力
        if (activity.type === 'creative') {
            this.currentStatus.creativity = Math.max(0, Math.min(100, 
                this.currentStatus.creativity + (activity.creativity || 10)));
        } else {
            this.currentStatus.creativity = Math.max(0, this.currentStatus.creativity - 1);
        }
        
        this.currentStatus.lastUpdate = new Date();
    }
    
    /**
     * 生成唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    /**
     * 获取角色当前状态
     */
    getCurrentStatus() {
        return { ...this.currentStatus };
    }
    
    /**
     * 获取角色统计信息
     */
    getStats() {
        return {
            totalLogs: 0, // 将在主模块中更新
            todayLogs: 0,
            mainActivity: this.currentStatus.activity,
            socialCount: 0,
            moodTrends: [],
            activityDistribution: {}
        };
    }
}

// 导出角色类
window.Character = Character;