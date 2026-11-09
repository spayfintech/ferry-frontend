// src/pages/MyBookingsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ship, Ticket, X } from "lucide-react";
import toast from "react-hot-toast";

import { publicApi } from "../api/public.api";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import { formatCurrency, formatDateTime } from "../lib/formatters";

export default function MyBookingsPage() {
  const { isLoggedIn, ready } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [cancellingRef, setCancellingRef] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await publicApi.myBookings();
      setBookings(res?.data?.data?.items || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (isLoggedIn) load(); 
  }, [isLoggedIn]);

  const handleCancel = async (ref) => {
    if (!window.confirm("Are you sure you want to cancel this booking? Refund policies apply.")) return;
    
    setCancellingRef(ref);
    try {
      await publicApi.cancelMyBooking(ref);
      toast.success("Booking cancelled successfully");
      load(); // Reload list to reflect status
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingRef(null);
    }
  };

  if (!ready) return <Spinner variant="centered" />;

  if (!isLoggedIn) {
    return (
      <div className="container-x py-24 text-center">
        <h2 className="section-title mb-4">Sign in to view your bookings</h2>
        <p className="text-navy/60 mb-8">Access all your ferry & private boat bookings in one place.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/login"><Button>Sign In</Button></Link>
          <Link to="/register"><Button variant="outline">Create Account</Button></Link>
        </div>
      </div>
    );
  }

  const statusVariant = (s) =>
    s === "confirmed" ? "success" :
    s === "pending"   ? "warning" :
    s === "cancelled" ? "danger" : "default";

  return (
    <div className="bg-mist min-h-screen py-14">
      <div className="container-x max-w-4xl">
        <div className="mb-10">
          <div className="section-label">My Bookings</div>
          <h1 className="section-title">Your journey history</h1>
        </div>

        {loading && <Spinner variant="centered" label="Loading bookings…" />}

        {!loading && bookings.length === 0 && (
          <div className="card p-16 text-center">
            <Ticket size={56} className="mx-auto text-powder mb-4" />
            <h3 className="text-xl font-bold text-ink mb-2">No bookings yet</h3>
            <p className="text-navy/60 mb-6">Start your island adventure today.</p>
            <Link to="/ferry-booking"><Button>Book a Ferry</Button></Link>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.booking_reference} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1">
                    Booking Reference
                  </div>
                  <div className="font-black text-ink text-lg tracking-tight">
                    {b.booking_reference}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                  <Badge variant={b.payment_status === "paid" ? "success" : "warning"}>
                    {b.payment_status === "paid" ? "Paid" : "Pay on boarding"}
                  </Badge>
                </div>
              </div>

              {b.booking_type === "seat" && b.trip && (
                <div className="grid sm:grid-cols-3 gap-4 pt-5 border-t border-powder/50">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1.5 flex items-center gap-1.5">
                      <Ship size={11} /> Boat
                    </div>
                    <div className="font-bold text-ink text-sm">{b.trip.boat}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1.5 flex items-center gap-1.5">
                      <MapPin size={11} /> Route
                    </div>
                    <div className="font-bold text-ink text-sm">
                      {b.trip.from} → {b.trip.to}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1.5 flex items-center gap-1.5">
                      <Calendar size={11} /> Departure
                    </div>
                    <div className="font-bold text-ink text-sm">
                      {formatDateTime(b.trip.departure_at)}
                    </div>
                  </div>
                </div>
              )}

              {b.booking_type === "charter" && b.charter && (
                <div className="grid sm:grid-cols-2 gap-4 pt-5 border-t border-powder/50">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1.5">Boat</div>
                    <div className="font-bold text-ink text-sm">{b.charter.boat_name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1.5">Window</div>
                    <div className="font-bold text-ink text-sm">
                      {formatDateTime(b.charter.start_at)} → {formatDateTime(b.charter.end_at)}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-5 border-t border-powder/50">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Total</div>
                  <div className="font-black text-crimson text-xl">
                    {formatCurrency(b.total_amount)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/booking/${b.booking_reference}`}>
                    <Button size="sm" variant="dark">View Details</Button>
                  </Link>
                  {b.status !== "cancelled" && b.status !== "completed" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleCancel(b.booking_reference)}
                      loading={cancellingRef === b.booking_reference}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}