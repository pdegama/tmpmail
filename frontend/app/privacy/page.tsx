import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Privacy Policy for MailTro - Learn how we handle your temporary email data and privacy.",
};

export default function PrivacyPolicy() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold">Data Collection</h2>
                    <p>
                        MailTro provides temporary email addresses for your convenience. We collect minimal data necessary to provide this service, including email addresses you create and emails received at those addresses.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Data Usage</h2>
                    <p>
                        We use collected data solely to deliver emails to your temporary inbox. We do not sell, share, or use your data for advertising or marketing purposes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Data Retention and Deletion</h2>
                    <p>
                        All email addresses and associated data, including received emails, are automatically deleted after 15 days of activation. This ensures your privacy and keeps our service efficient.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">No Registration Required</h2>
                    <p>
                        We do not require account registration. Temporary email addresses are generated instantly without collecting personal information such as names, phone numbers, or permanent email addresses.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Security</h2>
                    <p>
                        We implement security measures to protect your temporary email data. However, as this is a temporary service, we recommend not using it for sensitive or confidential information.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Contact</h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact us through our support channels.
                    </p>
                </section>
            </div>

            <div className="mt-8">
                <Link
                    href="/"
                    className="text-sm text-primary hover:underline underline-offset-4"
                >
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}

