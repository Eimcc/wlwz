import { HashRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "@/pages/Home";
import CharacterPage from "@/pages/Character";
import RelationsPage from "@/pages/Relations";
import ActivitiesPage from "@/pages/Activities";
import { ReactNode, useEffect } from "react";

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
          <div className="flex justify-center items-center gap-4 text-sm text-gray-400 pt-2">
            <span id="busuanzi_container_site_pv" style={{ display: 'none' }}>
              总访问量 <span id="busuanzi_value_site_pv" className="text-yellow-500 font-bold"></span> 次
            </span>
            <span className="hidden sm:inline">|</span>
            <span id="busuanzi_container_site_uv" style={{ display: 'none' }}>
              总访客数 <span id="busuanzi_value_site_uv" className="text-yellow-500 font-bold"></span> 人
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("target");
    if (!target) return;

    params.delete("target");
    const rest = params.toString();
    const search = rest ? `?${rest}` : "";

    if (target === "relations") {
      navigate(`/relations${search}`, { replace: true });
    } else if (target === "character") {
      navigate(`/character${search}`, { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/character" element={<CharacterPage />} />
        <Route path="/relations" element={<RelationsPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
