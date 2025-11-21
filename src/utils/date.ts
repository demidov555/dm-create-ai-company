import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

const FORMATS = {
  SHORT_DATE: "DD.MM.YYYY",
  SHORT_DATE_TIME: "DD.MM.YYYY HH:mm",
  FULL_DATE_TIME: "DD.MM.YYYY HH:mm:ss",
  LONG_DATE_RU: "D MMMM YYYY",
  MEDIUM_DATE_RU: "D MMM YYYY",
  TIME_ONLY: "HH:mm",
  TIME_WITH_SECONDS: "HH:mm:ss",
  ISO_DATE: "YYYY-MM-DD",
  ISO_DATE_TIME: "YYYY-MM-DD HH:mm",
  WEEKDAY_SHORT_EN: "ddd, DD MMM YYYY",
  WEEKDAY_LONG_RU: "dddd, D MMMM",
} as const;

function format(value: string | number | Date, pattern: string) {
  if (!value) return "";
  return dayjs(value).format(pattern);
}

// 20.11.2025
export const formatShortDate = (v: any) => format(v, FORMATS.SHORT_DATE);

// 20.11.2025 14:30
export const formatShortDateTime = (v: any) => format(v, FORMATS.SHORT_DATE_TIME);

// 20.11.2025 14:30:45
export const formatFullDateTime = (v: any) => format(v, FORMATS.FULL_DATE_TIME);

// 20 ноября 2025
export const formatLongDateRu = (v: any) => format(v, FORMATS.LONG_DATE_RU);

// 20 ноя 2025
export const formatMediumDateRu = (v: any) => format(v, FORMATS.MEDIUM_DATE_RU);

// 14:30
export const formatTime = (v: any) => format(v, FORMATS.TIME_ONLY);

// 14:30:45
export const formatTimeWithSeconds = (v: any) => format(v, FORMATS.TIME_WITH_SECONDS);

// 2025-11-20
export const formatIsoDate = (v: any) => format(v, FORMATS.ISO_DATE);

// 2025-11-20 14:30
export const formatIsoDateTime = (v: any) => format(v, FORMATS.ISO_DATE_TIME);

// Четверг, 20 ноября
export const formatWeekdayLongRu = (v: any) => format(v, FORMATS.WEEKDAY_LONG_RU);

export const DATE_FORMATS = FORMATS;
