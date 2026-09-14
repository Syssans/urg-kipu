import { HashRouter, Route, Routes } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { ScoresList } from "./pages/ScoresList";
import { ToolsList } from "./pages/ToolsList";
import { CalculatorPage } from "./pages/CalculatorPage";
import { Favorites } from "./pages/Favorites";
import { About } from "./pages/About";
import { ComingSoon } from "./pages/ComingSoon";
import { getTool } from "./lib/tools";

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-svh bg-bg">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scores" element={<ScoresList />} />
          <Route path="/scores/:id" element={<CalculatorPage />} />
          <Route path="/calcul" element={<ToolsList />} />
          <Route path="/calcul/:id" element={<CalculatorPage lookup={getTool} />} />
          <Route path="/favoris" element={<Favorites />} />
          <Route path="/a-propos" element={<About />} />
          <Route
            path="/arbres"
            element={
              <ComingSoon
                title="Arbres décisionnels"
                description="Les arbres décisionnels cliniques seront ajoutés ici une fois les référentiels sourcés réunis."
              />
            }
          />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
}
