import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { ScrollToTop } from "./components/ScrollToTop";
import { Splash } from "./components/Splash";
import { Home } from "./pages/Home";
import { ScoresList } from "./pages/ScoresList";
import { ToolsList } from "./pages/ToolsList";
import { TreesList } from "./pages/TreesList";
import { CalculatorPage } from "./pages/CalculatorPage";
import { DecisionTreePage } from "./pages/DecisionTreePage";
import { DrugPage } from "./pages/DrugPage";
import { Favorites } from "./pages/Favorites";
import { About } from "./pages/About";
import { getTool } from "./lib/tools";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <HashRouter>
      <div className="relative flex h-dvh flex-col overflow-hidden bg-bg">
        <ScrollToTop />
        {showSplash && <Splash onDone={() => setShowSplash(false)} />}
        <div id="scroll-area" className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scores" element={<ScoresList />} />
            <Route path="/scores/:id" element={<CalculatorPage />} />
            <Route path="/calcul" element={<ToolsList />} />
            <Route path="/calcul/:id" element={<CalculatorPage lookup={getTool} />} />
            <Route path="/favoris" element={<Favorites />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/arbres" element={<TreesList />} />
            <Route path="/arbres/:id" element={<DecisionTreePage />} />
            <Route path="/medicaments/:id" element={<DrugPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </HashRouter>
  );
}
