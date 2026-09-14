import { HashRouter, Route, Routes } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { ScoresList } from "./pages/ScoresList";
import { CalculatorPage } from "./pages/CalculatorPage";
import { Favorites } from "./pages/Favorites";
import { About } from "./pages/About";
import { ComingSoon } from "./pages/ComingSoon";

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-dvh bg-bg">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scores" element={<ScoresList />} />
          <Route path="/scores/:id" element={<CalculatorPage />} />
          <Route path="/favoris" element={<Favorites />} />
          <Route path="/a-propos" element={<About />} />
          <Route
            path="/protocoles"
            element={
              <ComingSoon
                title="Protocoles"
                description="Les protocoles de service seront ajoutés ici une fois les référentiels sourcés (SFMU, HAS, sociétés savantes) réunis."
              />
            }
          />
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
