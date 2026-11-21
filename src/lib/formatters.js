
import dayjs from "dayjs";

export const formatCurrency = (amount, currency = "INR") => {
  const num = Number(amount || 0);

  return `${currency} ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(num)}`;
};

export const formatDate = (date, fmt = "DD MMM YYYY") =>
  date ? dayjs(date).format(fmt) : "—";

export const formatDateTime = (date) =>
  date ? dayjs(date).format("DD MMM YYYY, hh:mm A") : "—";

export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return "—";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;

  return `${h}h ${m}m`;
};
