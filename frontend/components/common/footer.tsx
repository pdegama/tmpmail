import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        <p>Temporary email service · No sign-up required</p>
        <p className="mt-1 text-xs">
          Use this disposable email address for temporary sign-ups and testing
        </p>
        <p className="mt-2 text-xs">
          Email addresses and associated data are automatically deleted after 15 days
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
          <Link href="/privacy" className="hover:text-foreground underline underline-offset-4 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground underline underline-offset-4 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}