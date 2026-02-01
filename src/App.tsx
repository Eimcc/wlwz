import { HashRouter, Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import Home from "@/pages/Home";
import CharacterPage from "@/pages/Character";
import RelationsPage from "@/pages/Relations";
import ActivitiesPage from "@/pages/Activities";
import { ReactNode, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Layout({ children }: { children: ReactNode }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-300">
      <nav className="nav-bar fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white hero-title !text-white">
              武林外传图鉴
            </h1>
            <span className="text-white/80 text-sm hidden md:block italic">
              江湖儿女情，客栈风云录
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-white/90 hover:text-white hover:scale-105 transition-all font-medium"
              >
                首页
              </Link>
              <Link
                to="/character"
                className="text-white/90 hover:text-white hover:scale-105 transition-all font-medium"
              >
                角色详情
              </Link>
              <Link
                to="/relations"
                className="text-white/90 hover:text-white hover:scale-105 transition-all font-medium"
              >
                关系图谱
              </Link>
              <Link
                to="/activities"
                className="text-white/90 hover:text-white hover:scale-105 transition-all font-medium"
              >
                角色日志
              </Link>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="切换主题"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12 px-6 mt-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold hero-title !text-white">武林外传人物图鉴</h2>
          <p className="text-gray-400 italic">"额滴个神啊！这里都是江湖儿女，讲的是人情世故。"</p>
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500 pt-4">
            <span id="busuanzi_container_site_pv" style={{ display: 'none' }}>
              总访问量 <span id="busuanzi_value_site_pv" className="text-accent-yellow font-bold"></span> 次
            </span>
            <span className="hidden sm:inline text-gray-700">|</span>
            <span id="busuanzi_container_site_uv" style={{ display: 'none' }}>
              总访客数 <span id="busuanzi_value_site_uv" className="text-accent-yellow font-bold"></span> 人
            </span>
          </div>
          <p className="text-gray-600 text-xs mt-8">© 2025 武林外传. All rights reserved.</p>
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
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/index.html" element={<Home />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/relations" element={<RelationsPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
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
