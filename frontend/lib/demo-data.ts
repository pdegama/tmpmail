import { TempMailMessage, Attachment } from "@/types/mail";
import { DEMO_EMAIL_DOMAIN } from "./constants";

// Placeholder image URLs from Unsplash/Pexels
const PLACEHOLDER_IMAGES = {
  png1: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop",
  png2: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
  png3: "https://images.pexels.com/photos/3747158/pexels-photo-3747158.jpeg?w=800&h=600&fit=crop",
};

// Placeholder PDF URLs (to be replaced later with actual PDFs)
const PLACEHOLDER_PDFS = {
  pdf1: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  pdf2: "https://www.africau.edu/images/default/sample.pdf",
  pdf3: "https://file-examples.com/storage/fe68a1f7c1d4e6b4f9f5c8d/2017/10/file_example_PDF_500_kB.pdf",
};

// Placeholder Excel/Document URLs (to be replaced later)
const PLACEHOLDER_DOCS = {
  xlsx1: "https://file-examples.com/storage/fe68a1f7c1d4e6b4f9f5c8d/2017/10/file_example_XLSX_10.xlsx",
  xlsx2: "https://file-examples.com/storage/fe68a1f7c1d4e6b4f9f5c8d/2017/10/file_example_XLSX_50.xlsx",
  docx1: "https://file-examples.com/storage/fe68a1f7c1d4e6b4f9f5c8d/2017/10/file_example_DOCX_10.docx",
};

function generateAttachments(count: number, types?: string[]): Attachment[] {
  const attachments: Attachment[] = [];
  const imageKeys = Object.keys(PLACEHOLDER_IMAGES) as Array<keyof typeof PLACEHOLDER_IMAGES>;
  const pdfKeys = Object.keys(PLACEHOLDER_PDFS) as Array<keyof typeof PLACEHOLDER_PDFS>;
  const docKeys = Object.keys(PLACEHOLDER_DOCS) as Array<keyof typeof PLACEHOLDER_DOCS>;
  
  const attachmentTypes = types || ["image"];
  
  for (let i = 0; i < count; i++) {
    const type = attachmentTypes[i % attachmentTypes.length];
    
    if (type === "image" && i < imageKeys.length) {
      attachments.push({
        id: `img-${i + 1}`,
        filename: `image-${i + 1}.png`,
        size: Math.floor(Math.random() * 2000000) + 500000, // 500KB - 2MB
        contentType: "image/png",
        url: PLACEHOLDER_IMAGES[imageKeys[i]],
      });
    } else if (type === "pdf") {
      const pdfIndex = i % pdfKeys.length;
      attachments.push({
        id: `pdf-${i + 1}`,
        filename: `document-${i + 1}.pdf`,
        size: Math.floor(Math.random() * 1000000) + 200000, // 200KB - 1MB
        contentType: "application/pdf",
        url: PLACEHOLDER_PDFS[pdfKeys[pdfIndex]],
      });
    } else if (type === "xlsx") {
      const xlsxKeys = docKeys.filter((k) => k.startsWith("xlsx"));
      if (xlsxKeys.length > 0) {
        const xlsxIndex = i % xlsxKeys.length;
        attachments.push({
          id: `xlsx-${i + 1}`,
          filename: `spreadsheet-${i + 1}.xlsx`,
          size: Math.floor(Math.random() * 500000) + 100000, // 100KB - 500KB
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          url: PLACEHOLDER_DOCS[xlsxKeys[xlsxIndex] as keyof typeof PLACEHOLDER_DOCS],
        });
      }
    } else if (type === "docx") {
      const docxKeys = docKeys.filter((k) => k.startsWith("docx"));
      if (docxKeys.length > 0) {
        const docxIndex = i % docxKeys.length;
        attachments.push({
          id: `docx-${i + 1}`,
          filename: `document-${i + 1}.docx`,
          size: Math.floor(Math.random() * 500000) + 100000, // 100KB - 500KB
          contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          url: PLACEHOLDER_DOCS[docxKeys[docxIndex] as keyof typeof PLACEHOLDER_DOCS],
        });
      }
    }
  }
  
  return attachments;
}

