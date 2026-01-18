import { useEffect } from "react";

export default function ActivitiesPage() {
  useEffect(() => {
    (window as any).initActivitiesPage?.();
    (window as any).loadActivitiesData?.();
    (window as any).updateVisitorStats?.();
  }, []);

  return (
    <main className="pt-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 hero-title">角色日志</h1>
          <p className="text-lg text-gray-600">
            结合当前天气，回顾角色最近的日常轨迹
          </p>
        </div>

        <div className="control-panel p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex gap-8">
              <div>
                <p className="text-lg font-bold" id="log-current-time">
                  --
                </p>
              </div>
              <div>
                <p className="text-lg font-bold" id="log-current-weather">
                  --
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 hero-title">选择角色</h3>
              <div
                id="character-selection"
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold hero-title">活动日志</h3>
                <button
                  id="log-toggle-btn"
                  className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  查看近七日
                </button>
              </div>
              <div
                id="activity-log"
                className="activity-timeline min-h-[120px] max-h-[600px] overflow-y-auto pr-2"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

