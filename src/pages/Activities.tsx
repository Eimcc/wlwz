import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Cloud, User, ListTodo, Clock, Sun, CloudRain, Snowflake } from "lucide-react";

export default function ActivitiesPage() {
  const [weatherType, setWeatherType] = useState<string>('sunny');

  useEffect(() => {
    (window as any).initActivitiesPage?.();
    (window as any).loadActivitiesData?.();
    (window as any).updateVisitorStats?.();

    const handleWeatherUpdate = (e: any) => {
      if (e.detail && e.detail.type) {
        setWeatherType(e.detail.type);
      }
    };
    window.addEventListener('weather-updated', handleWeatherUpdate);
    return () => window.removeEventListener('weather-updated', handleWeatherUpdate);
  }, []);

  const getWeatherIcon = () => {
    switch (weatherType) {
      case 'sunny': return <Sun size={18} className="text-amber-500" />;
      case 'cloudy': return <Cloud size={18} className="text-gray-500" />;
      case 'rainy': return <CloudRain size={18} className="text-blue-500" />;
      case 'snowy': return <Snowflake size={18} className="text-cyan-500" />;
      default: return <Sun size={18} className="text-amber-500" />;
    }
  };

  return (
    <main className="pt-24 pb-16 px-6 bg-paper-bg/30">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 hero-title">角色日志</h1>
          <p className="text-lg text-gray-500 italic">
            "结合当前天气，回顾角色最近的日常轨迹"
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Status Card */}
            <div className="glass-card p-6 rounded-3xl border-amber-100">
              <div className="flex items-center gap-3 mb-6 text-amber-800 border-b border-amber-50 pb-4">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold">当前时序</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/40 rounded-2xl">
                  <span className="text-sm text-gray-500 flex items-center gap-2"><Calendar size={18} className="text-amber-700" /></span>
                  <span className="font-bold text-amber-900" id="log-current-time">--</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/40 rounded-2xl">
                  <span className="text-sm text-gray-500 flex items-center gap-2">{getWeatherIcon()}</span>
                  <span className="font-bold text-amber-900" id="log-current-weather">--</span>
                </div>
              </div>
            </div>

            {/* Character Selector */}
            <div className="glass-card p-6 rounded-3xl border-amber-100">
              <div className="flex items-center gap-3 mb-6 text-amber-800 border-b border-amber-50 pb-4">
                <User className="w-5 h-5" />
                <h3 className="font-bold">选择角色</h3>
              </div>
              <div
                id="character-selection"
                className="grid grid-cols-3 gap-3"
              />
            </div>
          </motion.div>

          {/* Main Log Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="glass-card p-8 rounded-3xl min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-8 border-b border-amber-50 pb-4">
                <div className="flex items-center gap-3 text-amber-800">
                  <ListTodo className="w-6 h-6" />
                  <h3 className="text-xl font-bold">活动轨迹</h3>
                </div>
                <button
                  id="log-toggle-btn"
                  className="group relative px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold text-sm shadow-lg hover:shadow-amber-600/30 transition-all hover:-translate-y-0.5"
                >
                  <span className="relative z-10">切换记录时长</span>
                </button>
              </div>
              
              <div
                id="activity-log"
                className="activity-timeline flex-grow overflow-y-auto pr-4 custom-scrollbar"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

