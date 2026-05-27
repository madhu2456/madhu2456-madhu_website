export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-border/50">
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Madhu Dadi. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          <a
            href="https://madhudadi.in/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </a>
          <a
            href="https://madhudadi.in/blog/privacy-policy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="https://madhudadi.in/blog/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static Cloudflare email protection wrapper */}
          <span dangerouslySetInnerHTML={{ __html: "<!--email_off-->" }} />
          <a
            href="mailto:hello@madhudadi.in"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static Cloudflare email protection wrapper */}
          <span dangerouslySetInnerHTML={{ __html: "<!--/email_off-->" }} />
        </nav>
      </div>
    </footer>
  );
}
