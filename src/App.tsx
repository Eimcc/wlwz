import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import CharacterPage from "@/pages/Character";
import RelationsPage from "@/pages/Relations";
import ActivitiesPage from "@/pages/Activities";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="nav-bar fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white hero-title">
              武林外传图鉴
            </h1>
            <span className="text-white text-sm hidden md:block">
              江湖儿女情，客栈风云录
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="./"
              className="text-white hover:text-yellow-300 transition-colors font-medium"
            >
              首页
            </a>
            <a
              href="character"
              className="text-white hover:text-yellow-300 transition-colors font-medium"
            >
              角色详情
            </a>
            <a
              href="relations"
              className="text-white hover:text-yellow-300 transition-colors font-medium"
            >
              关系图谱
            </a>
            <a
              href="activities"
              className="text-white hover:text-yellow-300 transition-colors font-medium"
            >
              角色日志
            </a>
          </div>
        </div>
      </nav>
      {children}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto text-center space-y-1">
          <p className="text-lg">武林外传人物图鉴</p>
          <p className="text-gray-400">© 2025 江湖儿女情，客栈风云录</p>
          <p className="text-gray-300 text-sm">
            今日小店食客
            <span id="visitor-today" className="font-semibold mx-1">
              -
            </span>
            位，历史食客
            <span id="visitor-total" className="font-semibold mx-1">
              -
            </span>
            位
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          <Route path="/character" element={<CharacterPage />} />
          <Route path="/relations" element={<RelationsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
