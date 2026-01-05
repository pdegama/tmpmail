import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "isomorphic-dompurify"
import { DATE_FORMAT_OPTIONS } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS).format(date);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function sanitizeHtml(html: string): string {
  // Sanitize HTML to prevent XSS attacks and style leakage
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "a", "img", "table", "thead", "tbody", "tr", "th", "td",
      "div", "span", "blockquote", "pre", "code", "hr", "b", "i", "small", "sub", "sup"
    ],
    ALLOWED_ATTR: [
      "href", "title", "alt", "src", "width", "height", "style", "class", "id",
      "colspan", "rowspan", "align", "valign", "border", "cellpadding", "cellspacing"
    ],
    ALLOW_DATA_ATTR: false,
    // Remove style attributes to prevent CSS leakage
    FORBID_ATTR: ["style"],
    // Keep relative URLs safe
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });
}
