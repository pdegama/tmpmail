export interface MailSender {
  name: string;
  address: string;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number; // bytes
  contentType: string;
  url: string; // for downloads
}

// API Response Types
export interface EmailRecipient {
  address: string;
  name: string;
}

export interface Email {
  _id: string;
  userId: string;
  time: string; // ISO date string
  subject: string;
  from: MailSender;
  to: EmailRecipient[];
  messageId: string;
  text: string;
  html: string;
  attachments: Attachment[];
  read: boolean;
  deleted: boolean;
  expiredTime: string; // ISO date string
}

export interface EmailListResponse {
  emails: Email[];
  totalEmails: number;
  isLast: boolean;
  afterId: string;
}

// UI Types
export interface TempMailMessage {
  id: string; // For backward compatibility, maps to _id
  _id: string; // MongoDB ID for API operations
  sender: MailSender;
  subject: string;
  receivedAt: string; // ISO string
  htmlContent?: string;
  textContent?: string;
  attachments?: Attachment[];
  isRead?: boolean;
}

export interface MailboxUser {
  token: string;
  mailBox: string;
  expiredOn: string;
}

export interface MailboxResponse {
  user: MailboxUser;
  availableDomain: string[];
}

export interface MailboxChangeResponse {
  message: string;
  mailbox: string;
  token: string;
}

export interface MailboxShuffleResponse {
  message: string;
  mailbox: string;
  token: string;
}

// Mapper function to convert API Email to UI TempMailMessage
export function mapEmailToTempMailMessage(email: Email): TempMailMessage {
  return {
    id: email._id, // For backward compatibility
    _id: email._id,
    sender: email.from,
    subject: email.subject,
    receivedAt: email.time,
    htmlContent: email.html || undefined,
    textContent: email.text || undefined,
    attachments: email.attachments || [],
    isRead: email.read,
  };
}