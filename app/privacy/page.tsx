import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { getContactEmail, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects and uses your information.`,
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const contactEmail = getContactEmail();

  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy describes how {SITE_NAME} (&quot;we&quot;, &quot;us&quot;) handles
        information when you use our website and diagnostic tool. We wrote it to match what the
        product actually does today — not what we might add later.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Email address</strong> — when you enter it to see your preview and receive a
          report link.
        </li>
        <li>
          <strong>Questionnaire answers</strong> — your business type (SaaS, ecommerce, agency,
          or service) and the answers you give in the diagnostic.
        </li>
        <li>
          <strong>Diagnostic results</strong> — scores, estimated losses, and report content
          generated from your answers.
        </li>
        <li>
          <strong>Payment-related information</strong> — if you purchase the full report, payment
          is processed by Stripe. We receive confirmation that payment succeeded, a Stripe
          customer/session reference, and the email Stripe collects at checkout. We do{" "}
          <strong>not</strong> store your full card number on our servers.
        </li>
        <li>
          <strong>Browser storage</strong> — we save in-progress wizard answers in your browser&apos;s{" "}
          <code>localStorage</code> (key <code>rlr-wizard-progress</code>) so you can continue
          questions on the same device. Preview results are kept only for the current browser tab
          session (<code>sessionStorage</code>) or via email/checkout resume links — not auto-shown
          when you open the homepage later.
        </li>
        <li>
          <strong>Access links</strong> — report and preview URLs include a signed token so only
          people with the link can load that diagnostic.
        </li>
      </ul>

      <h2>Analytics and cookies</h2>
      <p>
        When enabled, we use <strong>Google Analytics</strong> to understand how visitors use the
        site (for example page views and conversion events such as completing the diagnostic or
        purchasing a report). Google may set cookies or use similar technologies. See{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google&apos;s privacy policy
        </a>
        . You can opt out of Google Analytics in your browser or via{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google&apos;s opt-out add-on
        </a>
        .
      </p>
      <p>
        When configured, we may also use the <strong>Meta Pixel</strong> to measure ad
        performance and site conversions. Meta may set cookies or use similar technologies. See{" "}
        <a
          href="https://www.facebook.com/privacy/policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Meta&apos;s privacy policy
        </a>
        .
      </p>
      <p>
        We also use <strong>browser local storage</strong> to save your in-progress diagnostic
        answers on your device. That is not used for advertising.
      </p>

      <h2>What we do not collect</h2>
      <ul>
        <li>We do not ask you to create a password or user account.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>Run the diagnostic and show your preview.</li>
        <li>Store your results so you can return via a saved link.</li>
        <li>Email you a link to your full report after you pay (when email delivery is configured).</li>
        <li>Process your one-time payment through Stripe.</li>
        <li>Operate, secure, and improve the service.</li>
      </ul>

      <h2>Who we share data with</h2>
      <p>We use service providers to run the product. They process data on our behalf:</p>
      <ul>
        <li>
          <strong>Stripe</strong> — payment processing. See{" "}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
            Stripe&apos;s privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Resend</strong> — sending report emails (when configured). See{" "}
          <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            Resend&apos;s privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Google Analytics</strong> — site usage and conversion measurement (when
          configured). See{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google&apos;s privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Meta</strong> — ad conversion measurement via the Meta Pixel (when configured).
          See{" "}
          <a
            href="https://www.facebook.com/privacy/policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meta&apos;s privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Hosting provider</strong> — our app and database are hosted on infrastructure
          we use to serve the site (for example Vercel and a database service in production).
        </li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>How long we keep data</h2>
      <p>
        We keep diagnostic records and email addresses as long as needed to provide the service,
        send your report, handle payment issues, and meet legal obligations. We do not currently
        run an automatic deletion schedule for old diagnostics. You can ask us to delete your data
        (see below).
      </p>

      <h2>Email messages</h2>
      <p>
        If you pay for a report, we may email you a link to access it. If you complete the free
        preview but do not purchase, we may send <strong>one</strong> reminder email with a link
        back to your preview (typically about 24 hours later). We do not send a regular newsletter.
        You can ask us to stop non-essential emails by contacting us.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>
          <strong>Browser storage</strong> — you can clear site data in your browser settings, or
          use &quot;Start over&quot; in the wizard, to remove saved progress.
        </li>
        <li>
          <strong>Access or deletion</strong> — email us to request a copy of your diagnostic data
          or to ask us to delete it. We will need your email address or diagnostic link to find
          your record.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        We use HTTPS, signed access tokens for report links, and industry-standard providers for
        payments and email. No method of transmission or storage is 100% secure.
      </p>

      <h2>Children</h2>
      <p>
        This service is for businesses and is not directed at children under 13. We do not knowingly
        collect information from children.
      </p>

      <h2>International visitors</h2>
      <p>
        If you use the site from outside the United States, your information may be processed in
        the US or where our providers operate. Depending on where you live, you may have additional
        rights (for example, to access, correct, or delete personal data). Contact us to exercise
        those rights.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy when the product changes. We will update the &quot;Last
        updated&quot; date at the top. Continued use after changes means you accept the updated
        policy.
      </p>

      <h2>Contact</h2>
      {contactEmail ? (
        <p>
          Questions or privacy requests:{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      ) : (
        <p>
          Questions or privacy requests: reply to any email you received from us about your
          diagnostic or report.
        </p>
      )}

      <p className="text-sm text-slate-600">
        See also our <Link href="/terms">Terms of Service</Link>.
      </p>
    </LegalPage>
  );
}
