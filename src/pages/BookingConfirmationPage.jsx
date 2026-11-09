// src/pages/BookingConfirmationPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2, Printer, Home, Ship, MapPin, Calendar,
  Users, CreditCard, AlertCircle,
} from "lucide-react";

import { publicApi } from "../api/public.api";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import { formatCurrency, formatDateTime } from "../lib/formatters";

export default function BookingConfirmationPage() {
  const { reference } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await publicApi.getBooking(reference);
        setBooking(res?.data?.data);
      } catch {
        setBooking(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [reference]);

  if (loading) return <Spinner variant="centered" label="Loading ticket…" />;

  if (!booking) {
    return (
      <div className="container-x py-24 text-center">
        <h2 className="section-title mb-4">Booking not found</h2>
        <p className="text-navy/60 mb-8">The reference {reference} doesn't exist.</p>
        <Link to="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  const isPaid = booking.payment_status === "paid";
  const isCancelled = booking.status === "cancelled";

  return (
    <div className="bg-mist min-h-screen py-14">
      <div className="container-x max-w-3xl">
        {/* Success banner */}
        <div className="text-center mb-10 no-print">
          <div className={`inline-flex w-20 h-20 rounded-full items-center justify-center mb-5 animate-slide-up ${isPaid ? "bg-emerald-50" : "bg-amber-50"}`}>
            {isPaid ? (
              <CheckCircle2 size={44} className="text-emerald-600" strokeWidth={2} />
            ) : (
              <AlertCircle size={44} className="text-amber-600" strokeWidth={2} />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight mb-3">
            {isPaid ? "Booking Confirmed" : "Ticket Issued (Payment Pending)"}
          </h1>
          <p className="text-navy/60 max-w-md mx-auto">
            {isPaid
              ? "Your payment is received and your journey is fully confirmed."
              : "Your booking is confirmed. Please pay on boarding or complete payment online."}
          </p>
        </div>

        {/* Ticket card */}
        <div className="bg-white rounded-3xl shadow-modal overflow-hidden">
          {/* Header */}
          <div className="relative bg-navy-gradient p-7 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-crimson/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-powder/70 mb-1">
                  Booking Reference
                </div>
                <div className="text-2xl font-black tracking-tight">{booking.booking_reference}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" size="md">{booking.status}</Badge>
                <Badge variant={isPaid ? "success" : "warning"} size="md">
                  {isPaid ? "Paid" : "Payment Pending"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Journey details */}
          <div className="p-7 space-y-6">
            {booking.trip && (
              <>
                <div>
                  <div className="section-label">Journey Details</div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-12 h-12 rounded-2xl bg-mist flex items-center justify-center shrink-0">
                      <Ship size={20} className="text-steel" />
                    </div>
                    <div>
                      <div className="font-black text-ink text-lg">{booking.trip.boat}</div>
                      <div className="text-sm text-navy/60">{booking.trip.seat_class} class</div>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-powder/50">
                  <Field icon={<MapPin size={12} />} label="Route">
                    {booking.trip.from} → {booking.trip.to}
                  </Field>
                  <Field icon={<Calendar size={12} />} label="Departure">
                    {formatDateTime(booking.trip.departure_at)}
                  </Field>
                  <Field icon={<Users size={12} />} label="Seats">
                    {booking.seats?.join(", ") || "—"}
                  </Field>
                </div>
              </>
            )}

            {booking.charter && (
              <div>
                <div className="section-label">Charter</div>
                <div className="font-black text-ink text-lg mt-3">{booking.charter.boat_name}</div>
                <div className="text-sm text-navy/60 mt-1">
                  {formatDateTime(booking.charter.start_at)} → {formatDateTime(booking.charter.end_at)}
                </div>
                {booking.charter.route_notes && (
                  <p className="mt-3 text-sm text-navy/70">{booking.charter.route_notes}</p>
                )}
              </div>
            )}

            {/* Passenger */}
            <div className="pt-6 border-t border-powder/50">
              <div className="section-label">Passenger</div>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <Field label="Name">{booking.passenger_name}</Field>
                <Field label="Contact">
                  {booking.passenger_phone}
                  {booking.passenger_email && <span className="text-navy/50"> • {booking.passenger_email}</span>}
                </Field>
              </div>
            </div>

            {/* Amount */}
            <div className="pt-6 border-t border-powder/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-navy/60 text-sm">Total Amount</span>
                <span className="text-3xl font-black text-crimson tracking-tight">
                  {formatCurrency(booking.total_amount)}
                </span>
              </div>

              {isPaid ? (
                <div className="text-xs bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800">
                  ✅ Payment received. Your ticket is fully confirmed.
                </div>
              ) : (
                <div className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900">
                  💳 Pay on boarding. Please carry this ticket and a valid government ID.
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-powder/50 no-print p-6 bg-mist/50 flex flex-col sm:flex-row gap-3">
            
            {/* If they chose pay on boarding, but want to pay online now */}
            {!isPaid && !isCancelled && (
              <Link to={`/checkout/${booking.booking_reference}`} className="flex-1">
                <Button variant="primary" size="lg" leftIcon={<CreditCard size={16} />} className="w-full">
                  Pay Online Now
                </Button>
              </Link>
            )}

            <a href={booking.ticket_url} target="_blank" rel="noreferrer" className="flex-1">
              <Button variant={isPaid ? "primary" : "outline"} size="lg" leftIcon={<Printer size={16} />} className="w-full">
                Print Ticket
              </Button>
            </a>
            
            <Link to="/" className="flex-1">
              <Button variant="outline" size="lg" leftIcon={<Home size={16} />} className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-navy/50 mt-6 no-print">
          {isPaid
            ? "A payment receipt has been sent to your email."
            : "A booking confirmation has been sent to your inbox."}
        </p>
      </div>
    </div>
  );
}

function Field({ icon, label, children }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1.5 flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="font-bold text-ink text-sm">{children}</div>
    </div>
  );
}