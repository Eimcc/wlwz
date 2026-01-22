import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CharacterPage() {
  const location = useLocation();

  useEffect(() => {
    (window as any).initCharacterPage?.();
    const search = location.search || "";
    const params = new URLSearchParams(search);
    let characterId = params.get("id");
    if (!characterId) {
      // Fallback for direct hash access if useLocation doesn't catch it for some reason (rare in HashRouter)
      const match = window.location.href.match(/[?&]id=([^&#]*)/);
      if (match) {
        characterId = decodeURIComponent(match[1]);
      }
    }
    const targetId = characterId || "tong-xiangyu";
    (window as any).loadCharacterData?.(targetId);
    (window as any).updateVisitorStats?.();
  }, [location.search]);

  return (
    <main className="pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="character-switcher mb-4 p-4">
          <h2 className="text-xl font-bold mb-3 hero-title text-center">
            选择角色
          </h2>
          <div
            className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
            id="character-selector"
          />
        </div>

        <div id="character-detail-section">
          <div className="character-header p-5 mb-4" id="character-header">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 relative">
                <img
                  id="character-avatar"
                  src="characters/avatars/portraits/innkeeper-portrait.png"
                  alt="角色头像"
                  className="w-32 h-32 rounded-full border-4 border-amber-600 shadow-lg object-cover"
                />
                <div className="quote-bubble inline-flex absolute -top-8 left-1/2">
                  <div className="quote-bubble-left" />
                  <div className="quote-bubble-middle">
                    <p
                      id="character-quote"
                      className="text-sm italic text-gray-800"
                    >
                      额滴个神啊！
                    </p>
                  </div>
                  <div className="quote-bubble-right" />
                </div>
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-end gap-3 mb-2 justify-center md:justify-start">
                  <h1
                    id="character-name"
                    className="text-3xl font-bold hero-title leading-none"
                  >
                    佟湘玉
                  </h1>
                  <div className="flex gap-2 mb-1">
                    <span
                      className="relationship-badge text-xs px-2 py-0.5"
                      id="character-faction"
                    >
                      龙门镖局
                    </span>
                    <span
                      className="martial-arts-badge text-xs px-2 py-0.5"
                      id="character-occupation"
                    >
                      客栈掌柜
                    </span>
                  </div>
                </div>
                <p
                  id="character-description"
                  className="text-sm text-gray-700 mb-3 leading-relaxed max-w-3xl"
                >
                  同福客栈的掌柜，龙门镖局的千金，风情万种但心地善良，婆婆妈妈又十分鸡贼。虽为寡妇，却一直努力当好嫂子兼幼教家。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-3 space-y-4">
              <div className="info-card p-4">
                <h3 className="text-lg font-bold mb-3 hero-title border-b border-amber-200 pb-1">
                  基本信息
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span className="font-medium text-gray-600">姓名</span>
                    <span
                      id="character-fullname"
                      className="font-semibold text-gray-800"
                    >
                      佟湘玉
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span className="font-medium text-gray-600">别名</span>
                    <span
                      id="character-nickname"
                      className="text-gray-800 text-right"
                    >
                      佟掌柜
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span className="font-medium text-gray-600">门派</span>
                    <span id="character-sect" className="text-gray-800">
                      龙门镖局
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span className="font-medium text-gray-600">职业</span>
                    <span id="character-job" className="text-gray-800">
                      客栈掌柜
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">武功</span>
                    <span
                      id="character-kungfu"
                      className="text-gray-800 text-right truncate max-w-[120px]"
                    >
                      无
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card p-4">
                <h3 className="text-lg font-bold mb-3 hero-title border-b border-amber-200 pb-1">
                  武功技能
                </h3>
                <div
                  id="martial-arts-list"
                  className="flex flex-wrap gap-1"
                />
              </div>

              <div className="info-card p-4">
                <h3 className="text-lg font-bold mb-3 hero-title border-b border-amber-200 pb-1">
                  兴趣爱好
                </h3>
                <div
                  id="hobbies-list"
                  className="grid grid-cols-1 gap-2"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="info-card p-4">
                  <h3 className="text-lg font-bold mb-2 hero-title">
                    性格特征
                  </h3>
                  <div
                    id="personality-traits"
                    className="space-y-2"
                  />
                </div>
                <div className="info-card p-4 flex flex-col justify-center">
                  <h3 className="text-lg font-bold mb-0 hero-title text-center">
                    五维分析
                  </h3>
                  <div
                    id="personality-radar"
                    style={{ width: "100%", height: "200px" }}
                  />
                </div>
              </div>

              <div className="info-card p-4">
                <h3 className="text-lg font-bold mb-4 hero-title border-b border-amber-200 pb-1">
                  人生历程
                </h3>
                <div
                  id="character-timeline"
                  className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
                />
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div className="info-card p-4">
                <h3 className="text-lg font-bold mb-3 hero-title border-b border-amber-200 pb-1">
                  重要关系
                </h3>
                <div
                  id="relationships-list"
                  className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar"
                />
                <div className="mt-3 text-center">
                  <button
                    onClick={() => {
                      window.location.href = "relations";
                    }}
                    className="text-xs bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full hover:bg-amber-200 transition-colors"
                  >
                    查看图谱
                  </button>
                </div>
              </div>

              <div className="info-card p-4">
                <h3 className="text-lg font-bold mb-3 hero-title border-b border-amber-200 pb-1">
                  相关推荐
                </h3>
                <div
                  id="recommendations"
                  className="space-y-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

