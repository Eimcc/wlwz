import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as echarts from "echarts";
import { User, Users, Shield, Briefcase, Sword, Heart, History, TrendingUp, ChevronRight, MessageSquare, Sparkles } from "lucide-react";

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

export default function CharacterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Record<string, Character>>({});
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}resources/characters.json`)
      .then(res => res.json())
      .then(data => {
        setCharacters(data.characters);
        const params = new URLSearchParams(location.search);
        const id = params.get("id") || "tong-xiangyu";
        setSelectedId(id);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id && id !== selectedId) {
      setSelectedId(id);
    }
  }, [location.search]);

  const char = characters[selectedId];

  if (!char) return <div className="pt-32 text-center">加载中...</div>;

  return (
    <main className="pt-24 pb-16 px-4 md:px-8 bg-paper-bg/50">
      <div className="max-w-7xl mx-auto">
        {/* Character Selector */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-8 p-6 rounded-3xl"
        >
          <h2 className="text-2xl font-bold mb-6 hero-title text-center flex items-center justify-center gap-2">
            <Users size={24} className="text-amber-700" /> 江湖群像
          </h2>
          <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x">
            {Object.values(characters).map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`?id=${c.id}`)}
                className={`flex-shrink-0 snap-start flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  selectedId === c.id 
                    ? "bg-amber-600/10 ring-2 ring-amber-600 scale-105" 
                    : "hover:bg-white/50"
                }`}
              >
                <img src={`${import.meta.env.BASE_URL}${c.avatar}`} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" alt={c.name} />
                <span className={`text-sm font-bold ${selectedId === c.id ? "text-amber-800" : "text-gray-600"}`}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              <div className="lg:col-span-8">
                <div className="glass-card p-8 rounded-3xl h-full flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                    <User size={200} />
                  </div>
                  
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
                      <img src={`${import.meta.env.BASE_URL}${char.avatar}`} className="w-full h-full object-cover" alt={char.name} />
                    </div>
                    <motion.div 
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute -top-8 -right-8"
                    >
                      <div className="flex items-stretch drop-shadow-lg filter h-[41px]">
                        <img 
                          src={`${import.meta.env.BASE_URL}characters/avatars/ui/chat bubble_left.svg`} 
                          alt="" 
                          className="h-full w-auto block select-none" 
                        />
                        <div 
                          className="flex items-center px-1 h-full"
                          style={{
                            backgroundImage: `url('${import.meta.env.BASE_URL}characters/avatars/ui/chat bubble_middle.svg')`,
                            backgroundSize: 'auto 100%',
                            backgroundRepeat: 'repeat-x'
                          }}
                        >
                          <div className="flex items-center gap-2 px-1 whitespace-nowrap">
                            <MessageSquare size={14} className="text-amber-700 shrink-0" />
                            <span className="text-sm italic font-medium text-gray-800 line-clamp-1 pb-1">
                              {char.quotes[0]}
                            </span>
                          </div>
                        </div>
                        <img 
                          src={`${import.meta.env.BASE_URL}characters/avatars/ui/chat bubble_right.svg`} 
                          alt="" 
                          className="h-full w-auto block select-none" 
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex-grow text-center md:text-left z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <h1 className="text-5xl font-bold hero-title">{char.name}</h1>
                      <div className="flex gap-2 justify-center">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
                          <Shield size={12} /> {char.faction}
                        </span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
                          <Briefcase size={12} /> {char.occupation}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg italic">
                      {char.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="glass-card p-8 rounded-3xl h-full">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-amber-100 pb-2">
                    <TrendingUp size={20} className="text-amber-700" /> 五维能力
                  </h3>
                  <CharacterRadarChart bigFive={char.personality.bigFive} />
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Info & Skills */}
              <div className="lg:col-span-3 space-y-8">
                <InfoSection title="基本资料" icon={<User size={18} />}>
                  <div className="space-y-4">
                    <InfoItem label="别名" value={char.aliases.join(" / ")} />
                    <InfoItem label="门派" value={char.faction} />
                    <InfoItem label="职业" value={char.occupation} />
                  </div>
                </InfoSection>

                <InfoSection title="武功绝学" icon={<Sword size={18} />}>
                  <div className="flex flex-wrap gap-2">
                    {char.martialArts.map(art => (
                      <span key={art} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100">
                        {art}
                      </span>
                    ))}
                    {char.martialArts.length === 0 && <span className="text-gray-400 text-sm italic">无武功记载</span>}
                  </div>
                </InfoSection>

                <InfoSection title="兴趣爱好" icon={<Heart size={18} />}>
                  <div className="grid grid-cols-2 gap-2">
                    {char.hobbies.map(hobby => (
                      <div key={hobby} className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl text-sm text-amber-900 border border-amber-100/50">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        {hobby}
                      </div>
                    ))}
                  </div>
                </InfoSection>
              </div>

              {/* Middle Column: Timeline & Personality */}
              <div className="lg:col-span-6 space-y-8">
                <InfoSection title="性格特质" icon={<Sparkles size={18} />}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.entries(char.personality.traits).map(([trait, value]) => (
                      <div key={trait} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-600">{trait}</span>
                          <span className="text-amber-700">{value}%</span>
                        </div>
                        <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </InfoSection>

                <InfoSection title="生平大事记" icon={<History size={18} />}>
                  <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-600 before:to-amber-200">
                    {char.timeline.map((item, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-600 z-10 group-hover:scale-125 transition-transform" />
                        <div className="bg-white/40 dark:bg-black/10 p-5 rounded-2xl border border-amber-100 group-hover:border-amber-300 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-amber-800 font-bold">{item.year}</span>
                            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">{item.episode}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </InfoSection>
              </div>

              {/* Right Column: Relationships */}
              <div className="lg:col-span-3 space-y-8">
                <InfoSection title="羁绊关系" icon={<Users size={18} />}>
                  <div className="space-y-3">
                    {char.relationships.map((rel, idx) => {
                      const target = characters[rel.target];
                      if (!target) return null;
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 5 }}
                          onClick={() => navigate(`?id=${target.id}`)}
                          className="w-full flex items-center gap-3 p-3 bg-white/50 dark:bg-black/10 rounded-2xl border border-transparent hover:border-amber-200 hover:bg-amber-50/30 transition-all text-left group"
                        >
                          <img src={target.avatar} className="w-10 h-10 rounded-full object-cover border border-white" alt={target.name} />
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm">{target.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">{rel.type}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 truncate">{rel.description}</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-600 transition-colors" />
                        </motion.button>
                      );
                    })}
                  </div>
                  <button 
                    onClick={() => navigate("/relations")}
                    className="w-full mt-6 py-3 rounded-2xl bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-colors"
                  >
                    查看完整关系网
                  </button>
                </InfoSection>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function CharacterRadarChart({ bigFive }: { bigFive: Record<string, number> }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const dimensions = Object.keys(bigFive);
    const values = Object.values(bigFive);

    const option = {
      radar: {
        indicator: dimensions.map(d => ({ name: d, max: 100 })),
        shape: 'circle',
        splitNumber: 4,
        axisName: { color: '#8B4513' },
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

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [bigFive]);

  return <div ref={chartRef} className="w-full h-64" />;
}

function InfoSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="glass-card p-6 rounded-3xl">
      <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-amber-900 border-b border-amber-100 pb-2">
        <span className="p-1.5 bg-amber-100 rounded-lg text-amber-700">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  );
}

