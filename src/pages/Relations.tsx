import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Filter, PieChart, Maximize2, Layout as LayoutIcon, Info } from "lucide-react";

export default function RelationsPage() {
  useEffect(() => {
    (window as any).initRelationsPage?.();
    (window as any).loadRelationsData?.();
    (window as any).updateVisitorStats?.();
  }, []);

  return (
    <main className="pt-24 pb-16 px-6 bg-paper-bg/30">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 hero-title text-center">江湖关系图谱</h1>
          <p className="text-lg text-gray-500 italic text-center">
            "探索武林外传人物间的复杂关系网络"
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="glass-card p-6 rounded-3xl border-amber-100">
              <div className="flex items-center gap-3 mb-6 text-amber-800 border-b border-amber-50 pb-4">
                <Filter className="w-5 h-5" />
                <h3 className="font-bold">关系筛选</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: '显示全部', type: 'all' },
                  { label: '爱情关系', type: 'love' },
                  { label: '朋友关系', type: 'friendship' },
                  { label: '亲情关系', type: 'family' },
                  { label: '敌对关系', type: 'enemy' },
                  { label: '师门关系', type: 'sect' }
                ].map((item) => (
                  <button
                    key={item.type}
                    className="filter-btn w-full px-4 py-2.5 rounded-xl font-medium text-sm text-left transition-all"
                    onClick={() => {
                      (window as any).filterRelationships?.(item.type);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border-amber-100">
              <div className="flex items-center gap-3 mb-6 text-amber-800 border-b border-amber-50 pb-4">
                <Info className="w-5 h-5" />
                <h4 className="font-bold">关系图例</h4>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <LegendItem color="bg-red-500" label="爱情" />
                <LegendItem color="bg-yellow-400" label="朋友" />
                <LegendItem color="bg-green-500" label="亲情" />
                <LegendItem color="bg-gray-500" label="敌对" />
                <LegendItem color="bg-sky-400" label="师徒" />
                <LegendItem color="bg-orange-400" label="追求" />
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border-amber-100">
              <div className="flex items-center gap-3 mb-6 text-amber-800 border-b border-amber-50 pb-4">
                <PieChart className="w-5 h-5" />
                <h3 className="font-bold">关系统计</h3>
              </div>
              <div className="space-y-4">
                <StatRow label="总关系数" id="total-relations" />
                <StatRow label="核心人物" id="core-characters" />
                <div className="p-3 bg-white/40 rounded-2xl">
                  <span className="text-xs text-gray-400 block mb-1 uppercase">最强关系</span>
                  <span id="strongest-relation" className="font-bold text-amber-900 truncate block">--</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Network Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-9"
          >
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-3 text-amber-800">
                  <Network className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">关系网络</h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => (window as any).resetZoom?.()}
                    className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-xl hover:bg-amber-200 transition-all font-medium text-sm"
                  >
                    <Maximize2 size={16} /> 重置视图
                  </button>
                  <button
                    onClick={() => (window as any).toggleLayout?.()}
                    className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl hover:bg-emerald-200 transition-all font-medium text-sm"
                  >
                    <LayoutIcon size={16} /> 切换布局
                  </button>
                </div>
              </div>
              <div
                id="network-chart"
                className="w-full h-[650px] relative z-10"
              />
              
              {/* Background Decoration */}
              <div className="absolute -bottom-20 -right-20 p-20 opacity-[0.02] pointer-events-none">
                <Network size={400} />
              </div>
            </div>

            {/* Relationship Details Panel */}
            <AnimatePresence>
              <div id="relationship-details" className="hidden mt-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-8 rounded-3xl border-red-100 shadow-xl shadow-red-900/5"
                >
                  <h3 className="text-2xl font-bold mb-8 hero-title text-center" id="relation-title">
                    关系详情
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-8">
                    <div className="text-center group">
                      <div className="relative inline-block">
                        <img
                          id="relation-source-avatar"
                          src=""
                          alt=""
                          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg transition-transform group-hover:scale-110"
                        />
                      </div>
                      <p id="relation-source-name" className="text-lg font-bold text-amber-900" />
                    </div>
                    
                    <div className="text-center space-y-4">
                      <p id="relation-type" className="text-2xl font-black text-red-600 tracking-widest" />
                      <div className="space-y-2">
                        <div className="strength-bar h-3 rounded-full bg-amber-100 overflow-hidden">
                          <div
                            id="relation-strength-bar"
                            className="strength-fill h-full bg-gradient-to-r from-red-500 to-amber-600 transition-all duration-1000"
                            style={{ width: "0%" }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase">关系强度</p>
                      </div>
                    </div>

                    <div className="text-center group">
                      <div className="relative inline-block">
                        <img
                          id="relation-target-avatar"
                          src=""
                          alt=""
                          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg transition-transform group-hover:scale-110"
                        />
                      </div>
                      <p id="relation-target-name" className="text-lg font-bold text-amber-900" />
                    </div>
                  </div>
                  <div className="max-w-2xl mx-auto text-center">
                    <p id="relation-description" className="text-gray-600 text-lg leading-relaxed italic" />
                  </div>
                </motion.div>
              </div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
}

function StatRow({ label, id }: { label: string, id: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-white/40 rounded-2xl">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span id={id} className="font-bold text-amber-900 tracking-tight">--</span>
    </div>
  );
}

