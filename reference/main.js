/**
 * 主控制器
 * 整合角色系统、天气系统和UI交互
 */

class VirtualCharacterApp {
    constructor() {
        this.character = new Character();
        this.weatherManager = new WeatherManager();
        
        // 应用状态
        this.isPaused = false;
        this.updateSpeed = 1; // 1x, 2x, 5x, 10x
        this.isRealTimeMode = true;
        
        // 日志管理
        this.logs = [];
        this.maxLogs = 10; // 页面显示的最大日志数量
        
        // 定时器
        this.updateTimer = null;
        this.timeUpdateTimer = null;
        
        // UI元素
        this.elements = {};
        
        // 心情图表
        this.moodChart = null;
        
        // 统计信息
        this.stats = {
            totalLogs: 0,
            todayLogs: 0,
            activityCount: {},
            moodHistory: []
        };
    }
    
    /**
     * 初始化应用
     */
    async init() {
        try {
            console.log('初始化虚拟人物应用...');
            
            // 获取UI元素引用
            this.initElements();
            
            // 初始化天气管理器
            await this.weatherManager.init();
            
            // 加载历史数据
            this.loadHistoryData();
            
            // 初始化UI
            this.initUI();
            
            // 启动定时器
            this.startTimers();
            
            // 生成初始日志
            await this.generateInitialLogs();
            
            // 初始化事件监听器
            this.initEventListeners();
            
            // 初始化心情图表
            this.initMoodChart();
            
            console.log('应用初始化完成');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showError('应用初始化失败，请刷新页面重试');
        }
    }
    
