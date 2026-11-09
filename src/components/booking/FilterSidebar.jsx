// src/components/booking/FilterSidebar.jsx
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export default function FilterSidebar({
  filters,
  setFilters,
  onReset,
  priceRange = { min: 0, max: 10000 },
}) {
  // Use the actual price range from loaded trips
  const minPrice = Math.max(0, Math.floor(priceRange.min || 0));
  const maxPrice = Math.max(minPrice + 100, Math.ceil(priceRange.max || 10000));

  // Ensure slider value is within bounds
  const sliderValue = Math.min(
    Math.max(filters.maxPrice, minPrice),
    maxPrice
  );

  const handlePriceChange = (e) => {
    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }));
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
  };

  const handleClassToggle = (cls, checked) => {
    setFilters((prev) => ({
      ...prev,
      classes: checked
        ? [...prev.classes, cls]
        : prev.classes.filter((c) => c !== cls),
    }));
  };

  const activeCount =
    (filters.classes.length > 0 ? 1 : 0) +
    (filters.maxPrice < maxPrice ? 1 : 0) +
    (filters.sort !== "departure" ? 1 : 0);

  return (
    <aside className="card p-6 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-powder/50">
        <h3 className="font-black text-ink tracking-tight flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-crimson" />
          Filter Ferries
          {activeCount > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-crimson text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-bold text-crimson hover:underline"
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* Max Price */}
      <div className="mb-7">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-navy/60 mb-3">
          Maximum Fare
        </label>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={50}
          value={sliderValue}
          onChange={handlePriceChange}
          className="w-full accent-crimson cursor-pointer"
          aria-label="Maximum price"
        />
        <div className="flex justify-between text-xs font-bold text-navy/60 mt-2">
          <span>INR {minPrice.toLocaleString("en-IN")}</span>
          <span className="text-ink">
            Up to INR {sliderValue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Sort */}
      <div className="mb-7">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-navy/60 mb-3">
          Sort By
        </label>
        <div className="space-y-2.5">
          {[
            { v: "departure",  l: "Earliest Departure" },
            { v: "price_asc",  l: "Price: Low to High" },
            { v: "price_desc", l: "Price: High to Low" },
            { v: "duration",   l: "Shortest Duration" },
          ].map((o) => (
            <label
              key={o.v}
              className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-ink/80 hover:text-ink transition-colors"
            >
              <input
                type="radio"
                name="sort"
                value={o.v}
                checked={filters.sort === o.v}
                onChange={() => handleSortChange(o.v)}
                className="w-4 h-4 accent-crimson cursor-pointer"
              />
              {o.l}
            </label>
          ))}
        </div>
      </div>

      {/* Boat Class */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-navy/60 mb-3">
          Boat Class
        </label>
        <div className="space-y-2.5">
          {["standard", "deluxe", "premium"].map((c) => (
            <label
              key={c}
              className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-ink/80 hover:text-ink transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.classes.includes(c)}
                onChange={(e) => handleClassToggle(c, e.target.checked)}
                className="w-4 h-4 accent-crimson cursor-pointer rounded"
              />
              <span className="capitalize">{c}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}