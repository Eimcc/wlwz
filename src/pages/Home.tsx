import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, Cloud, Sun, CloudRain, Snowflake, Wind, X, User, Shield, Briefcase, Sword, Heart, History, TrendingUp, MessageSquare, ChevronRight, Users, Sparkles, Radio, Volume2, ScrollText, Calendar, ChevronDown } from "lucide-react";
import * as echarts from "echarts";

interface Character {
  id: string;
  name: string;
  aliases: string[];
  faction: string;
  occupation: string;
  avatar: string;
  description: string;
  quotes: string[];
  martialArts: string[];
  hobbies: string[];
  personality: {
    traits: Record<string, number>;
    bigFive: Record<string, number>;
  };
  timeline: Array<{
    year: string;
    episode: string;
    event: string;
  }>;
  relationships: Array<{
    target: string;
    type: string;
    strength: number;
    description: string;
  }>;
}

interface WeatherData {
  desc: string;
  type: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  temp: number;
}

interface ActivityLog {
  time: string;
  shichen: string;
  activity: string;
  location: string;
  mood: 'happy' | 'calm' | 'sad' | 'angry' | 'excited';
}

const heroBg = `${import.meta.env.BASE_URL}resources/backgrounds/inn-interior.webp`;

// 获取农历日期（简化版）
function getLunarDate(date: Date): string {
  const months = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  const days = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
  // 简化计算，实际应使用农历库
  const month = months[date.getMonth()];
  const day = days[date.getDate() - 1] || '初一';
  return `${month}月${day}`;
}

// 获取时辰
function getShichen(date: Date): string {
  const hour = date.getHours();
  const shichenList = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
  let index = Math.floor((hour + 1) / 2);
  if (index >= 12) index = 0;
  return shichenList[index];
}

// 获取天气图标
function getWeatherIcon(type: string) {
  switch (type) {
    case 'sunny': return <Sun className="w-5 h-5 text-amber-500" />;
    case 'cloudy': return <Cloud className="w-5 h-5 text-gray-400" />;
    case 'rainy': return <CloudRain className="w-5 h-5 text-blue-400" />;
    case 'snowy': return <Snowflake className="w-5 h-5 text-cyan-300" />;
    default: return <Sun className="w-5 h-5 text-amber-500" />;
  }
}

// 获取体感描述
function getBodyFeeling(temp: number): string {
  if (temp <= 0) return '极寒';
  if (temp <= 10) return '寒冷';
  if (temp <= 18) return '微凉';
  if (temp <= 24) return '舒适';
  if (temp <= 29) return '温暖';
  if (temp <= 35) return '炎热';
  return '酷热';
}

// 24小时大事记广播内容
const BROADCAST_EVENTS = [
  { time: "子时", event: "白展堂在客栈大堂巡逻，确保没有可疑人物" },
  { time: "丑时", event: "佟湘玉在房间算账，发现账目对不上" },
  { time: "寅时", event: "郭芙蓉在厨房偷吃，被李大嘴发现" },
  { time: "卯时", event: "吕秀才早起读书，准备科举考试" },
  { time: "辰时", event: "莫小贝赖床不起，被佟湘玉叫起上学" },
  { time: "巳时", event: "邢捕头来客栈巡查，询问近日有无异常" },
  { time: "午时", event: "李大嘴在厨房忙碌，准备午餐" },
  { time: "未时", event: "燕小六在街口练习吹唢呐，引来围观" },
  { time: "申时", event: "祝无双在客栈帮忙，展现葵花点穴手" },
  { time: "酉时", event: "杨蕙兰路过七侠镇，李大嘴魂不守舍" },
  { time: "戌时", event: "钱夫人来客栈找茬，与佟湘玉斗嘴" },
  { time: "亥时", event: "众人围坐大堂，听白展堂讲江湖故事" },
  { time: "子时", event: "客栈打烊，众人各自回房休息" },
  { time: "丑时", event: "有神秘客人在客栈外徘徊" },
  { time: "寅时", event: "更夫敲锣报时，提醒防火防盗" },
  { time: "卯时", event: "早市开始，街上逐渐热闹起来" },
  { time: "辰时", event: "白马书院开门，莫小贝不情愿地去上学" },
  { time: "巳时", event: "怡红楼钱掌柜来同福客栈串门" },
  { time: "午时", event: "客栈满座，白展堂忙得脚不沾地" },
  { time: "未时", event: "郭芙蓉练功打坏了桌子，佟湘玉心疼" },
  { time: "申时", event: "吕秀才与郭芙蓉斗嘴，众人看热闹" },
  { time: "酉时", event: "夕阳西下，客栈准备晚餐" },
  { time: "戌时", event: "老邢来客栈蹭饭，讲述衙门趣事" },
  { time: "亥时", event: "客栈灯火通明，江湖客人们饮酒畅谈" },
];

