/**
 * 天气模块
 * 处理天气API调用、数据解析和天气效果渲染
 */

class WeatherManager {
    constructor() {
        this.apiKey = 'YOUR_API_KEY'; // 实际使用时需要替换为真实的API密钥
        this.city = '新乡市';
        this.province = '河南省';
        this.latitude = 35.3030;  // 新乡市纬度
        this.longitude = 113.9260; // 新乡市经度
        
        // 模拟天气数据 (用于演示)
        this.mockWeatherData = {
            '晴': { temp: 8, humidity: 45, windSpeed: 3, icon: '☀️' },
            '多云': { temp: 6, humidity: 55, windSpeed: 4, icon: '⛅' },
            '阴': { temp: 4, humidity: 65, windSpeed: 2, icon: '☁️' },
            '雨': { temp: 3, humidity: 80, windSpeed: 5, icon: '🌧️' },
            '雪': { temp: -2, humidity: 70, windSpeed: 3, icon: '❄️' }
        };
        
        this.currentWeather = null;
        this.weatherHistory = [];
        this.updateInterval = 30 * 60 * 1000; // 30分钟更新一次
        
        // 季节信息
        this.seasons = {
            0: '冬季', 1: '冬季', 2: '春季', 
            3: '春季', 4: '春季', 5: '夏季',
            6: '夏季', 7: '夏季', 8: '秋季',
            9: '秋季', 10: '秋季', 11: '冬季'
        };
        
        // 二十四节气 (简化版本)
        this.solarTerms = {
            0: '小寒', 1: '大寒', 2: '立春', 3: '雨水',
            4: '惊蛰', 5: '春分', 6: '清明', 7: '谷雨',
            8: '立夏', 9: '小满', 10: '芒种', 11: '夏至',
            12: '小暑', 13: '大暑', 14: '立秋', 15: '处暑',
            16: '白露', 17: '秋分', 18: '寒露', 19: '霜降',
            20: '立冬', 21: '小雪', 22: '大雪', 23: '冬至'
        };
    }
    
    /**
     * 初始化天气管理器
     */
    async init() {
        try {
            await this.updateWeather();
            this.startAutoUpdate();
            console.log('天气管理器初始化完成');
        } catch (error) {
            console.warn('天气数据获取失败，使用模拟数据:', error);
            this.useMockData();
        }
    }
    
    /**
     * 获取当前天气数据
     */
    async updateWeather() {
        try {
            // 由于API密钥限制，这里使用模拟数据
            // 实际使用时，可以接入真实的天气API
            this.currentWeather = this.generateMockWeather();
            this.weatherHistory.push({
                ...this.currentWeather,
                timestamp: new Date()
            });
            
            // 限制历史记录数量
            if (this.weatherHistory.length > 48) {
                this.weatherHistory = this.weatherHistory.slice(-48);
            }
            
            return this.currentWeather;
        } catch (error) {
            console.error('获取天气数据失败:', error);
            throw error;
        }
    }
    
