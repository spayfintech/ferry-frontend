// src/pages/FerryBookingPage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, CalendarDays, Users, MapPin, Filter, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import { publicApi } from "../api/public.api";
import { useGet } from "../hooks/useGet";
import TripCard from "../components/booking/TripCard";
import FilterSidebar from "../components/booking/FilterSidebar";
import BookingModal from "../components/booking/BookingModal";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";

const DEFAULT_FILTERS = {
  maxPrice: 100000,
  minPrice: 0,
  sort: "departure",
  classes: [],
  operator: "",
};

export default function FerryBookingPage() {
  const [params, setParams] = useSearchParams();

  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo]     = useState(params.get("to") || "");
  const [date, setDate] = useState(
    params.get("date") || new Date().toISOString().split("T")[0]
  );
  const [pax, setPax]   = useState(params.get("passengers") || "1");

  const [trips, setTrips]               = useState([]);
  const [loading, setLoading]           = useState(false);
  const [searched, setSearched]         = useState(false);
  const [browsing, setBrowsing]         = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showFilters, setShowFilters]   = useState(false);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: locResp } = useGet("/locations");
  const locations = locResp?.data || [];

  /* =========================================================
   * Helpers — Auto-fit price range to loaded trips
   * ========================================================= */
  const applyPriceRangeFromTrips = (items) => {
    if (items.length === 0) return;
    const prices = items.map((t) => Number(t.base_price || 0));
    const maxPrice = Math.max(...prices);
    setFilters((prev) => ({
      ...prev,
      minPrice: 0,
      maxPrice: Math.ceil(maxPrice / 100) * 100 + 100,
    }));
  };

  /* =========================================================
   * Load all upcoming trips (default browse mode)
   * ========================================================= */
  const loadUpcoming = useCallback(async () => {
    setLoading(true);
    setBrowsing(true);
    setSearched(false);

    try {
      const res = await publicApi.upcomingTrips({ limit: 50 });
      const items = res?.data?.data?.items || [];
      setTrips(items);
      applyPriceRangeFromTrips(items);
    } catch (err) {
      toast.error("Failed to load trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================================
   * Search with filters
   * ========================================================= */
  const runSearch = useCallback(async () => {
    if (!from || !to || !date) {
      toast.error("Please select origin, destination and date");
      return;
    }
    if (String(from) === String(to)) {
      toast.error("Origin and destination cannot be the same");
      return;
    }

    setLoading(true);
    setSearched(true);
    setBrowsing(false);

    try {
      const res = await publicApi.search({ from, to, date, passengers: pax });
      const items = res?.data?.data?.items || [];
      setTrips(items);
      applyPriceRangeFromTrips(items);
      setParams({ from, to, date, passengers: pax }, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Search failed");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [from, to, date, pax, setParams]);

  /* =========================================================
   * On mount: search if URL has params, else browse all
   * ========================================================= */
  useEffect(() => {
    if (from && to && date) {
      runSearch();
    } else {
      loadUpcoming();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
   * Applied filters + sort
   * ========================================================= */
  const filteredTrips = useMemo(() => {
    let list = [...trips];

    list = list.filter((t) => {
      const price = Number(t.base_price || 0);
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    if (filters.classes.length > 0) {
      list = list.filter((t) => filters.classes.includes(t.seat_class));
    }

    if (filters.operator) {
      list = list.filter((t) =>
        t.boat?.name?.toLowerCase().includes(filters.operator.toLowerCase())
      );
    }

    switch (filters.sort) {
      case "price_asc":
        list.sort((a, b) => Number(a.base_price) - Number(b.base_price));
        break;
      case "price_desc":
        list.sort((a, b) => Number(b.base_price) - Number(a.base_price));
        break;
      case "duration":
        list.sort((a, b) => a.duration_minutes - b.duration_minutes);
        break;
      default:
        list.sort((a, b) => new Date(a.departure_at) - new Date(b.departure_at));
    }

    return list;
  }, [trips, filters]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTrips = filteredTrips.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [trips, filters]);

  /* =========================================================
   * Derived info
   * ========================================================= */
  const fromName = locations.find((l) => String(l.id) === String(from))?.name || "—";
  const toName   = locations.find((l) => String(l.id) === String(to))?.name || "—";

  const priceRange = useMemo(() => {
    if (trips.length === 0) return { min: 0, max: 10000 };
    const prices = trips.map((t) => Number(t.base_price || 0));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [trips]);

  const handleResetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      maxPrice: Math.ceil(priceRange.max / 100) * 100 + 100,
    });
  };

  const handleResetSearch = () => {
    setFrom("");
    setTo("");
    setParams({}, { replace: true });
    loadUpcoming();
  };

  /* =========================================================
   * Render
   * ========================================================= */
  return (
    <div className="bg-mist min-h-screen">
      {/* ============ Hero ============ */}
      <div className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/15 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-powder/10 blur-3xl translate-y-1/3 -translate-x-1/3" />
        <div className="relative container-x py-16 md:py-20 text-white">
          <div className="section-label text-crimson-light">Book Your Ferry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            Ferry Booking
          </h1>
          <p className="text-powder/80 max-w-xl leading-relaxed">
            Search schedules, compare ferry operators and reserve seats for your Andaman journey.
          </p>
        </div>
      </div>

      {/* ============ Search card ============ */}
      <div className="container-x -mt-10 relative z-10 mb-10">
        <div className="bg-white rounded-3xl shadow-modal p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <SelectField
              icon={<MapPin size={11} />}
              label="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="">Select origin</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </SelectField>

            <SelectField
              icon={<MapPin size={11} />}
              label="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">Select destination</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id} disabled={String(l.id) === String(from)}>
                  {l.name}
                </option>
              ))}
            </SelectField>

            <div>
              <label className="flex items-center gap-1.5 text-[9px] font-bold text-navy/60 uppercase tracking-[0.18em] mb-1.5">
                <CalendarDays size={11} /> Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm font-semibold text-ink focus:border-steel focus:outline-none cursor-pointer"
              />
            </div>

            <SelectField
              icon={<Users size={11} />}
              label="Passengers"
              value={pax}
              onChange={(e) => setPax(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n} Passenger{n > 1 ? "s" : ""}
                </option>
              ))}
            </SelectField>

            <div className="flex items-end">
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onClick={runSearch}
                leftIcon={!loading && <Search size={16} />}
                className="w-full"
              >
                {loading ? "Searching…" : "Search"}
              </Button>
            </div>
          </div>

          {/* Reset to browse all */}
          {(searched || from || to) && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={handleResetSearch}
                className="text-xs font-bold text-crimson hover:underline"
              >
                ← Show all upcoming ferries
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============ Results ============ */}
      <div className="container-x pb-20">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
              priceRange={priceRange}
            />
          </div>

          <div>
            {/* Sidebar toggle — mobile */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={showFilters ? <X size={16} /> : <Filter size={16} />}
                className="w-full"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              {showFilters && (
                <div className="mt-4">
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    onReset={handleResetFilters}
                    priceRange={priceRange}
                  />
                </div>
              )}
            </div>

            {/* Header */}
            {!loading && trips.length > 0 && (
              <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
                <div>
                  {browsing && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-crimson/10 text-crimson text-[10px] font-bold uppercase tracking-widest mb-2">
                      <Sparkles size={10} /> All Upcoming
                    </span>
                  )}
                  <h2 className="text-2xl font-black text-ink tracking-tight">
                    {filteredTrips.length}{" "}
                    {filteredTrips.length === 1 ? "ferry" : "ferries"} available
                  </h2>

                  {searched && fromName !== "—" && (
                    <p className="text-sm text-navy/60 mt-0.5">
                      {fromName} → {toName} •{" "}
                      {new Date(date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  {browsing && (
                    <p className="text-sm text-navy/60 mt-0.5">
                      Browse all ferries sailing in the coming days
                    </p>
                  )}
                </div>

                {(filters.classes.length > 0 ||
                  filters.sort !== "departure" ||
                  filters.maxPrice < priceRange.max + 100) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-crimson hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <Spinner variant="centered" label="Loading ferries…" />
            )}

            {/* Empty state */}
            {!loading && filteredTrips.length === 0 && (
              <div className="card p-16 text-center">
                <div className="w-16 h-16 rounded-full bg-powder/40 flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-steel" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">
                  No ferries found
                </h3>
                <p className="text-navy/60 mb-6">
                  {trips.length > 0
                    ? "Your filters removed all results. Try widening the price range."
                    : browsing
                    ? "No upcoming ferries scheduled yet."
                    : "Try a different date or route."}
                </p>

                {trips.length > 0 && (
                  <Button variant="outline" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                )}

                {trips.length === 0 && browsing && (
                  <Button variant="outline" onClick={loadUpcoming}>
                    Refresh
                  </Button>
                )}

                {trips.length === 0 && !browsing && (
                  <Button variant="outline" onClick={handleResetSearch}>
                    Show All Upcoming
                  </Button>
                )}
              </div>
            )}

            {/* Trip list */}
            <div className="space-y-4">
              {!loading &&
                paginatedTrips.map((trip) => (
                  <TripCard
                    key={trip.trip_id}
                    trip={trip}
                    onSelect={setSelectedTrip}
                  />
                ))}
            </div>

            {!loading && totalPages > 1 && (
              <nav
                className="mt-8 flex flex-wrap items-center justify-between gap-4"
                aria-label="Trip results pages"
              >
                <p className="text-sm text-navy/60">
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + itemsPerPage, filteredTrips.length)} of{" "}
                  {filteredTrips.length} ferries
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => page - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-powder/60 px-3 py-2 text-sm font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={currentPage === page ? "page" : undefined}
                        aria-label={`Go to page ${page}`}
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                          currentPage === page
                            ? "border-brand bg-brand text-white"
                            : "border-powder/60 text-brand hover:bg-brand-cyan/10"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => page + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-powder/60 px-3 py-2 text-sm font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Booking modal */}
      <BookingModal
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        trip={selectedTrip}
      />
    </div>
  );
}

/* =========================================================
 * Reusable small select field
 * ========================================================= */
function SelectField({ icon, label, children, ...props }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[9px] font-bold text-navy/60 uppercase tracking-[0.18em] mb-1.5">
        {icon} {label}
      </label>
      <select
        className="w-full px-3 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm font-semibold text-ink focus:border-steel focus:outline-none cursor-pointer"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}