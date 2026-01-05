import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Terms of Service for MailTro - Understand the rules and limitations of using our temporary email service.",
};

export default function TermsOfService() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
                    <p>
                        By using MailTro, you agree to these Terms of Service. If you do not agree, please do not use our service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Service Description</h2>
                    <p>
                        MailTro provides temporary, disposable email addresses for receiving emails. This service is provided "as is" without warranties of any kind.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Service Limitations</h2>
                    <p>
                        Temporary email addresses and all associated data are automatically deleted after 15 days. We are not responsible for any data loss after this period. The service may be unavailable at times due to maintenance or technical issues.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Prohibited Uses</h2>
                    <p>
                        You may not use MailTro for illegal activities, spam, harassment, or any purpose that violates applicable laws or regulations. We reserve the right to terminate access for violations.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">No Guarantees</h2>
                    <p>
                        We do not guarantee email delivery, service availability, or data retention. Use this service at your own risk and do not rely on it for critical communications.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">User Responsibilities</h2>
                    <p>
                        You are responsible for how you use temporary email addresses. Do not use them for sensitive information or important communications that require long-term access.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Changes to Terms</h2>
                    <p>
                        We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
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

