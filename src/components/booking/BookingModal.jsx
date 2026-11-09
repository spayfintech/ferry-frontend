// src/components/booking/BookingModal.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { User, Phone, Mail, MessageSquare } from "lucide-react";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import SeatMap from "./SeatMap";
import { publicApi } from "../../api/public.api";
import { formatCurrency, formatDateTime } from "../../lib/formatters";

const passengerSchema = z.object({
  passenger_name:  z.string().min(2, "Name is too short"),
  passenger_phone: z.string().min(10, "Phone number is invalid"),
  passenger_email: z.string().email("Invalid email").optional().or(z.literal("")),
  notes:           z.string().max(500).optional().or(z.literal("")),
});

export default function BookingModal({ isOpen, onClose, trip }) {
  const navigate = useNavigate();
  const [seats, setSeats]         = useState([]);
  const [selected, setSelected]   = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(passengerSchema),
  });

  useEffect(() => {
    if (!isOpen || !trip) return;
    setSelected([]);
    reset();
    (async () => {
      setLoadingSeats(true);
      try {
        const res = await publicApi.tripSeats(trip.trip_id);
        setSeats(res?.data?.data?.seats || []);
      } catch {
        toast.error("Failed to load seat map");
      } finally {
        setLoadingSeats(false);
      }
    })();
  }, [isOpen, trip, reset]);

  const toggleSeat = (seat) => {
    setSelected((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const total = selected.reduce((sum, s) => sum + Number(s.price || 0), 0);

  const onSubmit = async (data) => {
    if (selected.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    setSubmitting(true);
    try {
      const res = await publicApi.createBooking({
        trip_id: trip.trip_id,
        seat_ids: selected.map((s) => s.id),
        ...data,
      });

        if (res?.data?.success) {
        toast.success("Booking created! Please complete payment.");
        onClose();
        // Redirect to Checkout instead of final booking
        navigate(`/checkout/${res.data.data.booking_reference}`);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Booking failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!trip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Book ${trip.boat?.name}`}
      subtitle={`${trip.from} → ${trip.to} • ${formatDateTime(trip.departure_at)} • ${formatCurrency(trip.base_price)} per passenger`}
      maxWidth="max-w-3xl"
    >
      {loadingSeats ? (
        <Spinner variant="centered" label="Loading seat map…" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Seat map */}
          <div>
            <h3 className="text-sm font-black text-ink uppercase tracking-widest mb-4">
              1. Select Seats
            </h3>
            <SeatMap
              seats={seats}
              selectedIds={selected.map((s) => s.id)}
              onToggle={toggleSeat}
            />

            {selected.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-mist border border-powder/50">
                <div className="text-[10px] font-bold uppercase tracking-widest text-navy/60 mb-2">
                  Selected Seats
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1 rounded-lg bg-brand-gradient text-white text-xs font-bold"
                    >
                      {s.seat_number}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Passenger details */}
          <div>
            <h3 className="text-sm font-black text-ink uppercase tracking-widest mb-4">
              2. Passenger Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="Enter passenger name"
                leftIcon={<User size={16} />}
                error={errors.passenger_name?.message}
                {...register("passenger_name")}
              />
              <Input
                label="Mobile Number *"
                placeholder="+91 98765 43210"
                leftIcon={<Phone size={16} />}
                error={errors.passenger_phone?.message}
                {...register("passenger_phone")}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Input
                label="Email (optional)"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={16} />}
                error={errors.passenger_email?.message}
                {...register("passenger_email")}
              />
              <Input
                label="Special Notes (optional)"
                placeholder="Any request?"
                leftIcon={<MessageSquare size={16} />}
                {...register("notes")}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl bg-ink text-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-powder/70">Seats</span>
              <span className="font-bold">{selected.length}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <span className="text-sm text-powder/70">Total Amount</span>
              <span className="text-2xl font-black text-powder">{formatCurrency(total)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-powder/70">
              <span>Payment method</span>
              <span className="font-bold text-white">Pay on boarding</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              disabled={selected.length === 0}
              className="flex-1"
            >
              {submitting ? "Confirming…" : `Confirm Booking • ${formatCurrency(total)}`}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}