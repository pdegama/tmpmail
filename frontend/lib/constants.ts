// API endpoint paths
export const API_ENDPOINTS = {
  TEMP_ADDRESS: "/temp-address",
  MESSAGES: "/messages",
  MESSAGE_DETAIL: (id: string) => `/messages/${id}`,
  MAILBOX: "/api/mailbox",
  MAILBOX_CHANGE: "/api/mailbox/change",
  MAILBOX_SHUFFLE: "/api/mailbox/shuffle",
} as const;

// UI constants
export const MAX_INBOX_HEIGHT_MOBILE = "calc(100vh - 320px)";
export const MAX_INBOX_HEIGHT_DESKTOP = "calc(100vh - 400px)";
export const MOCK_API_DELAY = {
  FAST: 200,
  NORMAL: 500,
  SLOW: 800,
} as const;

// Demo data configuration
export const DEMO_EMAIL_DOMAIN = "@sahidmidda.site";

// Time formatting
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

