// src/pages/CheckoutPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, CreditCard, Ship, Lock } from "lucide-react";
import { load } from "@cashfreepayments/cashfree-js";
import toast from "react-hot-toast";

import { publicApi } from "../api/public.api";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { formatCurrency, formatDateTime } from "../lib/formatters";

export default function CheckoutPage() {
  const { reference } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await publicApi.getBooking(reference);
        const data = res?.data?.data;
        if (!data) throw new Error("Booking not found");

        if (data.payment_status === "paid") {
          toast.success("This booking is already paid.");
          navigate(`/booking/${reference}`, { replace: true });
          return;
        }

        setBooking(data);
      } catch {
        setError("Booking not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    })();
  }, [reference, navigate]);

  const handlePayNow = async () => {
    if (!booking) return;
    setPaying(true);
    setError(null);

    try {
      // 1. Initiate order on backend → get payment_session_id
      const res = await api.post("/checkout/initiate", {
        booking_reference: booking.booking_reference,
      });

      const data = res?.data;
      if (!data?.success) {
        throw new Error(data?.message || "Could not start payment");
      }

      // 2. Load Cashfree JS SDK
      const cashfree = await load({
        mode: data.cashfree_mode === "production" ? "production" : "sandbox",
      });

      // 3. Open Cashfree Checkout (modal)
      const result = await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal",
      });

      // User closed the modal or payment error
      if (result?.error) {
        setPaying(false);
        toast.error(result.error.message || "Payment cancelled.");
        return;
      }

      // Redirect flow (unlikely with _modal, but handle it)
      if (result?.redirect) {
        // Cashfree will take the user to return_url — nothing else to do
        return;
      }

      // 4. Payment completed (modal) → verify on backend
      if (result?.paymentDetails) {
        toast.loading("Verifying payment...", { id: "verify" });

        try {
          const verifyRes = await api.post("/checkout/verify", {
            order_id: data.cashfree_order_id,
          });

          if (verifyRes?.data?.success) {
            toast.success("Payment successful! 🎉", { id: "verify" });
            navigate(`/booking/${reference}`, { replace: true });
          } else {
            // Payment succeeded but our backend couldn't confirm yet
            toast.success(
              "Payment received! We are confirming it, you will get an email shortly.",
              { id: "verify" }
            );
            navigate(`/booking/${reference}`, { replace: true });
          }
        } catch (err) {
          toast.success(
            "Payment received! We are confirming it, you will get an email shortly.",
            { id: "verify" }
          );
          navigate(`/booking/${reference}`, { replace: true });
        } finally {
          setPaying(false);
        }
        return;
      }

      // Fallback — unknown state
      setPaying(false);
      toast.error("Payment status unclear. Please check your booking page.");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to start payment";
      setError(msg);
      toast.error(msg);
      setPaying(false);
    }
  };

  if (loading) return <Spinner variant="centered" label="Preparing checkout…" />;

  if (error && !booking) {
    return (
      <div className="container-x py-24 text-center">
        <h2 className="section-title mb-4">Checkout Error</h2>
        <p className="text-navy/60 mb-8">{error}</p>
        <Link to="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-mist min-h-screen py-12">
      <div className="container-x max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-navy/60 hover:text-crimson mb-4">
            <ArrowLeft size={16} /> Cancel & Return
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight">Secure Checkout</h1>
          <p className="text-navy/60">Complete your payment to confirm your booking.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary (Left) */}
          <div className="bg-white rounded-3xl shadow-card p-6 md:p-8 h-fit">
            <h2 className="text-lg font-black text-ink mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1">Booking Ref</div>
                  <div className="font-bold text-ink">{booking.booking_reference}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1">Status</div>
                  <div className="font-bold text-amber-600">Payment Pending</div>
                </div>
              </div>

              <div className="pt-4 border-t border-powder/50">
                <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-2">Journey Details</div>
                <div className="flex items-center gap-3 mb-3">
                  <Ship size={18} className="text-steel" />
                  <div className="font-bold text-ink">{booking.trip.boat}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-navy/50 mb-1">Route</div>
                    <div className="font-semibold">{booking.trip.from} → {booking.trip.to}</div>
                  </div>
                  <div>
                    <div className="text-navy/50 mb-1">Departure</div>
                    <div className="font-semibold">{formatDateTime(booking.trip.departure_at)}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-powder/50">
                <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-2">Passenger</div>
                <div className="font-semibold text-ink">{booking.passenger_name}</div>
                <div className="text-sm text-navy/60">{booking.passenger_phone}</div>
              </div>
            </div>
          </div>

          {/* Payment Action (Right) */}
          <div className="bg-white rounded-3xl shadow-modal p-6 md:p-8 h-fit border-2 border-powder/30">
            <h2 className="text-lg font-black text-ink mb-6">Payment Details</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between mb-6 pb-6 border-b border-powder/50">
              <span className="text-navy/70 font-semibold">Total Amount</span>
              <span className="text-3xl font-black text-crimson">{formatCurrency(booking.total_amount)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mb-4 shadow-lg shadow-crimson/20"
              loading={paying}
              disabled={paying}
              onClick={handlePayNow}
              leftIcon={!paying && <CreditCard size={18} />}
            >
              {paying ? "Processing…" : "Pay Now"}
            </Button>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-navy/40">
              <Lock size={14} /> Secured by Cashfree
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}