// 生成角色活动日志
function generateActivityLogs(character: Character, mode: '12h' | '7d'): ActivityLog[] {
  const shichenList = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
  const locations: Record<string, string[]> = {
    '掌柜': ['柜台', '账房', '大堂'],
    '跑堂': ['大堂', '门口', '厨房'],
    '厨子': ['厨房', '后院', '储藏室'],
    '账房': ['账房', '大堂', '客房'],
    '打杂': ['大堂', '后院', '厨房'],
    '学生': ['白马书院', '大堂', '街上'],
    '捕头': ['衙门', '街道', '客栈'],
    '捕快': ['衙门', '街道', '客栈'],
    '衡山掌门': ['客房', '大堂', '后院'],
    '五岳盟主': ['白马书院', '大堂', '街上'],
  };
  
  const activities: Record<string, string[]> = {
    '掌柜': ['盘点账目', '招呼客人', '训斥伙计', '数钱', '打算盘'],
    '跑堂': ['端茶送水', '擦桌子', '招呼客人', '扫地', '传菜'],
    '厨子': ['切菜', '炒菜', '熬汤', '尝味道', '研究新菜'],
    '账房': ['记账', '读书', '写文章', '吟诗', '发呆'],
    '打杂': ['擦桌子', '扫地', '倒垃圾', '搬东西', '帮忙'],
    '学生': ['上课', '逃学', '吃糖葫芦', '玩耍', '背书'],
    '捕头': ['巡街', '查案', '喝酒', '打官腔', '收税'],
    '捕快': ['巡街', '查案', '吹唢呐', '练刀', '站岗'],
    '衡山掌门': ['练功', '吃糖葫芦', '逃学', '玩耍', '背书'],
    '五岳盟主': ['开会', '练功', '吃糖葫芦', '玩耍', '指挥'],
  };
  
  const moods: ActivityLog['mood'][] = ['happy', 'calm', 'sad', 'angry', 'excited'];
  const moodLabels: Record<string, string> = {
    happy: '开心', calm: '平静', sad: '难过', angry: '生气', excited: '兴奋'
  };
  
  const count = mode === '12h' ? 12 : 24;
  const logs: ActivityLog[] = [];
  
  for (let i = 0; i < count; i++) {
    const shichen = shichenList[i % 12];
    const locationList = locations[character.occupation] || ['客栈'];
    const activityList = activities[character.occupation] || ['休息'];
    const location = locationList[Math.floor(Math.random() * locationList.length)];
    const activity = activityList[Math.floor(Math.random() * activityList.length)];
    const mood = moods[Math.floor(Math.random() * moods.length)];
    
    logs.push({
      time: `${i * (mode === '12h' ? 1 : 7)}小时前`,
      shichen,
      activity: `${activity}`,
      location,
      mood
    });
  }
  
  return logs;
}

