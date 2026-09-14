import { Header } from "../components/Header";
import { CalculatorListItem } from "../components/CalculatorListItem";
import { searchCalculators } from "../lib/calculators";
import { useFavorites } from "../lib/favorites";

export function Favorites() {
  const { favorites } = useFavorites();
  const items = searchCalculators("").filter((c) => favorites.includes(c.id));

  return (
    <div>
      <Header title="Favoris" />
      <div className="mx-auto flex max-w-xl flex-col gap-2.5 px-4 pb-24 pt-4">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
            Aucun favori pour l'instant. Ouvrez un score et appuyez sur l'étoile pour l'épingler ici.
          </p>
        ) : (
          items.map((c) => <CalculatorListItem key={c.id} calc={c} />)
        )}
      </div>
    </div>
  );
}
