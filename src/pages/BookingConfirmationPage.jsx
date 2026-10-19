// src/pages/BookingConfirmationPage.jsx
import { useEffect, useState, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  CheckCircle2, Printer, Home, Ship, MapPin, Calendar,
  Users, CreditCard, Loader2, AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { publicApi } from "../api/public.api";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import { formatCurrency, formatDateTime } from "../lib/formatters";

const POLL_INTERVAL = 3000;
const MAX_POLLS     = 30; // 90 seconds max polling

export default function BookingConfirmationPage() {
  const { reference } = useParams();
  const [params, setParams] = useSearchParams();

  const [booking, setBooking]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [paying, setPaying]       = useState(false);
  const [polling, setPolling]     = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const pollCount                 = useRef(0);
  const pollTimer                 = useRef(null);

  /* =========================================================
   * Load booking
   * ========================================================= */
  const loadBooking = async () => {
    try {
      const res = await publicApi.getBooking(reference);
      setBooking(res?.data?.data);
      return res?.data?.data;
    } catch {
      setBooking(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  /* =========================================================
   * Handle return from PhonePe (?payment_ref=PAY-XXXX)
   * Start polling for webhook confirmation
   * ========================================================= */
  useEffect(() => {
    const ref = params.get("payment_ref");
    if (!ref || polling || booking?.payment_status === "paid") return;

    // Clean the URL so refresh doesn't retrigger
    params.delete("payment_ref");
    setParams(params, { replace: true });

    startPolling(ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const startPolling = (payRef) => {
    setPolling(true);
    setPaymentError(null);
    pollCount.current = 0;

    pollTimer.current = setInterval(async () => {
      pollCount.current += 1;

      try {
        const res = await api.get(`/payments/status/${payRef}`);
        const status = res?.data?.data?.status;

        if (status === "succeeded") {
          clearInterval(pollTimer.current);
          setPolling(false);
          toast.success("Payment received! 🎉");
          loadBooking();
          return;
        }

        if (status === "failed" || status === "cancelled") {
          clearInterval(pollTimer.current);
          setPolling(false);
          setPaymentError("Payment failed. Please try again.");
          toast.error("Payment failed");
          return;
        }

        // Max polls reached
        if (pollCount.current >= MAX_POLLS) {
          clearInterval(pollTimer.current);
          setPolling(false);
          setPaymentError(
            "We're still waiting for confirmation. Refresh in a few minutes."
          );
        }
      } catch {
        // Silent — keep polling
      }
    }, POLL_INTERVAL);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []);

  /* =========================================================
   * Initiate PhonePe payment
   * ========================================================= */
  const handlePayNow = async () => {
    if (!booking) return;
    setPaying(true);
    setPaymentError(null);

    try {
      const res = await api.post("/payments/initiate", {
        booking_reference: booking.booking_reference,
      });

      const data = res?.data;
      if (!data?.success || !data?.redirect_url) {
        throw new Error(data?.message || "Could not start payment");
      }

      toast.loading("Redirecting to PhonePe…", { duration: 1500 });

      // Redirect to PhonePe hosted page
      setTimeout(() => {
        window.location.href = data.redirect_url;
      }, 500);

    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Payment failed to start";
      setPaymentError(msg);
      toast.error(msg);
      setPaying(false);
    }
  };

  /* =========================================================
   * Render
   * ========================================================= */
  if (loading) return <Spinner variant="centered" label="Loading booking…" />;

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
  const canPay = !isPaid && !isCancelled;

  return (
    <div className="bg-mist min-h-screen py-14">
      <div className="container-x max-w-3xl">
        {/* ============ Success banner ============ */}
        <div className="text-center mb-10 no-print">
          <div
            className={`inline-flex w-20 h-20 rounded-full items-center justify-center mb-5 animate-slide-up ${
              isPaid ? "bg-emerald-50" : "bg-amber-50"
            }`}
          >
            {isPaid ? (
              <CheckCircle2 size={44} className="text-emerald-600" strokeWidth={2} />
            ) : (
              <AlertCircle size={44} className="text-amber-600" strokeWidth={2} />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight mb-3">
            {isPaid ? "Payment Confirmed" : "Booking Submitted"}
          </h1>
          <p className="text-navy/60 max-w-md mx-auto">
            {isPaid
              ? "Your payment is received and your journey is confirmed."
              : "Your reservation is confirmed. Complete payment to secure your seats."}
          </p>
        </div>

        {/* ============ Payment status banner (during polling) ============ */}
        {polling && (
          <div className="mb-5 rounded-2xl bg-steel/10 border-2 border-steel/30 p-4 flex items-center gap-3 animate-fade-in">
            <Loader2 size={20} className="text-steel animate-spin shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-ink text-sm">Verifying your payment…</div>
              <div className="text-xs text-navy/60 mt-0.5">
                This usually takes 5–15 seconds. Please don't close this page.
              </div>
            </div>
          </div>
        )}

        {/* ============ Payment error ============ */}
        {paymentError && !polling && (
          <div className="mb-5 rounded-2xl bg-red-50 border-2 border-red-200 p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-crimson shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-crimson text-sm">Payment issue</div>
              <div className="text-xs text-red-700 mt-0.5">{paymentError}</div>
            </div>
            <button
              onClick={() => setPaymentError(null)}
              className="text-crimson hover:underline text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ============ Ticket card ============ */}
        <div className="bg-white rounded-3xl shadow-modal overflow-hidden">
          {/* Header */}
          <div className="relative bg-navy-gradient p-7 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-crimson/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-powder/70 mb-1">
                  Booking Reference
                </div>
                <div className="text-2xl font-black tracking-tight">
                  {booking.booking_reference}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" size="md">{booking.status}</Badge>
                <Badge
                  variant={isPaid ? "success" : "warning"}
                  size="md"
                >
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
                <div className="font-black text-ink text-lg mt-3">
                  {booking.charter.boat_name}
                </div>
                <div className="text-sm text-navy/60 mt-1">
                  {formatDateTime(booking.charter.start_at)} →{" "}
                  {formatDateTime(booking.charter.end_at)}
                </div>
                {booking.charter.route_notes && (
                  <p className="mt-3 text-sm text-navy/70">
                    {booking.charter.route_notes}
                  </p>
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
                  {booking.passenger_email && (
                    <span className="text-navy/50"> • {booking.passenger_email}</span>
                  )}
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
                  💳 Complete the payment below or pay on boarding. Please carry
                  this ticket and a valid government ID.
                </div>
              )}
            </div>
          </div>

          {/* ============ Payment / actions section ============ */}
          <div className="border-t border-powder/50 no-print">
            {/* Pay Now — only when unpaid */}
            {canPay && (
              <div className="p-6 bg-gradient-to-r from-crimson/5 via-powder/10 to-navy/5 flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-navy/60">
                      Secure Payment
                    </div>
                    <div className="font-black text-ink text-lg">
                      Pay {formatCurrency(booking.total_amount)} now
                    </div>
                    <div className="text-xs text-navy/50 mt-0.5">
                      Via PhonePe — Credit / Debit Card
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    loading={paying || polling}
                    disabled={paying || polling}
                    onClick={handlePayNow}
                    leftIcon={!paying && !polling && <CreditCard size={16} />}
                  >
                    {paying
                      ? "Starting…"
                      : polling
                      ? "Verifying…"
                      : "Pay Now"}
                  </Button>
                </div>
              </div>
            )}

            {/* Print + Home */}
            <div className="p-6 bg-mist/50 flex flex-col sm:flex-row gap-3">
              <a
                href={booking.ticket_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Printer size={16} />}
                  className="w-full"
                >
                  Print Confirmation
                </Button>
              </a>
              <Link to="/" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Home size={16} />}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-navy/50 mt-6 no-print">
          {isPaid
            ? "A payment receipt has been sent to your email."
            : "A confirmation email has been sent to your inbox."}
        </p>
      </div>
    </div>
  );
}

/* ========================================================= */
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