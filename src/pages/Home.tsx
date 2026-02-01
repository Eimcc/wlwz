import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Users, Map as MapIcon, BookOpen, Sparkles } from "lucide-react";

const heroBg = `${import.meta.env.BASE_URL}resources/backgrounds/inn-interior.webp`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    (window as any).initIndexPage?.();
    (window as any).updateVisitorStats?.();
  }, []);

  return (
    <div className="overflow-x-hidden">
      <div id="particle-background" className="particle-bg" />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
            <img
              src={heroBg}
              alt="同福客栈"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>

          <motion.div 
            className="relative z-20 text-center text-white px-6 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-widest uppercase">
                七侠镇 · 同福客栈
              </span>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="hero-title text-7xl md:text-9xl font-bold mb-8 !text-white drop-shadow-2xl"
              id="main-title"
            >
              武林外传
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-3xl mb-12 quote-text !text-white/90 font-light"
              id="main-subtitle"
            >
              "嘿，兄弟！我们好久不见，你在哪里？"
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center"
              id="hero-buttons"
            >
              <button
                onClick={() => {
                  // @ts-expect-error global function from main.js
                  if (typeof scrollToSearch === "function") {
                    // @ts-expect-error global
                    scrollToSearch();
                  }
                }}
                className="group relative bg-gradient-to-r from-amber-600 to-red-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(180,83,9,0.4)] hover:shadow-[0_0_30px_rgba(180,83,9,0.6)] hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  开始探索 <Sparkles size={18} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button
                onClick={() => {
                  navigate("/relations");
                }}
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-gray-900 transition-all hover:-translate-y-1"
              >
                查看关系图谱
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </div>
          </motion.div>
        </section>

        {/* Search Section */}
        <section id="search-section" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="search-container p-10 mb-16 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Search size={120} />
              </div>
              
              <h2 className="text-4xl font-bold text-center mb-10 hero-title">
                寻找江湖儿女
              </h2>

              <div className="relative mb-10 max-w-3xl mx-auto">
                <input
                  type="text"
                  id="search-input"
                  placeholder="输入角色姓名、绰号或武功..."
                  className="w-full px-8 py-5 text-xl bg-white/50 dark:bg-black/20 border-2 border-wood-brown/20 rounded-2xl focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 focus:outline-none transition-all placeholder:text-gray-400"
                  onInput={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    // @ts-expect-error global from main.js
                    if (typeof handleSearch === "function") {
                      // @ts-expect-error global
                      handleSearch(value);
                    }
                  }}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-600">
                  <Search size={28} />
                </div>
              </div>

              <div
                id="search-suggestions"
                className="hidden absolute z-30 left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto"
              />

              <div className="flex flex-wrap gap-3 justify-center">
                {['全部', '同福客栈', '官府', '江湖', '家族'].map((label, idx) => (
                  <button
                    key={label}
                    className={`filter-btn px-6 py-2.5 rounded-full font-medium text-sm ${idx === 0 ? 'active' : ''}`}
                    onClick={() => {
                      const typeMap: Record<string, string> = {
                        '全部': 'all',
                        '同福客栈': 'tongfu',
                        '官府': 'official',
                        '江湖': 'jianghu',
                        '家族': 'family'
                      };
                      // @ts-expect-error global from main.js
                      if (typeof filterCharacters === "function") {
                        // @ts-expect-error global
                        filterCharacters(typeMap[label]);
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>

            <div
              id="characters-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            />
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-amber-50/50 to-red-50/50 dark:from-amber-900/10 dark:to-red-900/10">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 hero-title"
            >
              江湖风云人物
            </motion.h2>

            <div className="splide" id="featured-characters">
              <div className="splide__track">
                <ul className="splide__list" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-20 hero-title"
            >
              探索江湖世界
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <FeatureCard 
                icon={<Search className="text-white" />} 
                title="智能搜索" 
                description="支持姓名、绰号、武功等多种方式，快速定位江湖豪杰"
                color="from-amber-500 to-red-600"
              />
              <FeatureCard 
                icon={<BookOpen className="text-white" />} 
                title="性格分析" 
                description="基于大五人格模型，深度解析每个角色的内心世界"
                color="from-emerald-500 to-teal-600"
              />
              <FeatureCard 
                icon={<Users className="text-white" />} 
                title="关系图谱" 
                description="可视化展示人物间错综复杂的情感纠葛与门派羁绊"
                color="from-indigo-500 to-purple-600"
              />
              <FeatureCard 
                icon={<MapIcon className="text-white" />} 
                title="角色日志" 
                description="根据性格与环境，动态预测角色在不同时辰的行为轨迹"
                color="from-rose-500 to-pink-600"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="feature-card p-8 rounded-2xl text-center group"
    >
      <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