export function generateDemoMessages(): TempMailMessage[] {
  const now = new Date();
  
  return [
    {
      id: "1",
      sender: {
        name: "Amazon",
        email: "noreply@amazon.com",
      },
      subject: "Verify your email address",
      receivedAt: new Date(now.getTime() - 5 * 60000).toISOString(), // 5 minutes ago
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #232f3e;">Verify your email address</h2>
          <p>Hello,</p>
          <p>Thank you for creating an Amazon account. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #ff9900; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          </div>
          <p>If you didn't create this account, you can safely ignore this email.</p>
          <p>Best regards,<br>The Amazon Team</p>
        </div>
      `,
      textContent: "Hello,\n\nThank you for creating an Amazon account. Please verify your email address by clicking the link in your browser.\n\nBest regards,\nThe Amazon Team",
      attachments: [],
      isRead: false,
    },
    {
      id: "2",
      sender: {
        name: "GitHub",
        email: "notifications@github.com",
      },
      subject: "New sign-in from Chrome on Windows",
      receivedAt: new Date(now.getTime() - 15 * 60000).toISOString(), // 15 minutes ago
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #24292e;">New sign-in detected</h2>
          <p>We noticed a new sign-in to your GitHub account.</p>
          <div style="background-color: #f6f8fa; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Location:</strong> San Francisco, CA, US</p>
            <p><strong>Device:</strong> Chrome on Windows</p>
            <p><strong>Time:</strong> ${new Date(now.getTime() - 15 * 60000).toLocaleString()}</p>
          </div>
          <p>If this was you, you can safely ignore this email.</p>
          <p>If this wasn't you, please secure your account immediately.</p>
        </div>
      `,
      textContent: "We noticed a new sign-in to your GitHub account.\n\nLocation: San Francisco, CA, US\nDevice: Chrome on Windows\n\nIf this wasn't you, please secure your account immediately.",
      attachments: [],
      isRead: false,
    },
    {
      id: "3",
      sender: {
        name: "Stripe",
        email: "receipts@stripe.com",
      },
      subject: "Receipt for your payment",
      receivedAt: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #635bff;">Payment Receipt</h2>
          <p>Thank you for your payment!</p>
          <div style="background-color: #f7f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount:</strong> $49.99</p>
            <p><strong>Description:</strong> Pro Plan Subscription</p>
            <p><strong>Date:</strong> ${new Date(now.getTime() - 2 * 3600000).toLocaleDateString()}</p>
            <p><strong>Transaction ID:</strong> ch_1234567890abcdef</p>
          </div>
          <p>This receipt is also attached to this email.</p>
        </div>
      `,
      textContent: "Thank you for your payment!\n\nAmount: $49.99\nDescription: Pro Plan Subscription\n\nTransaction ID: ch_1234567890abcdef",
      attachments: generateAttachments(1, ["pdf"]),
      isRead: true,
    },
    {
      id: "4",
      sender: {
        name: "Product Hunt",
        email: "hello@producthunt.com",
      },
      subject: "Your weekly digest is here! 🚀",
      receivedAt: new Date(now.getTime() - 24 * 3600000).toISOString(), // 1 day ago
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #da552f;">This Week's Top Products</h2>
          <p>Here are the hottest products launched this week:</p>
          <div style="margin: 20px 0;">
            <div style="border-left: 4px solid #da552f; padding-left: 16px; margin-bottom: 16px;">
              <h3 style="margin: 0 0 8px 0;">AI Code Assistant</h3>
              <p style="color: #666; margin: 0;">The future of coding is here</p>
            </div>
            <div style="border-left: 4px solid #da552f; padding-left: 16px; margin-bottom: 16px;">
              <h3 style="margin: 0 0 8px 0;">Design System Pro</h3>
              <p style="color: #666; margin: 0;">Beautiful components for your next project</p>
            </div>
          </div>
          <p>Check out more products on Product Hunt!</p>
        </div>
      `,
      textContent: "This Week's Top Products\n\n1. AI Code Assistant - The future of coding is here\n2. Design System Pro - Beautiful components for your next project",
      attachments: generateAttachments(2, ["image", "pdf"]),
      isRead: true,
    },
    {
      id: "5",
      sender: {
        name: "Dropbox",
        email: "noreply@dropbox.com",
      },
      subject: "You have new shared files",
      receivedAt: new Date(now.getTime() - 3 * 3600000).toISOString(), // 3 hours ago
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0061ff;">Files shared with you</h2>
          <p>Sarah shared files with you:</p>
          <div style="background-color: #f7f9fa; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid #e1e4e8;">📄 Project Proposal.pdf</li>
              <li style="padding: 8px 0; border-bottom: 1px solid #e1e4e8;">📊 Budget Spreadsheet.xlsx</li>
              <li style="padding: 8px 0;">📷 Team Photo.jpg</li>
            </ul>
          </div>
          <p>Click here to view and download the files.</p>
        </div>
      `,
      textContent: "Sarah shared files with you:\n\n- Project Proposal.pdf\n- Budget Spreadsheet.xlsx\n- Team Photo.jpg",
      attachments: generateAttachments(3, ["image", "pdf", "xlsx"]),
      isRead: false,
    },
    {
      id: "6",
      sender: {
        name: "Netflix",
        email: "info@netflix.com",
      },
      subject: "Your new shows are waiting",
      receivedAt: new Date(now.getTime() - 6 * 3600000).toISOString(), // 6 hours ago
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background-color: #141414; color: #e5e5e5; padding: 20px;">
          <h2 style="color: #e50914;">New This Week</h2>
          <p>Check out what's new on Netflix:</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0;">
            <div style="background-color: #2a2a2a; padding: 8px; border-radius: 4px;">
              <div style="background-color: #404040; height: 100px; border-radius: 4px; margin-bottom: 8px;"></div>
              <p style="font-size: 12px; margin: 0;">New Series</p>
            </div>
            <div style="background-color: #2a2a2a; padding: 8px; border-radius: 4px;">
              <div style="background-color: #404040; height: 100px; border-radius: 4px; margin-bottom: 8px;"></div>
              <p style="font-size: 12px; margin: 0;">Movie</p>
            </div>
            <div style="background-color: #2a2a2a; padding: 8px; border-radius: 4px;">
              <div style="background-color: #404040; height: 100px; border-radius: 4px; margin-bottom: 8px;"></div>
              <p style="font-size: 12px; margin: 0;">Documentary</p>
            </div>
          </div>
          <p style="text-align: center;">
            <a href="#" style="background-color: #e50914; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Watch Now</a>
          </p>
        </div>
      `,
      textContent: "New This Week on Netflix\n\nCheck out the latest shows and movies added this week.",
      attachments: [],
      isRead: true,
    },
    {
      id: "7",
      sender: {
        name: "LinkedIn",
        email: "notifications@linkedin.com",
      },
      subject: "3 new job recommendations for you",
      receivedAt: new Date(now.getTime() - 12 * 3600000).toISOString(), // 12 hours ago
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0077b5;">Job Recommendations</h2>
          <p>Based on your profile, here are jobs you might be interested in:</p>
          <div style="margin: 20px 0;">
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
              <h3 style="margin: 0 0 8px 0; color: #0077b5;">Senior Frontend Developer</h3>
              <p style="color: #666; margin: 0 0 8px 0;">Tech Company Inc.</p>
              <p style="font-size: 14px; margin: 0;">San Francisco, CA · Full-time</p>
            </div>
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
              <h3 style="margin: 0 0 8px 0; color: #0077b5;">React Developer</h3>
              <p style="color: #666; margin: 0 0 8px 0;">StartupXYZ</p>
              <p style="font-size: 14px; margin: 0;">Remote · Full-time</p>
            </div>
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;">
              <h3 style="margin: 0 0 8px 0; color: #0077b5;">Full Stack Engineer</h3>
              <p style="color: #666; margin: 0 0 8px 0;">BigCorp</p>
              <p style="font-size: 14px; margin: 0;">New York, NY · Full-time</p>
            </div>
          </div>
        </div>
      `,
      textContent: "Job Recommendations\n\n1. Senior Frontend Developer at Tech Company Inc. (San Francisco, CA)\n2. React Developer at StartupXYZ (Remote)\n3. Full Stack Engineer at BigCorp (New York, NY)",
      attachments: [],
      isRead: false,
    },
    {
      id: "8",
      sender: {
        name: "Newsletter Weekly",
        email: "newsletter@example.com",
      },
      subject: "This Week in Tech - Issue #42",
      receivedAt: new Date(now.getTime() - 48 * 3600000).toISOString(), // 2 days ago
      htmlContent: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 3px solid #333; padding-bottom: 10px;">This Week in Tech</h1>
          <h2 style="color: #666;">Issue #42</h2>
          <div style="margin: 30px 0;">
            <h3>🔥 Trending This Week</h3>
            <p>AI continues to revolutionize software development with new tools launching every day. Here's what caught our attention:</p>
            <ul>
              <li>New AI coding assistant breaks speed records</li>
              <li>Open source LLM reaches GPT-4 performance</li>
              <li>Developer productivity tools hit $1B valuation</li>
            </ul>
          </div>
          <div style="margin: 30px 0;">
            <h3>📚 Must-Read Articles</h3>
            <p>Dive deep into these thought-provoking pieces from the tech community.</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 30px 0; border-left: 4px solid #333;">
            <p style="font-style: italic; margin: 0;">"The future of web development is component-driven and type-safe."</p>
            <p style="text-align: right; margin-top: 10px; color: #666;">— Tech Thought Leader</p>
          </div>
        </div>
      `,
      textContent: "This Week in Tech - Issue #42\n\n🔥 Trending This Week\n\nAI continues to revolutionize software development with new tools launching every day.\n\n📚 Must-Read Articles\n\nDive deep into these thought-provoking pieces from the tech community.",
      attachments: generateAttachments(1, ["docx"]),
      isRead: true,
    },
  ];
}

