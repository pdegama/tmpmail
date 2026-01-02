export interface MailSender {
  name: string;
  email: string;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number; // bytes
  contentType: string;
  url: string; // for downloads
}

export interface TempMailMessage {
  id: string;
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