    /**
     * 生成模拟天气数据
     * 基于新乡市的真实气候特点
     */
    generateMockWeather() {
        const now = new Date();
        const month = now.getMonth(); // 0-11
        const hour = now.getHours(); // 0-23
        
        // 根据季节和时间生成合理的天气
        let possibleConditions = [];
        let temperature = 0;
        
        // 季节温度范围 (新乡市气候特点)
        if (month >= 11 || month <= 1) { // 冬季 (12月-2月)
            possibleConditions = ['晴', '多云', '阴', '雪'];
            temperature = this.randomInRange(-5, 8);
        } else if (month >= 2 && month <= 4) { // 春季 (3-5月)
            possibleConditions = ['晴', '多云', '阴', '雨'];
            temperature = this.randomInRange(5, 25);
        } else if (month >= 5 && month <= 7) { // 夏季 (6-8月)
            possibleConditions = ['晴', '多云', '阴', '雨'];
            temperature = this.randomInRange(20, 35);
        } else { // 秋季 (9-11月)
            possibleConditions = ['晴', '多云', '阴', '雨'];
            temperature = this.randomInRange(8, 22);
        }
        
        // 根据当前时间调整温度 (早晚温差)
        if (hour < 6 || hour > 20) {
            temperature -= 3; // 夜间温度降低
        } else if (hour >= 10 && hour <= 16) {
            temperature += 2; // 午后温度升高
        }
        
        // 随机选择天气状况
        const condition = possibleConditions[Math.floor(Math.random() * possibleConditions.length)];
        
        // 获取天气模板数据
        const template = this.mockWeatherData[condition] || this.mockWeatherData['晴'];
        
        // 添加随机变化
        const finalTemp = temperature + this.randomInRange(-2, 2);
        const humidity = Math.max(30, Math.min(95, template.humidity + this.randomInRange(-10, 15)));
        const windSpeed = Math.max(1, template.windSpeed + this.randomInRange(-1, 3));
        
        // 计算体感温度
        const feelsLike = this.calculateFeelsLike(finalTemp, windSpeed, humidity);
        
        // 空气质量
        const airQuality = this.calculateAirQuality(condition, windSpeed);
        
        return {
            city: this.city,
            condition: condition,
            temperature: Math.round(finalTemp),
            feelsLike: Math.round(feelsLike),
            humidity: Math.round(humidity),
            windSpeed: Math.round(windSpeed * 10) / 10,
            windDirection: this.getWindDirection(),
            pressure: 1013 + this.randomInRange(-10, 15), // 气压 (hPa)
            visibility: condition === '雾' ? this.randomInRange(1, 5) : this.randomInRange(8, 20), // 能见度 (km)
            uvIndex: condition === '晴' ? this.randomInRange(3, 7) : this.randomInRange(1, 3), // 紫外线指数
            airQuality: airQuality,
            icon: template.icon,
            updateTime: new Date()
        };
    }
    
    /**
     * 计算体感温度
     */
    calculateFeelsLike(temp, windSpeed, humidity) {
        // 简化版体感温度计算
        let feelsLike = temp;
        
        // 风寒效应 (低温时)
        if (temp < 10) {
            feelsLike = temp - (windSpeed * 0.5);
        }
        
        // 湿热效应 (高温高湿时)
        if (temp > 25 && humidity > 60) {
            const heatIndex = temp + (humidity - 50) * 0.1;
            feelsLike = Math.max(feelsLike, heatIndex);
        }
        
        return feelsLike;
    }
    
    /**
     * 计算空气质量
     */
    calculateAirQuality(condition, windSpeed) {
        let aqi = 50; // 基础AQI
        
        // 天气条件影响
        if (condition === '雾' || condition === '阴') {
            aqi += 30;
        } else if (condition === '雨' || condition === '雪') {
            aqi -= 20;
        }
        
        // 风力影响
        if (windSpeed > 4) {
            aqi -= 15;
        } else if (windSpeed < 2) {
            aqi += 20;
        }
        
        aqi = Math.max(0, Math.min(300, aqi));
        
        // AQI等级
        if (aqi <= 50) return { level: '优', color: 'text-green-600', aqi: aqi };
        if (aqi <= 100) return { level: '良', color: 'text-yellow-600', aqi: aqi };
        if (aqi <= 150) return { level: '轻度污染', color: 'text-orange-600', aqi: aqi };
        if (aqi <= 200) return { level: '中度污染', color: 'text-red-600', aqi: aqi };
        if (aqi <= 300) return { level: '重度污染', color: 'text-purple-600', aqi: aqi };
        return { level: '严重污染', color: 'text-red-800', aqi: aqi };
    }
    