    /**
     * 初始化UI元素引用
     */
    initElements() {
        this.elements = {
            // 时间显示
            currentTime: document.getElementById('current-time'),
            currentDate: document.getElementById('current-date'),
            timePeriod: document.getElementById('time-period'),
            dayOfWeek: document.getElementById('day-of-week'),
            season: document.getElementById('season'),
            solarTerm: document.getElementById('solar-term'),
            
            // 角色信息
            currentMood: document.getElementById('current-mood'),
            currentActivity: document.getElementById('current-activity'),
            currentLocation: document.getElementById('current-location'),
            characterAvatar: document.getElementById('character-avatar'),
            
            // 天气信息
            weatherIcon: document.getElementById('weather-icon'),
            temperature: document.getElementById('temperature'),
            weatherCondition: document.getElementById('weather-condition'),
            feelsLike: document.getElementById('feels-like'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('wind-speed'),
            airQuality: document.getElementById('air-quality'),
            
            // 统计信息
            todayLogs: document.getElementById('today-logs'),
            mainActivity: document.getElementById('main-activity'),
            socialCount: document.getElementById('social-count'),
            
            // 控制按钮
            pauseBtn: document.getElementById('pause-btn'),
            speedBtn: document.getElementById('speed-btn'),
            timeModeBtn: document.getElementById('time-mode-btn'),
            toggleDetails: document.getElementById('toggle-details'),
            toggleText: document.getElementById('toggle-text'),
            toggleIcon: document.getElementById('toggle-icon'),
            characterDetails: document.getElementById('character-details'),
            
            // 日志容器
            logsContainer: document.getElementById('logs-container'),
            
            // 移动菜单
            mobileMenuBtn: document.getElementById('mobile-menu-btn'),
            mobileMenu: document.getElementById('mobile-menu'),
            
            // 图表容器
            moodChart: document.getElementById('mood-chart')
        };
    }
    
    /**
     * 初始化UI
     */
    initUI() {
        // 更新时间显示
        this.updateTimeDisplay();
        
        // 更新天气显示
        this.updateWeatherDisplay();
        
        // 更新角色状态显示
        this.updateCharacterDisplay();
        
        // 更新统计信息
        this.updateStatsDisplay();
    }
    
    /**
     * 初始化事件监听器
     */
    initEventListeners() {
        // 暂停/继续按钮
        this.elements.pauseBtn.addEventListener('click', () => {
            this.togglePause();
        });
        
        // 速度控制按钮
        this.elements.speedBtn.addEventListener('click', () => {
            this.cycleSpeed();
        });
        
        // 时间模式按钮
        this.elements.timeModeBtn.addEventListener('click', () => {
            this.toggleTimeMode();
        });
        
        // 角色详情展开/收起
        this.elements.toggleDetails.addEventListener('click', () => {
            this.toggleCharacterDetails();
        });
        
        // 移动菜单
        this.elements.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });
    }
    
    /**
     * 启动定时器
     */
    startTimers() {
        // 时间更新定时器 (每秒)
        this.timeUpdateTimer = setInterval(() => {
            this.updateTimeDisplay();
        }, 1000);
        
        // 日志更新定时器 (根据速度调整)
        this.updateTimer = setInterval(() => {
            if (!this.isPaused) {
                this.generateNewLog();
            }
        }, 30000 / this.updateSpeed); // 基础间隔30秒，根据速度调整
    }
    
    /**
     * 生成初始日志
     */
    async generateInitialLogs() {
        const currentWeather = this.weatherManager.getCurrentWeather();
        
        // 生成3-5条初始日志
        const initialLogCount = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < initialLogCount; i++) {
            const logTime = new Date(Date.now() - (initialLogCount - i) * 15 * 60 * 1000); // 15分钟间隔
            const log = this.character.generateActivityLog(currentWeather, logTime);
            this.addLog(log);
        }
        
        // 渲染日志到UI
        this.renderLogs();
    }
    
    /**
     * 生成新日志
     */
    async generateNewLog() {
        try {
            const currentWeather = this.weatherManager.getCurrentWeather();
            const log = this.character.generateActivityLog(currentWeather);
            
            this.addLog(log);
            this.renderLogs();
            this.updateCharacterDisplay();
            this.updateStatsDisplay();
            this.updateMoodChart();
            
            // 保存到本地存储
            this.saveLogToStorage(log);
            
        } catch (error) {
            console.error('生成日志失败:', error);
        }
    }
    
    /**
     * 添加日志到队列
     */
    addLog(log) {
        this.logs.push(log);
        this.stats.totalLogs++;
        this.stats.todayLogs++;
        
        // 限制日志数量
        if (this.logs.length > this.maxLogs) {
            this.logs.shift(); // 移除最旧的日志
        }
        
        // 更新活动统计
        const activityType = log.activity.type;
        this.stats.activityCount[activityType] = (this.stats.activityCount[activityType] || 0) + 1;
        
        // 更新心情历史
        this.stats.moodHistory.push({
            time: log.timestamp,
            mood: log.mood.primary,
            intensity: log.mood.intensity
        });
        
        // 限制心情历史数量
        if (this.stats.moodHistory.length > 50) {
            this.stats.moodHistory.shift();
        }
    }
    
    /**
     * 渲染日志到UI
     */
    renderLogs() {
        const container = this.elements.logsContainer;
        container.innerHTML = '';
        
        this.logs.forEach((log, index) => {
            const logElement = this.createLogElement(log, index);
            container.appendChild(logElement);
        });
        
        // 滚动到最新日志
        container.scrollTop = container.scrollHeight;
        
        // 添加动画效果
        anime({
            targets: '.log-entry',
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutQuart'
        });
    }
    
    /**
     * 创建日志元素
     */
    createLogElement(log, index) {
        const logDiv = document.createElement('div');
        logDiv.className = 'log-entry bg-white/70 backdrop-blur-sm rounded-lg p-4 border-l-4 border-amber-400 hover:bg-white/80 transition-all duration-300';
        
        const time = new Date(log.timestamp);
        const timeString = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        
        // 心情指示器颜色
        const moodColors = {
            '愉悦': 'bg-green-400',
            '兴奋': 'bg-yellow-400',
            '满足': 'bg-blue-400',
            '平静': 'bg-gray-400',
            '安详': 'bg-purple-400',
            '放松': 'bg-indigo-400',
            '沉思': 'bg-amber-400',
            '忧郁': 'bg-slate-400',
            '敏感': 'bg-pink-400',
            '内省': 'bg-teal-400',
            '专注': 'bg-cyan-400',
            '疲惫': 'bg-red-400',
            '倦怠': 'bg-orange-400'
        };
        
        const moodColor = moodColors[log.mood.primary] || 'bg-gray-400';
        
        logDiv.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                    <span class="mood-indicator ${moodColor}"></span>
                    <span class="text-sm font-medium text-gray-800">${log.mood.primary}</span>
                    <span class="text-xs text-gray-500">${timeString}</span>
                </div>
                <div class="flex items-center space-x-1">
                    ${log.weather ? `<span class="text-xs text-gray-500">${log.weather.condition}</span>` : ''}
                    <span class="text-xs text-gray-500">·</span>
                    <span class="text-xs text-gray-500">${log.activity.location}</span>
                </div>
            </div>
            
            <div class="mb-2">
                <h4 class="font-medium text-gray-800 mb-1">${log.activity.name}</h4>
                <p class="text-sm text-gray-600 leading-relaxed">${log.activity.description}</p>
            </div>
            
            <div class="bg-amber-50 border border-amber-100 rounded p-3">
                <p class="text-sm text-amber-800 italic">"${log.thoughts}"</p>
            </div>
            
            ${log.mood.factors.length > 0 ? `
                <div class="mt-2 flex flex-wrap gap-1">
                    ${log.mood.factors.map(factor => 
                        `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${factor}</span>`
                    ).join('')}
                </div>
            ` : ''}
        `;
        
        return logDiv;
    }
    
    /**
     * 更新时间显示
     */
    updateTimeDisplay() {
        const now = new Date();
        const timeInfo = this.weatherManager.getCompleteTimeInfo(now);
        
        // 更新时间
        this.elements.currentTime.textContent = now.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        this.elements.currentDate.textContent = timeInfo.date;
        this.elements.timePeriod.textContent = timeInfo.timePeriod;
        this.elements.dayOfWeek.textContent = timeInfo.dayOfWeek;
        this.elements.season.textContent = timeInfo.season;
        this.elements.solarTerm.textContent = timeInfo.solarTerm;
    }
    
    /**
     * 更新天气显示
     */
    updateWeatherDisplay() {
        const weather = this.weatherManager.getCurrentWeather();
        if (!weather) return;
        
        this.elements.weatherIcon.textContent = weather.icon;
        this.elements.temperature.textContent = weather.temperature;
        this.elements.weatherCondition.textContent = weather.condition;
        this.elements.feelsLike.textContent = `${weather.feelsLike}°C`;
        this.elements.humidity.textContent = `${weather.humidity}%`;
        this.elements.windSpeed.textContent = `${weather.windSpeed}m/s`;
        
        // 更新空气质量
        if (weather.airQuality) {
            this.elements.airQuality.textContent = weather.airQuality.level;
            this.elements.airQuality.className = weather.airQuality.color;
        }
        
        // 渲染天气效果
        this.weatherManager.renderWeatherEffect(weather);
    }
    
    /**
     * 更新角色状态显示
     */
    updateCharacterDisplay() {
        const status = this.character.getCurrentStatus();
        
        this.elements.currentMood.textContent = status.mood;
        this.elements.currentActivity.textContent = status.activity;
        this.elements.currentLocation.textContent = status.location;
        
        // 更新头像动画 (如果有心情变化)
        if (this.elements.characterAvatar) {
            anime({
                targets: this.elements.characterAvatar,
                scale: [1, 1.05, 1],
                duration: 1000,
                easing: 'easeInOutQuad'
            });
        }
    }
    
    /**
     * 更新统计信息显示
     */
    updateStatsDisplay() {
        this.elements.todayLogs.textContent = this.stats.todayLogs;
        this.elements.mainActivity.textContent = this.character.getCurrentStatus().activity;
        
        // 计算社交次数
        const socialCount = this.stats.activityCount['social'] || 0;
        this.elements.socialCount.textContent = `${socialCount}次`;
    }
    
    /**
     * 初始化心情图表
     */
    initMoodChart() {
        if (!window.echarts || !this.elements.moodChart) return;
        
        this.moodChart = echarts.init(this.elements.moodChart);
        this.updateMoodChart();
    }
    
    /**
     * 更新心情图表
     */
    updateMoodChart() {
        if (!this.moodChart || this.stats.moodHistory.length === 0) return;
        
        // 心情到数值的映射
        const moodValues = {
            '愉悦': 9, '兴奋': 10, '满足': 8, '欣喜': 9,
            '平静': 6, '安详': 7, '放松': 7, '舒适': 7,
            '沉思': 5, '忧郁': 3, '敏感': 4, '内省': 5,
            '专注': 7, '疲惫': 2, '倦怠': 2, '无力': 2, '沉闷': 3,
            '焦虑': 2, '不安': 2, '紧张': 2, '烦躁': 3
        };
        
        // 准备数据
        const recentMoods = this.stats.moodHistory.slice(-12); // 最近12个
        const times = recentMoods.map(mood => {
            const time = new Date(mood.time);
            return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        });
        const values = recentMoods.map(mood => moodValues[mood.mood] || 5);
        
        const option = {
            title: {
                show: false
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    const data = params[0];
                    return `${data.name}<br/>心情指数: ${data.value}`;
                }
            },
            xAxis: {
                type: 'category',
                data: times,
                axisLabel: {
                    fontSize: 10,
                    color: '#6B6659'
                },
                axisLine: {
                    lineStyle: {
                        color: '#E0DACE'
                    }
                }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 10,
                axisLabel: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#F0F0F0'
                    }
                }
            },
            series: [{
                data: values,
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#D4B896',
                    width: 3
                },
                itemStyle: {
                    color: '#8B7355'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(212, 184, 150, 0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(212, 184, 150, 0.05)'
                        }]
                    }
                }
            }],
            grid: {
                left: '10%',
                right: '10%',
                top: '10%',
                bottom: '20%'
            }
        };
        
        this.moodChart.setOption(option);
    }
    
    /**
     * 暂停/继续更新
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        
        const btn = this.elements.pauseBtn;
        const icon = btn.querySelector('svg');
        const text = btn.querySelector('span');
        
        if (this.isPaused) {
            btn.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
            btn.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
            text.textContent = '继续';
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 18h6"></path>';
        } else {
            btn.classList.remove('bg-red-50', 'text-red-700', 'border-red-200');
            btn.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
            text.textContent = '暂停';
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"></path>';
        }
    }
    
    /**
     * 循环切换速度
     */
    cycleSpeed() {
        const speeds = [1, 2, 5, 10];
        const currentIndex = speeds.indexOf(this.updateSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        this.updateSpeed = speeds[nextIndex];
        
        this.elements.speedBtn.textContent = `${this.updateSpeed}x`;
        
        // 重新启动定时器
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = setInterval(() => {
                if (!this.isPaused) {
                    this.generateNewLog();
                }
            }, 30000 / this.updateSpeed);
        }
    }
    
    /**
     * 切换时间模式
     */
    toggleTimeMode() {
        this.isRealTimeMode = !this.isRealTimeMode;
        
        const btn = this.elements.timeModeBtn;
        if (this.isRealTimeMode) {
            btn.textContent = '实时';
            btn.className = 'text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded';
        } else {
            btn.textContent = '模拟';
            btn.className = 'text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded';
        }
    }
    
    /**
     * 切换角色详情显示
     */
    toggleCharacterDetails() {
        const details = this.elements.characterDetails;
        const text = this.elements.toggleText;
        const icon = this.elements.toggleIcon;
        
        if (details.classList.contains('expanded')) {
            details.classList.remove('expanded');
            text.textContent = '查看更多';
            icon.style.transform = 'rotate(0deg)';
        } else {
            details.classList.add('expanded');
            text.textContent = '收起';
            icon.style.transform = 'rotate(180deg)';
        }
    }
    
    /**
     * 切换移动菜单
     */
    toggleMobileMenu() {
        const menu = this.elements.mobileMenu;
        menu.classList.toggle('hidden');
    }
    
    /**
     * 暂停更新
     */
    pauseUpdates() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
    }
    
    /**
     * 恢复更新
     */
    resumeUpdates() {
        if (!this.isPaused) {
            this.startTimers();
        }
    }
    
    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 重新调整图表大小
        if (this.moodChart) {
            this.moodChart.resize();
        }
    }
    
    /**
     * 加载历史数据
     */
    loadHistoryData() {
        try {
            const savedLogs = localStorage.getItem('virtual-character-logs');
            if (savedLogs) {
                const logs = JSON.parse(savedLogs);
                // 只保留最近的数据
                const recentLogs = logs.slice(-50);
                this.stats.totalLogs = recentLogs.length;
            }
        } catch (error) {
            console.warn('加载历史数据失败:', error);
        }
    }
    
    /**
     * 保存日志到本地存储
     */
    saveLogToStorage(log) {
        try {
            const existingLogs = localStorage.getItem('virtual-character-logs');
            let logs = existingLogs ? JSON.parse(existingLogs) : [];
            
            logs.push(log);
            
            // 限制存储数量
            if (logs.length > 100) {
                logs = logs.slice(-100);
            }
            
            localStorage.setItem('virtual-character-logs', JSON.stringify(logs));
        } catch (error) {
            console.warn('保存日志失败:', error);
        }
    }
    
    /**
     * 显示错误信息
     */
    showError(message) {
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// 应用启动
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const app = new VirtualCharacterApp();
        await app.init();
        
        // 将应用实例添加到全局作用域，便于调试
        window.virtualCharacterApp = app;
        
        console.log('虚拟人物行为日志应用已启动');
        
    } catch (error) {
        console.error('应用启动失败:', error);
        
        // 显示错误页面
        document.body.innerHTML = `
            <div class="flex items-center justify-center min-h-screen bg-gray-100">
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-gray-800 mb-4">应用启动失败</h1>
                    <p class="text-gray-600 mb-4">请刷新页面重试</p>
                    <button onclick="location.reload()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        刷新页面
                    </button>
                </div>
            </div>
        `;
    }
});