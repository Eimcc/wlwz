import { useEffect } from "react";
import heroBg from "../../resources/backgrounds/inn-interior.png";

export default function Home() {
  useEffect(() => {
    (window as any).initIndexPage?.();
    (window as any).updateVisitorStats?.();
  }, []);
  return (
    <div>
      <div id="particle-background" className="particle-bg" />

      <main className="pt-20">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40" />
          <img
            src={heroBg}
            alt="同福客栈"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <h1
              className="hero-title text-6xl md:text-8xl font-bold mb-6"
              id="main-title"
            >
              武林外传
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 quote-text"
              id="main-subtitle"
            >
              "额滴个神啊！这里都是江湖儿女，讲的是人情世故。"
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
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
                className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                开始探索
              </button>
              <button
                onClick={() => {
                  window.location.href = "relations";
                }}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all"
              >
                查看关系图谱
              </button>
            </div>
          </div>
        </section>

        <section id="search-section" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="search-container p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8 hero-title">
                寻找江湖儿女
              </h2>

              <div className="relative mb-8">
                <input
                  type="text"
                  id="search-input"
                  placeholder="输入角色姓名、绰号或武功..."
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none transition-colors"
                  onInput={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    // @ts-expect-error global from main.js
                    if (typeof handleSearch === "function") {
                      // @ts-expect-error global
                      handleSearch(value);
                    }
                  }}
                />
                <div className="absolute right-4 top-4 text-gray-400">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div
                id="search-suggestions"
                className="hidden bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              />

              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <button
                  className="filter-btn px-4 py-2 rounded-full font-medium active"
                  onClick={() => {
                    // @ts-expect-error global from main.js
                    if (typeof filterCharacters === "function") {
                      // @ts-expect-error global
                      filterCharacters("all");
                    }
                  }}
                >
                  全部
                </button>
                <button
                  className="filter-btn px-4 py-2 rounded-full font-medium"
                  onClick={() => {
                    // @ts-expect-error global from main.js
                    if (typeof filterCharacters === "function") {
                      // @ts-expect-error global
                      filterCharacters("tongfu");
                    }
                  }}
                >
                  同福客栈
                </button>
                <button
                  className="filter-btn px-4 py-2 rounded-full font-medium"
                  onClick={() => {
                    // @ts-expect-error global from main.js
                    if (typeof filterCharacters === "function") {
                      // @ts-expect-error global
                      filterCharacters("official");
                    }
                  }}
                >
                  官府
                </button>
                <button
                  className="filter-btn px-4 py-2 rounded-full font-medium"
                  onClick={() => {
                    // @ts-expect-error global from main.js
                    if (typeof filterCharacters === "function") {
                      // @ts-expect-error global
                      filterCharacters("jianghu");
                    }
                  }}
                >
                  江湖
                </button>
                <button
                  className="filter-btn px-4 py-2 rounded-full font-medium"
                  onClick={() => {
                    // @ts-expect-error global from main.js
                    if (typeof filterCharacters === "function") {
                      // @ts-expect-error global
                      filterCharacters("family");
                    }
                  }}
                >
                  家族
                </button>
              </div>
            </div>

            <div
              id="characters-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            />
          </div>
        </section>

        <section className="py-16 px-6 bg-gradient-to-r from-amber-50 to-red-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 hero-title">
              江湖风云人物
            </h2>

            <div className="splide" id="featured-characters">
              <div className="splide__track">
                <ul className="splide__list" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 hero-title">
              探索江湖世界
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="feature-card p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">智能搜索</h3>
                <p className="text-gray-600">
                  支持姓名、绰号、武功等多种搜索方式
                </p>
              </div>

              <div className="feature-card p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">性格分析</h3>
                <p className="text-gray-600">
                  深入了解每个角色的性格特点和成长历程
                </p>
              </div>

              <div className="feature-card p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 0 0 4 0zM7 10a2 2 0 11-4 0 2 2 0 0 4 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">关系图谱</h3>
                <p className="text-gray-600">
                  可视化展示人物间的复杂关系网络
                </p>
              </div>

              <div className="feature-card p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">角色日志</h3>
                <p className="text-gray-600">
                  基于性格预测角色在不同情境下的行为
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
