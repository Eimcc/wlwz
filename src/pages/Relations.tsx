import { useEffect } from "react";

export default function RelationsPage() {
  useEffect(() => {
    (window as any).initRelationsPage?.();
    (window as any).loadRelationsData?.();
    (window as any).updateVisitorStats?.();
  }, []);

  return (
    <main className="pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 hero-title">江湖关系图谱</h1>
          <p className="text-lg text-gray-600">
            探索武林外传人物间的复杂关系网络
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="control-panel p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 hero-title">关系筛选</h3>
              <div className="space-y-3">
                <button
                  className="filter-btn w-full px-4 py-2 rounded-lg font-medium active"
                  onClick={() => {
                    (window as any).filterRelationships?.("all");
                  }}
                >
                  显示全部
                </button>
                <button
                  className="filter-btn w-full px-4 py-2 rounded-lg font-medium"
                  onClick={() => {
                    (window as any).filterRelationships?.("love");
                  }}
                >
                  爱情关系
                </button>
                <button
                  className="filter-btn w-full px-4 py-2 rounded-lg font-medium"
                  onClick={() => {
                    (window as any).filterRelationships?.("friendship");
                  }}
                >
                  朋友关系
                </button>
                <button
                  className="filter-btn w-full px-4 py-2 rounded-lg font-medium"
                  onClick={() => {
                    (window as any).filterRelationships?.("family");
                  }}
                >
                  亲情关系
                </button>
                <button
                  className="filter-btn w-full px-4 py-2 rounded-lg font-medium"
                  onClick={() => {
                    (window as any).filterRelationships?.("enemy");
                  }}
                >
                  敌对关系
                </button>
                <button
                  className="filter-btn w-full px-4 py-2 rounded-lg font-medium"
                  onClick={() => {
                    (window as any).filterRelationships?.("sect");
                  }}
                >
                  师门关系
                </button>
              </div>
            </div>

            <div className="relationship-legend p-4 mb-6">
              <h4 className="font-bold mb-3">关系图例</h4>
              <div className="legend-item">
                <div className="legend-color bg-red-500" />
                <span>爱情</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bg-yellow-400" />
                <span>朋友</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bg-green-500" />
                <span>亲情</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bg-gray-500" />
                <span>敌对</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bg-sky-400" />
                <span>师徒</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bg-orange-400" />
                <span>追求者</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bg-teal-400" />
                <span>同门</span>
              </div>
            </div>

            <div className="stats-card p-6">
              <h3 className="text-xl font-bold mb-4 hero-title">关系统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>总关系数：</span>
                  <span id="total-relations" className="font-bold">
                    24
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>核心人物：</span>
                  <span id="core-characters" className="font-bold">
                    9
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>最强关系：</span>
                  <span id="strongest-relation" className="font-bold">
                    佟湘玉-白展堂
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="network-container p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold hero-title">关系网络</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      (window as any).resetZoom?.();
                    }}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    重置视图
                  </button>
                  <button
                    onClick={() => {
                      (window as any).toggleLayout?.();
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    切换布局
                  </button>
                </div>
              </div>
              <div
                id="network-chart"
                style={{ width: "100%", height: "600px" }}
              />
            </div>
          </div>
        </div>

        <div id="relationship-details" className="hidden mt-8">
          <div className="relationship-info p-6 mx-auto">
            <h3
              className="text-xl font-bold mb-4 hero-title"
              id="relation-title"
            >
              关系详情
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <img
                  id="relation-source-avatar"
                  src=""
                  alt=""
                  className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-amber-600"
                />
                <p id="relation-source-name" className="font-medium" />
              </div>
              <div className="text-center flex flex-col justify-center">
                <p id="relation-type" className="text-lg font-bold mb-2" />
                <div className="strength-bar mx-4">
                  <div
                    id="relation-strength-bar"
                    className="strength-fill"
                    style={{ width: "0%" }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">关系强度</p>
              </div>
              <div className="text-center">
                <img
                  id="relation-target-avatar"
                  src=""
                  alt=""
                  className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-amber-600"
                />
                <p id="relation-target-name" className="font-medium" />
              </div>
            </div>
            <p id="relation-description" className="text-gray-700 mb-4" />
            <div
              id="relation-timeline"
              className="text-sm text-gray-600"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