    /**
     * 获取风向
     */
    getWindDirection() {
        const directions = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];
        return directions[Math.floor(Math.random() * directions.length)];
    }
    
    /**
     * 使用模拟数据
     */
    useMockData() {
        this.currentWeather = this.generateMockWeather();
        console.log('使用模拟天气数据:', this.currentWeather);
    }
    
    /**
     * 开始自动更新
     */
    startAutoUpdate() {
        setInterval(() => {
            this.updateWeather();
        }, this.updateInterval);
    }
    
    /**
     * 获取当前天气
     */
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    /**
     * 获取天气历史
     */
    getWeatherHistory() {
        return this.weatherHistory;
    }
    
    /**
     * 获取季节信息
     */
    getSeason(date = new Date()) {
        const month = date.getMonth();
        return this.seasons[month];
    }
    
    /**
     * 获取节气信息 (简化版)
     */
    getSolarTerm(date = new Date()) {
        const month = date.getMonth();
        const day = date.getDate();
        
        // 简化的节气判断
        const termMap = {
            0: day < 15 ? '小寒' : '大寒', // 1月
            1: day < 15 ? '大寒' : '立春', // 2月
            2: day < 15 ? '雨水' : '惊蛰', // 3月
            3: day < 15 ? '春分' : '清明', // 4月
            4: day < 15 ? '谷雨' : '立夏', // 5月
            5: day < 15 ? '小满' : '芒种', // 6月
            6: day < 15 ? '夏至' : '小暑', // 7月
            7: day < 15 ? '大暑' : '立秋', // 8月
            8: day < 15 ? '处暑' : '白露', // 9月
            9: day < 15 ? '秋分' : '寒露', // 10月
            10: day < 15 ? '霜降' : '立冬', // 11月
            11: day < 15 ? '小雪' : '大雪'  // 12月
        };
        
        return termMap[month] || '未知';
    }
    
    /**
     * 获取时间段
     */
    getTimePeriod(date = new Date()) {
        const hour = date.getHours();
        if (hour >= 6 && hour < 12) return '早晨';
        if (hour >= 12 && hour < 14) return '中午';
        if (hour >= 14 && hour < 18) return '下午';
        if (hour >= 18 && hour < 22) return '傍晚';
        return '夜晚';
    }
    
    /**
     * 获取星期
     */
    getDayOfWeek(date = new Date()) {
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return days[date.getDay()];
    }
    
    /**
     * 获取完整的日期字符串
     */
    getFormattedDate(date = new Date()) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }
    
    /**
     * 获取完整的时间信息
     */
    getCompleteTimeInfo(date = new Date()) {
        return {
            date: this.getFormattedDate(date),
            time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            dayOfWeek: this.getDayOfWeek(date),
            timePeriod: this.getTimePeriod(date),
            season: this.getSeason(date),
            solarTerm: this.getSolarTerm(date)
        };
    }
    
    /**
     * 工具函数：在范围内生成随机数
     */
    randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    /**
     * 渲染天气效果到页面
     */
    renderWeatherEffect(weather) {
        if (!weather) return;
        
        const particleBg = document.getElementById('particle-bg');
        if (!particleBg) return;
        
        // 根据天气类型设置背景效果
        switch (weather.condition) {
            case '晴':
                this.renderSunnyEffect(particleBg);
                break;
            case '雨':
                this.renderRainyEffect(particleBg);
                break;
            case '雪':
                this.renderSnowyEffect(particleBg);
                break;
            case '多云':
            case '阴':
                this.renderCloudyEffect(particleBg);
                break;
            default:
                this.renderDefaultEffect(particleBg);
        }
    }
    
    /**
     * 渲染晴天效果
     */
    renderSunnyEffect(container) {
        // 使用p5.js创建温暖的光点效果
        if (window.p5) {
            new window.p5((p) => {
                let particles = [];
                
                p.setup = () => {
                    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                    canvas.parent(container);
                    
                    // 创建光点粒子
                    for (let i = 0; i < 30; i++) {
                        particles.push({
                            x: p.random(p.width),
                            y: p.random(p.height),
                            size: p.random(2, 6),
                            speed: p.random(0.5, 1.5),
                            opacity: p.random(0.3, 0.8)
                        });
                    }
                };
                
                p.draw = () => {
                    p.clear();
                    
                    // 绘制光点
                    particles.forEach(particle => {
                        p.fill(255, 215, 0, particle.opacity * 255);
                        p.noStroke();
                        p.ellipse(particle.x, particle.y, particle.size);
                        
                        // 缓慢移动
                        particle.y -= particle.speed;
                        if (particle.y < -10) {
                            particle.y = p.height + 10;
                            particle.x = p.random(p.width);
                        }
                        
                        // 闪烁效果
                        particle.opacity += p.random(-0.02, 0.02);
                        particle.opacity = p.constrain(particle.opacity, 0.2, 0.9);
                    });
                };
                
                p.windowResized = () => {
                    p.resizeCanvas(p.windowWidth, p.windowHeight);
                };
            });
        }
    }
    
    /**
     * 渲染雨天效果
     */
    renderRainyEffect(container) {
        if (window.p5) {
            new window.p5((p) => {
                let raindrops = [];
                
                p.setup = () => {
                    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                    canvas.parent(container);
                    
                    // 创建雨滴
                    for (let i = 0; i < 100; i++) {
                        raindrops.push({
                            x: p.random(p.width),
                            y: p.random(p.height),
                            length: p.random(10, 30),
                            speed: p.random(3, 8)
                        });
                    }
                };
                
                p.draw = () => {
                    p.clear();
                    
                    // 绘制雨滴
                    p.stroke(174, 194, 224, 150);
                    p.strokeWeight(1);
                    
                    raindrops.forEach(drop => {
                        p.line(drop.x, drop.y, drop.x, drop.y + drop.length);
                        
                        drop.y += drop.speed;
                        if (drop.y > p.height) {
                            drop.y = -drop.length;
                            drop.x = p.random(p.width);
                        }
                    });
                };
                
                p.windowResized = () => {
                    p.resizeCanvas(p.windowWidth, p.windowHeight);
                };
            });
        }
    }
    
    /**
     * 渲染雪天效果
     */
    renderSnowyEffect(container) {
        if (window.p5) {
            new window.p5((p) => {
                let snowflakes = [];
                
                p.setup = () => {
                    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                    canvas.parent(container);
                    
                    // 创建雪花
                    for (let i = 0; i < 50; i++) {
                        snowflakes.push({
                            x: p.random(p.width),
                            y: p.random(p.height),
                            size: p.random(2, 8),
                            speed: p.random(1, 3),
                            drift: p.random(-0.5, 0.5)
                        });
                    }
                };
                
                p.draw = () => {
                    p.clear();
                    
                    // 绘制雪花
                    p.fill(255, 255, 255, 200);
                    p.noStroke();
                    
                    snowflakes.forEach(flake => {
                        p.ellipse(flake.x, flake.y, flake.size);
                        
                        flake.y += flake.speed;
                        flake.x += flake.drift;
                        
                        if (flake.y > p.height) {
                            flake.y = -flake.size;
                            flake.x = p.random(p.width);
                        }
                        
                        if (flake.x < 0 || flake.x > p.width) {
                            flake.x = p.random(p.width);
                        }
                    });
                };
                
                p.windowResized = () => {
                    p.resizeCanvas(p.windowWidth, p.windowHeight);
                };
            });
        }
    }
    
    /**
     * 渲染阴天效果
     */
    renderCloudyEffect(container) {
        if (window.p5) {
            new window.p5((p) => {
                let clouds = [];
                
                p.setup = () => {
                    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                    canvas.parent(container);
                    
                    // 创建云朵
                    for (let i = 0; i < 5; i++) {
                        clouds.push({
                            x: p.random(p.width),
                            y: p.random(p.height * 0.3),
                            width: p.random(100, 200),
                            height: p.random(40, 80),
                            speed: p.random(0.2, 0.8)
                        });
                    }
                };
                
                p.draw = () => {
                    p.clear();
                    
                    // 绘制云朵
                    p.fill(200, 200, 200, 100);
                    p.noStroke();
                    
                    clouds.forEach(cloud => {
                        p.ellipse(cloud.x, cloud.y, cloud.width, cloud.height);
                        p.ellipse(cloud.x + cloud.width * 0.3, cloud.y, cloud.width * 0.8, cloud.height);
                        p.ellipse(cloud.x - cloud.width * 0.3, cloud.y, cloud.width * 0.8, cloud.height);
                        
                        cloud.x += cloud.speed;
                        if (cloud.x > p.width + cloud.width) {
                            cloud.x = -cloud.width;
                        }
                    });
                };
                
                p.windowResized = () => {
                    p.resizeCanvas(p.windowWidth, p.windowHeight);
                };
            });
        }
    }
    
    /**
     * 渲染默认效果
     */
    renderDefaultEffect(container) {
        // 清除任何现有的p5实例
        if (window.p5) {
            new window.p5((p) => {
                p.setup = () => {
                    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                    canvas.parent(container);
                };
                
                p.draw = () => {
                    p.clear();
                };
                
                p.windowResized = () => {
                    p.resizeCanvas(p.windowWidth, p.windowHeight);
                };
            });
        }
    }
}

// 导出天气管理器类
window.WeatherManager = WeatherManager;