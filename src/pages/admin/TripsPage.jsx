// src/pages/admin/TripsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, CalendarClock, Eye } from "lucide-react";
import toast from "react-hot-toast";

import { adminApi } from "../../api/public.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency, formatDateTime } from "../../lib/formatters";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [boats, setBoats] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [bulkOpen, setBulkOpen]   = useState(false);
  const [saving, setSaving]       = useState(false);

  const emptyForm = {
    boat_id: "",
    from_location_id: "",
    to_location_id: "",
    departure_at: "",
    arrival_at: "",
    base_price: 1899,
    seat_class: "standard",
    status: "active",
  };

  const emptyBulk = {
    boat_id: "",
    from_location_id: "",
    to_location_id: "",
    start_date: "",
    end_date: "",
    times: ["08:00", "10:00"],
    duration_minutes: 90,
    base_price: 1899,
    seat_class: "standard",
  };

  const [form, setForm] = useState(emptyForm);
  const [bulk, setBulk] = useState(emptyBulk);

  const load = async () => {
    setLoading(true);
    try {
      const [tripsRes, boatsRes, locRes] = await Promise.all([
        adminApi.trips(),
        adminApi.boats(),
        adminApi.locations(),
      ]);
      setTrips(tripsRes?.data?.data || []);
      setBoats((boatsRes?.data?.data || []).filter((b) => b.booking_mode === "seat_based"));
      setLocations(locRes?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createTrip(form);
      toast.success("Trip created with auto-generated seats");
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach((m) => toast.error(m));
      else toast.error(err?.response?.data?.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const handleBulk = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApi.bulkTrips(bulk);
      toast.success(res?.data?.message || "Bulk trips created");
      setBulkOpen(false);
      setBulk(emptyBulk);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Bulk create failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (trip) => {
    if (!confirm("Delete this trip? Any existing bookings will block deletion.")) return;
    try {
      await adminApi.deleteTrip(trip.id);
      toast.success("Trip deleted");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="section-label">Manage</div>
          <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight">Trips</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkOpen(true)} leftIcon={<CalendarClock size={16} />}>
            Bulk Create
          </Button>
          <Button onClick={() => setModalOpen(true)} leftIcon={<Plus size={16} />}>
            New Trip
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner variant="centered" />
      ) : trips.length === 0 ? (
        <div className="card p-16 text-center">
          <CalendarClock size={48} className="mx-auto text-powder mb-3" />
          <p className="text-navy/60 mb-5">No trips scheduled yet.</p>
          <Button onClick={() => setModalOpen(true)} leftIcon={<Plus size={16} />}>
            Create Your First Trip
          </Button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-mist text-navy/60 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="text-left px-6 py-3 font-bold">Boat</th>
                  <th className="text-left px-6 py-3 font-bold">Route</th>
                  <th className="text-left px-6 py-3 font-bold">Departure</th>
                  <th className="text-left px-6 py-3 font-bold">Price</th>
                  <th className="text-left px-6 py-3 font-bold">Seats</th>
                  <th className="text-left px-6 py-3 font-bold">Status</th>
                  <th className="text-right px-6 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t.id} className="border-t border-powder/40 hover:bg-mist/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-ink">{t.boat?.name}</td>
                    <td className="px-6 py-4 text-navy/70">
                      {t.from_location?.name} → {t.to_location?.name}
                    </td>
                    <td className="px-6 py-4 text-navy/70">
                      {formatDateTime(t.departure_at)}
                    </td>
                    <td className="px-6 py-4 font-bold text-ink">{formatCurrency(t.base_price)}</td>
                    <td className="px-6 py-4 text-navy/70">{t.total_seats}</td>
                    <td className="px-6 py-4">
                      <Badge variant={t.status === "active" ? "success" : "warning"} size="sm">
                        {t.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link to={`/admin/trips/${t.id}/seats`}>
                          <Button size="sm" variant="outline" leftIcon={<Eye size={13} />}>
                            Seats
                          </Button>
                        </Link>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(t)}>
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Trip Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Trip"
        subtitle="Seats are generated automatically based on the boat's seat layout."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Boat *"
            value={form.boat_id}
            onChange={(e) => setForm({ ...form, boat_id: e.target.value })}
            placeholder="Select a boat"
            options={boats.map((b) => ({ value: b.id, label: `${b.name} (${b.capacity} seats)` }))}
            required
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="From *"
              value={form.from_location_id}
              onChange={(e) => setForm({ ...form, from_location_id: e.target.value })}
              placeholder="Origin"
              options={locations.map((l) => ({ value: l.id, label: l.name }))}
              required
            />
            <Select
              label="To *"
              value={form.to_location_id}
              onChange={(e) => setForm({ ...form, to_location_id: e.target.value })}
              placeholder="Destination"
              options={locations.map((l) => ({
                value: l.id,
                label: l.name,
                disabled: String(l.id) === String(form.from_location_id),
              }))}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Departure *"
              type="datetime-local"
              value={form.departure_at}
              onChange={(e) => setForm({ ...form, departure_at: e.target.value })}
              required
            />
            <Input
              label="Arrival *"
              type="datetime-local"
              value={form.arrival_at}
              onChange={(e) => setForm({ ...form, arrival_at: e.target.value })}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Base Price (INR ) *"
              type="number"
              min="0"
              value={form.base_price}
              onChange={(e) => setForm({ ...form, base_price: e.target.value })}
              required
            />
            <Select
              label="Seat Class"
              value={form.seat_class}
              onChange={(e) => setForm({ ...form, seat_class: e.target.value })}
              options={[
                { value: "standard", label: "Standard" },
                { value: "deluxe",   label: "Deluxe" },
                { value: "premium",  label: "Premium" },
              ]}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="flex-1">Create Trip</Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Create Modal */}
      <Modal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk Create Trips"
        subtitle="Generate daily trips for a date range with multiple times."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleBulk} className="space-y-4">
          <Select
            label="Boat *"
            value={bulk.boat_id}
            onChange={(e) => setBulk({ ...bulk, boat_id: e.target.value })}
            placeholder="Select a boat"
            options={boats.map((b) => ({ value: b.id, label: b.name }))}
            required
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="From *"
              value={bulk.from_location_id}
              onChange={(e) => setBulk({ ...bulk, from_location_id: e.target.value })}
              placeholder="Origin"
              options={locations.map((l) => ({ value: l.id, label: l.name }))}
              required
            />
            <Select
              label="To *"
              value={bulk.to_location_id}
              onChange={(e) => setBulk({ ...bulk, to_location_id: e.target.value })}
              placeholder="Destination"
              options={locations.map((l) => ({
                value: l.id,
                label: l.name,
                disabled: String(l.id) === String(bulk.from_location_id),
              }))}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              value={bulk.start_date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setBulk({ ...bulk, start_date: e.target.value })}
              required
            />
            <Input
              label="End Date *"
              type="date"
              value={bulk.end_date}
              min={bulk.start_date}
              onChange={(e) => setBulk({ ...bulk, end_date: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-navy/70 uppercase tracking-[0.15em] mb-2">
              Departure Times *
            </label>
            <div className="space-y-2">
              {bulk.times.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="time"
                    value={t}
                    onChange={(e) => {
                      const next = [...bulk.times];
                      next[i] = e.target.value;
                      setBulk({ ...bulk, times: next });
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm focus:border-steel focus:outline-none"
                    required
                  />
                  {bulk.times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setBulk({ ...bulk, times: bulk.times.filter((_, idx) => idx !== i) })}
                      className="px-3 rounded-xl bg-red-50 text-crimson hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setBulk({ ...bulk, times: [...bulk.times, "12:00"] })}
                className="text-sm font-bold text-crimson hover:underline"
              >
                + Add another time
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Duration (minutes) *"
              type="number"
              min="5"
              value={bulk.duration_minutes}
              onChange={(e) => setBulk({ ...bulk, duration_minutes: Number(e.target.value) })}
              required
            />
            <Input
              label="Base Price (INR ) *"
              type="number"
              min="0"
              value={bulk.base_price}
              onChange={(e) => setBulk({ ...bulk, base_price: e.target.value })}
              required
            />
          </div>

          <div className="rounded-xl bg-mist p-4 text-xs text-navy/70 leading-relaxed">
            <strong className="text-ink">Preview:</strong> This will create {bulk.times.length} trip{bulk.times.length > 1 ? "s" : ""} per day
            {bulk.start_date && bulk.end_date ? ` from ${bulk.start_date} to ${bulk.end_date}` : ""}.
            Seats are auto-generated for every trip.
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setBulkOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="flex-1">Generate Trips</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}