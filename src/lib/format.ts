import dayjs from "dayjs";
// ----------------------------------------------------------------------

type InputValue = Date | string | number | null;

export function formatDate(date?: string | null | Date, newFormat?: string) {
  const fm = newFormat || "DD/MM/YYYY";
  const result = dayjs(date);

  return result.isValid() ? result.format(fm) : "-";
}

export function formatDateTime(date?: string | null | Date) {
  const result = dayjs(date);

  return result.isValid() ? result.format("DD/MM/YYYY HH:mm") : "-";
}

export function formatFullDateTime(date?: string | null | Date) {
  const result = dayjs(date);

  return result.isValid() ? result.format("DD/MM/YYYY HH:mm:ss") : "-";
}

export function formatTimestamp(date: InputValue) {
  return date ? dayjs(date).unix() : "";
}