export default function Home() {
  const [characters, setCharacters] = useState<Record<string, Character>>({});
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({ desc: '晴朗', type: 'sunny', temp: 22 });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logCharacter, setLogCharacter] = useState<Character | null>(null);
  const [logMode, setLogMode] = useState<'12h' | '7d'>('12h');
  const [broadcastIndex, setBroadcastIndex] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 加载角色数据
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}resources/characters.json`)
      .then(res => res.json())
      .then(data => {
        setCharacters(data.characters);
      });
  }, []);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 获取天气
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.258&longitude=113.6433&current_weather=true');
        if (res.ok) {
          const data = await res.json();
          if (data?.current_weather) {
            const code = data.current_weather.weathercode;
            const temp = data.current_weather.temperature;
            let weatherData: WeatherData = { desc: '晴朗', type: 'sunny', temp };
            if (code === 0) weatherData = { desc: '晴朗', type: 'sunny', temp };
            else if (code <= 3) weatherData = { desc: '多云', type: 'cloudy', temp };
            else if (code <= 48) weatherData = { desc: '雾', type: 'cloudy', temp };
            else if (code <= 67) weatherData = { desc: '细雨', type: 'rainy', temp };
            else if (code <= 77) weatherData = { desc: '大雪', type: 'snowy', temp };
            else if (code <= 82) weatherData = { desc: '阵雨', type: 'rainy', temp };
            else weatherData = { desc: '暴雨', type: 'rainy', temp };
            setWeather(weatherData);
          }
        }
      } catch (e) {
        console.error('Weather fetch failed:', e);
      }
    };
    fetchWeather();
  }, []);

  // 过滤角色
  const filteredCharacters = useMemo(() => {
    const chars = Object.values(characters);
    if (!searchQuery.trim()) return chars;
    const query = searchQuery.toLowerCase();
    return chars.filter(char =>
      char.name.toLowerCase().includes(query) ||
      char.aliases.some(alias => alias.toLowerCase().includes(query)) ||
      char.occupation.toLowerCase().includes(query) ||
      char.faction.toLowerCase().includes(query)
    );
  }, [characters, searchQuery]);

  // 打开角色详情
  const openCharacterDetail = (char: Character) => {
    setSelectedChar(char);
    setShowDetailModal(true);
  };

  // 关闭角色详情
  const closeCharacterDetail = () => {
    setShowDetailModal(false);
    setTimeout(() => setSelectedChar(null), 300);
  };

  // 打开角色日志
  const openCharacterLog = (char: Character) => {
    setLogCharacter(char);
    setLogMode('12h');
    setShowLogModal(true);
  };

  // 关闭角色日志
  const closeCharacterLog = () => {
    setShowLogModal(false);
    setTimeout(() => setLogCharacter(null), 300);
  };

  // 渲染雷达图
  useEffect(() => {
    if (!showDetailModal || !selectedChar || !chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const bigFive = selectedChar.personality.bigFive;
    const dimensions = Object.keys(bigFive);
    const values = Object.values(bigFive);

    const option = {
      radar: {
        indicator: dimensions.map(d => ({ name: d, max: 100 })),
        shape: 'circle',
        splitNumber: 4,
        axisName: { color: '#8B4513', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(139, 69, 19, 0.2)' } },
        splitArea: { show: false }
      },
      series: [{
        type: 'radar',
        data: [{
          value: values,
          name: '性格特征',
          areaStyle: { color: 'rgba(160, 82, 45, 0.4)' },
          lineStyle: { color: '#A0522D', width: 2 },
          itemStyle: { color: '#A0522D' }
        }]
      }]
    };

    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showDetailModal, selectedChar]);

  // 清理图表实例
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  // 广播系统 - 轮播大事记
  useEffect(() => {
    const timer = setInterval(() => {
      setBroadcastIndex(prev => (prev + 1) % BROADCAST_EVENTS.length);
    }, 5000); // 每5秒切换一条
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* 背景图 - 客栈内 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
        <img
          src={heroBg}
          alt="同福客栈"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 顶部信息栏 */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-30 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-6 py-3 flex flex-wrap items-center justify-between gap-4">
            {/* 左侧：标题 */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold hero-title">武林外传</h1>
              <span className="text-sm text-gray-500 hidden sm:block">|</span>
              <span className="text-sm text-gray-600 hidden sm:block">同福客栈</span>
            </div>

            {/* 右侧：信息面板 */}
            <div className="flex items-center gap-6 flex-wrap">
              {/* 地图/位置 */}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span className="text-gray-700">七侠镇</span>
              </div>

              {/* 时间 */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <div className="flex flex-col">
                  <span className="text-gray-900 font-medium">{formatTime(currentTime)}</span>
                  <span className="text-xs text-gray-500">{getShichen(currentTime)} · {getLunarDate(currentTime)}</span>
                </div>
              </div>

              {/* 天气 */}
              <div className="flex items-center gap-2 text-sm">
                {getWeatherIcon(weather.type)}
                <div className="flex flex-col">
                  <span className="text-gray-900 font-medium">{weather.desc}</span>
                  <span className="text-xs text-gray-500">{getBodyFeeling(weather.temp)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 广播系统 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 glass-card rounded-xl px-4 py-2 flex items-center gap-3"
          >
            <div className="flex items-center gap-2 text-amber-700 flex-shrink-0">
              <Radio className="w-4 h-4" />
              <span className="text-xs font-bold">同福广播</span>
              <Volume2 className="w-3 h-3 animate-pulse" />
            </div>
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={broadcastIndex}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="text-amber-600 font-medium text-xs whitespace-nowrap">
                    {BROADCAST_EVENTS[broadcastIndex].time}
                  </span>
                  <span className="text-gray-700 truncate">
                    {BROADCAST_EVENTS[broadcastIndex].event}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {BROADCAST_EVENTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setBroadcastIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === broadcastIndex ? 'bg-amber-600' : 'bg-amber-200'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 中间：角色展示区域 */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pt-24 pb-32">
        <div className="w-full max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {filteredCharacters.length > 0 ? (
              <motion.div
                key="characters"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
              >
                {filteredCharacters.map((char, index) => (
                  <motion.button
                    key={char.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openCharacterDetail(char)}
                    className="group relative flex flex-col items-center"
                  >
                    {/* 角色头像 */}
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/80 shadow-2xl group-hover:border-amber-400 transition-all duration-300 bg-amber-100">
                        <img
                          src={`${import.meta.env.BASE_URL}${char.avatar}`}
                          alt={char.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* 悬浮光效 */}
                      <div className="absolute inset-0 rounded-full bg-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                    </div>

                    {/* 角色名称 */}
                    <div className="mt-3 text-center">
                      <span className="text-white font-bold text-sm sm:text-base drop-shadow-lg group-hover:text-amber-300 transition-colors">
                        {char.name}
                      </span>
                      <p className="text-white/70 text-xs mt-0.5 drop-shadow-md">
                        {char.occupation}
                      </p>
                    </div>

                    {/* 悬浮提示 - 台词 */}
                    <AnimatePresence>
                      {char.quotes?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          whileHover={{ opacity: 1, y: 0, scale: 1 }}
                          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                        >
                          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg border border-amber-200">
                            <p className="text-xs text-gray-700 italic">"{char.quotes[0].slice(0, 15)}..."</p>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/95 rotate-45 border-r border-b border-amber-200" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-white/80"
              >
                <p className="text-xl">未找到匹配的角色</p>
                <p className="text-sm mt-2 text-white/60">试试其他关键词</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 底部：搜索框 */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-6"
      >
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <Search className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索角色姓名、绰号、武功或身份..."
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
          <p className="text-center text-white/60 text-xs mt-3">
            点击角色查看详细信息 · 共 {Object.keys(characters).length} 位江湖儿女
          </p>
        </div>
      </motion.div>

      {/* 右下角：日志按钮 */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const chars = Object.values(characters);
          if (chars.length > 0) openCharacterLog(chars[0]);
        }}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        title="查看角色日志"
      >
        <ScrollText className="w-6 h-6" />
      </motion.button>

      {/* 角色详情弹窗 */}
      <AnimatePresence>
        {showDetailModal && selectedChar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeCharacterDetail}
          >
            {/* 背景遮罩 */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* 弹窗内容 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            >
              {/* 关闭按钮 */}
              <button
                onClick={closeCharacterDetail}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* 弹窗头部 */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-t-3xl">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* 头像 */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                      <img
                        src={`${import.meta.env.BASE_URL}${selectedChar.avatar}`}
                        alt={selectedChar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* 台词气泡 */}
                    {selectedChar.quotes?.length > 0 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-4 -right-20 md:-right-24"
                      >
                        <div className="bg-white px-3 py-2 rounded-2xl shadow-lg border border-amber-200 max-w-[160px]">
                          <p className="text-xs text-gray-700 italic line-clamp-2">"{selectedChar.quotes[0]}"</p>
                          <div className="absolute -bottom-2 left-4 w-3 h-3 bg-white rotate-45 border-r border-b border-amber-200" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 基本信息 */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-bold hero-title mb-2">{selectedChar.name}</h2>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
                        <Shield size={12} /> {selectedChar.faction}
                      </span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
                        <Briefcase size={12} /> {selectedChar.occupation}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{selectedChar.description}</p>
                    <button
                      onClick={() => openCharacterLog(selectedChar)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-sm font-medium transition-colors"
                    >
                      <ScrollText size={16} />
                      查看行为日志
                    </button>
                  </div>

                  {/* 五维雷达图 */}
                  <div className="w-full md:w-48 h-48">
                    <div ref={chartRef} className="w-full h-full" />
                  </div>
                </div>
              </div>

              {/* 弹窗内容区 */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* 左侧：基本资料 */}
                  <div className="space-y-6">
                    <InfoSection title="基本资料" icon={<User size={18} />}>
                      <div className="space-y-3">
                        <InfoItem label="别名" value={selectedChar.aliases.join(" / ")} />
                        <InfoItem label="门派" value={selectedChar.faction} />
                        <InfoItem label="职业" value={selectedChar.occupation} />
                      </div>
                    </InfoSection>

                    <InfoSection title="武功绝学" icon={<Sword size={18} />}>
                      <div className="flex flex-wrap gap-2">
                        {selectedChar.martialArts.map(art => (
                          <span key={art} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100">
                            {art}
                          </span>
                        ))}
                        {selectedChar.martialArts.length === 0 && <span className="text-gray-400 text-sm italic">无武功记载</span>}
                      </div>
                    </InfoSection>

                    <InfoSection title="兴趣爱好" icon={<Heart size={18} />}>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedChar.hobbies.map(hobby => (
                          <div key={hobby} className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl text-sm text-amber-900 border border-amber-100/50">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            {hobby}
                          </div>
                        ))}
                      </div>
                    </InfoSection>
                  </div>

                  {/* 中间：性格特质 & 生平 */}
                  <div className="space-y-6">
                    <InfoSection title="性格特质" icon={<Sparkles size={18} />}>
                      <div className="space-y-3">
                        {Object.entries(selectedChar.personality.traits).map(([trait, value]) => (
                          <div key={trait}>
                            <div className="flex justify-between text-sm font-medium mb-1">
                              <span className="text-gray-600">{trait}</span>
                              <span className="text-amber-700">{value}%</span>
                            </div>
                            <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </InfoSection>

                    <InfoSection title="生平大事记" icon={<History size={18} />}>
                      <div className="relative pl-5 space-y-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-600 before:to-amber-200">
                        {selectedChar.timeline.map((item, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-amber-600" />
                            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-amber-800 font-bold text-sm">{item.year}</span>
                                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg">{item.episode}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{item.event}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </InfoSection>
                  </div>

                  {/* 右侧：羁绊关系 */}
                  <div>
                    <InfoSection title="羁绊关系" icon={<Users size={18} />}>
                      <div className="space-y-3">
                        {selectedChar.relationships.map((rel, idx) => {
                          const target = characters[rel.target];
                          if (!target) return null;
                          return (
                            <motion.button
                              key={idx}
                              whileHover={{ x: 5 }}
                              onClick={() => openCharacterDetail(target)}
                              className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-transparent hover:border-amber-200 hover:bg-amber-50/30 transition-all text-left group"
                            >
                              <img
                                src={`${import.meta.env.BASE_URL}${target.avatar}`}
                                className="w-10 h-10 rounded-full object-cover border border-white"
                                alt={target.name}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-sm">{target.name}</span>
                                  <RelationshipBadge type={rel.type} />
                                </div>
                                <p className="text-[10px] text-gray-500 truncate">{rel.description}</p>
                              </div>
                              <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-600" />
                            </motion.button>
                          );
                        })}
                      </div>
                    </InfoSection>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 角色日志弹窗 */}
      <AnimatePresence>
        {showLogModal && logCharacter && (
          <CharacterLogModal
            character={logCharacter}
            characters={characters}
            mode={logMode}
            onModeChange={setLogMode}
            onClose={closeCharacterLog}
            onSelectCharacter={openCharacterLog}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 辅助组件
function InfoSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-900 border-b border-amber-100 pb-2">
        <span className="p-1.5 bg-amber-100 rounded-lg text-amber-700">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}

function RelationshipBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    love: 'bg-red-100 text-red-700',
    family: 'bg-green-100 text-green-700',
    friendship: 'bg-blue-100 text-blue-700',
    enemy: 'bg-purple-100 text-purple-700',
    love_rival: 'bg-pink-100 text-pink-700'
  };
  const labels: Record<string, string> = {
    love: '爱情',
    family: '亲情',
    friendship: '友情',
    enemy: '敌对',
    love_rival: '情敌'
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
      {labels[type] || type}
    </span>
  );
}

// 角色日志弹窗组件
function CharacterLogModal({
  character,
  characters,
  mode,
  onModeChange,
  onClose,
  onSelectCharacter
}: {
  character: Character;
  characters: Record<string, Character>;
  mode: '12h' | '7d';
  onModeChange: (mode: '12h' | '7d') => void;
  onClose: () => void;
  onSelectCharacter: (char: Character) => void;
}) {
  const logs = useMemo(() => generateActivityLogs(character, mode), [character, mode]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const moodColors: Record<string, { bg: string; text: string; label: string }> = {
    happy: { bg: 'bg-green-100', text: 'text-green-700', label: '开心' },
    calm: { bg: 'bg-blue-100', text: 'text-blue-700', label: '平静' },
    sad: { bg: 'bg-gray-100', text: 'text-gray-700', label: '难过' },
    angry: { bg: 'bg-red-100', text: 'text-red-700', label: '生气' },
    excited: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '兴奋' }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* 弹窗内容 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col"
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={`${import.meta.env.BASE_URL}${character.avatar}`}
                alt={character.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold hero-title">{character.name}</h2>
                <p className="text-sm text-gray-600">行为日志</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* 角色选择器和模式切换 */}
          <div className="flex items-center justify-between mt-4 gap-4">
            {/* 角色选择下拉框 */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-amber-200 hover:border-amber-400 transition-colors"
              >
                <span className="text-sm font-medium">切换角色</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-amber-100 max-h-60 overflow-y-auto z-50"
                  >
                    {Object.values(characters).map((char) => (
                      <button
                        key={char.id}
                        onClick={() => {
                          onSelectCharacter(char);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-amber-50 transition-colors ${
                          char.id === character.id ? 'bg-amber-50' : ''
                        }`}
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}${char.avatar}`}
                          alt={char.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{char.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 时间范围切换 */}
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-amber-200">
              <button
                onClick={() => onModeChange('12h')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === '12h'
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:bg-amber-50'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                十二个时辰
              </button>
              <button
                onClick={() => onModeChange('7d')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === '7d'
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:bg-amber-50'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                七天内
              </button>
            </div>
          </div>
        </div>

        {/* 日志列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-amber-50/50 transition-colors"
              >
                {/* 时间 */}
                <div className="flex-shrink-0 text-center min-w-[60px]">
                  <div className="text-sm font-bold text-amber-700">{log.shichen}</div>
                  <div className="text-xs text-gray-400">{log.time}</div>
                </div>

                {/* 内容 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">{log.activity}</span>
                    <span className="text-xs text-gray-500">@ {log.location}</span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${moodColors[log.mood].bg} ${moodColors[log.mood].text}`}>
                    {moodColors[log.mood].label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 查看更多按钮 */}
          {mode === '12h' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => onModeChange('7d')}
                className="px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-sm font-medium transition-colors"
              >
                查看更多记录（七天内）
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
