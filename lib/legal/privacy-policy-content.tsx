import Link from "next/link";
import {
  LEGAL_BUSINESS_DESCRIPTION,
  LEGAL_COMPANY_NAME,
  LEGAL_LAST_UPDATED,
  SITE_NAME,
} from "@/lib/site";
import { LegalContactBlock } from "@/lib/legal/contact";

interface PrivacyPolicyContentProps {
  contactEmail: string | null;
  siteUrl: string;
}

export function PrivacyPolicyContent({ contactEmail, siteUrl }: PrivacyPolicyContentProps) {
  const termsUrl = `${siteUrl}/terms`;

  return (
    <>
      <p>
        <strong>Privacy Policy</strong>
      </p>
      <p>Effective as of {LEGAL_LAST_UPDATED}.</p>
      <p>
        <strong>California Notice at Collection / State Privacy Rights Notice</strong>: See the
        State privacy rights notice section below for important information about your rights under
        applicable state privacy laws.
      </p>
      <p>
        {LEGAL_COMPANY_NAME} (&quot;{LEGAL_COMPANY_NAME},&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) provides a {LEGAL_BUSINESS_DESCRIPTION}. This Privacy Policy describes how
        {LEGAL_COMPANY_NAME} processes personal information that we collect through our digital or
        online properties or services that link to this Privacy Policy (including our website at{" "}
        <a href={siteUrl}>{siteUrl}</a>, our Revenue Leak Check Chrome extension, and related
        marketing activities) as well as other activities described in this Privacy Policy
        (collectively, the &quot;Service&quot;).
      </p>
      <p>
        <strong>Notice to European users</strong>: Please see the Notice to European users section
        below for additional information for individuals located in the European Economic Area or
        United Kingdom (which we refer to as &quot;Europe,&quot; and &quot;European&quot; should be
        understood accordingly).
      </p>

      <h2>Personal information we collect</h2>

      <h3>Information you provide to us</h3>
      <p>
        Personal information you may provide to us through the Service or otherwise includes:
      </p>
      <ul>
        <li>
          <strong>Contact data</strong>, such as your email address when you save a preview link,
          request report delivery, or complete checkout (Stripe may also collect your email at
          checkout).
        </li>
        <li>
          <strong>Profile and questionnaire data</strong>, such as your business type (for example
          SaaS, ecommerce, agency, or service business) and the answers you provide in the
          diagnostic wizard.
        </li>
        <li>
          <strong>Communications data</strong> based on our exchanges with you, including when you
          contact us by email or otherwise.
        </li>
        <li>
          <strong>Transactional data</strong>, such as information relating to or needed to
          complete your purchase of a paid report on the Service, including order references and
          payment confirmation (payment card data is collected directly by Stripe, not by us).
        </li>
        <li>
          <strong>User-generated content and input data</strong>, such as questionnaire answers and
          diagnostic results (scores, estimated losses, and report content) generated from your
          inputs.
        </li>
        <li>
          <strong>Marketing data</strong>, such as your preferences for receiving our marketing
          communications and details about your engagement with them (we do not send a regular
          newsletter; see Email messages below).
        </li>
      </ul>

      <h3>Third-party sources</h3>
      <p>
        We may combine personal information we receive from you with personal information we obtain
        from other sources, such as:
      </p>
      <ul>
        <li>
          <strong>Service providers</strong> that provide services on our behalf or help us operate
          the Service or our business (for example payment confirmation from Stripe).
        </li>
        <li>
          <strong>Business transaction partners</strong> in connection with an actual or prospective
          business transaction.
        </li>
      </ul>

      <h3>Automatic data collection</h3>
      <p>
        We, our service providers, and our business partners may automatically log information about
        you, your computer or mobile device, and your interaction over time with the Service, our
        communications and other online services, such as:
      </p>
      <ul>
        <li>
          <strong>Device data</strong>, such as your computer or mobile device&apos;s operating
          system type and version, browser type, screen resolution, device type, IP address, unique
          identifiers (including identifiers used for advertising purposes when analytics or
          advertising tools are enabled and you have consented), language settings, and general
          location information such as city, state, or geographic area.
        </li>
        <li>
          <strong>Online activity data</strong>, such as pages or screens you viewed, how long you
          spent on a page or screen, the website you visited before browsing to the Service,
          navigation paths between pages or screens, information about your activity on a page or
          screen, access times and duration of access, and whether you have opened our emails or
          clicked links within them.
        </li>
        <li>
          <strong>Communication interaction data</strong> such as your interactions with our email
          communications (for example whether you open and/or forward emails), which we may collect
          through pixel tags embedded invisibly in our emails.
        </li>
      </ul>
      <p>
        For more information concerning our automatic collection of data, please see the Tracking &
        other technologies section below.
      </p>
      <p>
        We also store in-progress wizard answers in your browser&apos;s <code>localStorage</code>{" "}
        (key <code>rlr-wizard-progress</code>) and may keep preview results in{" "}
        <code>sessionStorage</code> for the current browser tab session. Report and preview URLs
        include a signed token so only people with the link can load that diagnostic.
      </p>

      <h2>Tracking &amp; other technologies</h2>
      <p>
        <strong>Cookies and other technologies</strong>. Some of our automatic data collection is
        facilitated by cookies and other technologies. When analytics are configured and you accept
        cookies on our cookie banner, we may use <strong>Google Analytics</strong> to understand site
        usage and conversion events (for example completing the diagnostic or purchasing a report).
        When configured and you have accepted cookies, we may also use the <strong>Meta Pixel</strong>
        to measure ad performance and site conversions. Google and Meta may set cookies or use
        similar technologies. See{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google&apos;s privacy policy
        </a>{" "}
        and{" "}
        <a
          href="https://www.facebook.com/privacy/policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Meta&apos;s privacy policy
        </a>
        . You can opt out of Google Analytics via{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google&apos;s opt-out add-on
        </a>
        . We store your cookie consent preference in browser <code>localStorage</code> (
        <code>rlr_analytics_consent</code>).
      </p>
      <p>
        Browser <code>localStorage</code> used to save diagnostic progress is not used for
        advertising.
      </p>

      <h2>Chrome extension</h2>
      <p>
        Revenue Leak Check audits the page in the current tab when you click the extension icon.
        That check runs entirely in your browser. We do not receive the scanned page, its cookies,
        or a list of sites you visit. The extension only requests permission to run on the tab you
        invoked it on. If you click through to run the full diagnostic on this website, that visit
        is covered by the rest of this policy.
      </p>
      <p>
        Learn more on the <Link href="/extension">Chrome extension page</Link>.
      </p>

      <h2>How we use your personal information</h2>
      <p>
        We may use your personal information for the following purposes or as otherwise described at
        the time of collection:
      </p>
      <ul>
        <li>
          <strong>Service delivery and operations</strong> — provide the Service; run the diagnostic
          and show your preview; store results so you can return via a saved link; email you a link
          to your full report after you pay (when email delivery is configured); communicate with you
          about the Service; and provide support.
        </li>
        <li>
          <strong>Service improvement and analytics</strong> — analyze your usage of the Service,
          improve the Service, and understand user activity (including which pages are most visited).
          For example, we use Google Analytics for this purpose when configured and you have
          consented to analytics cookies.
        </li>
        <li>
          <strong>Marketing and advertising</strong> — send direct marketing communications where
          permitted (you may opt out as described below); and, when configured and you have consented,
          use cookies and similar technologies for interest-based advertising (for example through
          the Meta Pixel).
        </li>
        <li>
          <strong>Compliance and protection</strong> — comply with applicable laws and legal
          process; protect our, your, or others&apos; rights, privacy, safety, or property; enforce
          the terms and conditions that govern the Service; and prevent, identify, investigate, and
          deter fraudulent, harmful, unauthorized, unethical, or illegal activity.
        </li>
        <li>
          <strong>Aggregated, de-identified, or anonymized data</strong> — create aggregated,
          de-identified, or anonymized data from personal information and use it for lawful business
          purposes, including analyzing and improving the Service. We do not attempt to reidentify
          such data.
        </li>
      </ul>

      <h2>Retention</h2>
      <p>
        We generally retain personal information to fulfill the purposes for which we collected it,
        including for the purposes of satisfying any legal, accounting, or reporting requirements,
        establishing or defending legal claims, or for fraud prevention purposes. We keep diagnostic
        records and email addresses as long as needed to provide the Service, send your report,
        handle payment issues, and meet legal obligations. We do not currently run an automatic
        deletion schedule for old diagnostics. You can ask us to delete your data (see Your choices
        and How to contact us).
      </p>

      <h2>How we share your personal information</h2>
      <p>
        We may share your personal information with the following parties (or as otherwise described
        in this Privacy Policy):
      </p>
      <ul>
        <li>
          <strong>Service providers</strong> — third parties that provide services on our behalf or
          help us operate the Service or our business (such as hosting, information technology,
          customer support, email delivery, marketing, and website analytics).
        </li>
        <li>
          <strong>Payment processors</strong> — any payment card information you use to make a
          purchase on the Service is collected and processed directly by our payment processor,
          Stripe. Stripe may use your payment data in accordance with its privacy policy,{" "}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
            https://stripe.com/privacy
          </a>
          .
        </li>
        <li>
          <strong>Email delivery</strong> — when configured, we use Resend to send report and
          reminder emails. See{" "}
          <a
            href="https://resend.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resend&apos;s privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Advertising partners</strong> — third-party advertising companies for the
          interest-based advertising purposes described above when you have consented to analytics
          cookies.
        </li>
        <li>
          <strong>Hosting provider</strong> — our app and database are hosted on infrastructure we
          use to serve the site (for example Vercel and a database service in production).
        </li>
        <li>
          <strong>Professional advisors</strong> — lawyers, auditors, bankers, and insurers, in the
          course of professional services they render to us.
        </li>
        <li>
          <strong>Authorities and others</strong> — law enforcement, government authorities, and
          private parties, as we believe in good faith to be necessary or appropriate for compliance
          and protection purposes.
        </li>
        <li>
          <strong>Business transferees</strong> — in the context of actual or prospective business
          transactions (for example merger, acquisition, sale of assets, or similar transaction).
        </li>
      </ul>
      <p>We do not sell your personal information for money.</p>

      <h2>Your choices</h2>
      <ul>
        <li>
          <strong>Opt-out of marketing</strong> — you may opt out of marketing-related emails by
          following the opt-out or unsubscribe instructions at the bottom of the email, or by
          contacting us. You may continue to receive service-related and other non-marketing emails.
        </li>
        <li>
          <strong>Cookies and other technologies</strong> — you can decline analytics cookies on our
          cookie banner. You can also clear site data in your browser settings, or use &quot;Start
          over&quot; in the wizard, to remove saved diagnostic progress.
        </li>
        <li>
          <strong>Do Not Track</strong> — some Internet browsers may be configured to send
          &quot;Do Not Track&quot; signals. We currently do not respond to &quot;Do Not Track&quot;
          signals.
        </li>
        <li>
          <strong>Access or deletion</strong> — email us to request a copy of your diagnostic data
          or to ask us to delete it. We will need your email address or diagnostic link to find
          your record.
        </li>
        <li>
          <strong>Declining to provide information</strong> — we need to collect certain personal
          information to provide paid report delivery and checkout. If you do not provide
          information we identify as required, we may not be able to provide those services.
        </li>
      </ul>

      <h2>Email messages</h2>
      <p>
        If you pay for a report, we may email you a link to access it. Email is optional to see your
        free preview. If you save a preview with your email but do not purchase, we may send up to{" "}
        <strong>two</strong> reminder emails with a link back to your preview (typically about 24
        hours, then 48 hours). We do not send a regular newsletter.
      </p>

      <h2>Other sites and services</h2>
      <p>
        The Service may contain links to websites, mobile applications, and other online services
        operated by third parties. We do not control those services and are not responsible for
        their actions. We encourage you to read the privacy policies of the other websites and
        services you use.
      </p>

      <h2>Security</h2>
      <p>
        We employ technical, organizational, and physical safeguards designed to protect the
        personal information we collect, including HTTPS, signed access tokens for report links, and
        industry-standard providers for payments and email. However, security risk is inherent in
        all internet and information technologies and we cannot guarantee the security of your
        personal information.
      </p>

      <h2>International data transfer</h2>
      <p>
        We are headquartered in the United States and may use service providers that operate in
        other countries. Your personal information may be transferred to the United States or other
        locations where privacy laws may not be as protective as those in your state, province, or
        country. Users in Europe should read the Notice to European users section below.
      </p>

      <h2>Children</h2>
      <p>
        The Service is not intended for use by anyone under 18 years of age. The Service is for
        businesses and is not directed at children. If you are a parent or guardian of a child from
        whom you believe we have collected personal information in a manner prohibited by law,
        please contact us. If we learn that we have collected personal information through the
        Service from a child without the consent required by law, we will comply with applicable
        legal requirements to delete the information.
      </p>

      <h2>Changes to this Privacy Policy</h2>
      <p>
        We reserve the right to modify this Privacy Policy at any time. If we make material changes,
        we will notify you by updating the date of this Privacy Policy and posting it on the Service
        or other appropriate means. Any modifications will be effective upon posting (or as
        otherwise indicated). Your use of the Service after the effective date of any modified
        Privacy Policy indicates your acknowledging that the modified Privacy Policy applies to your
        interactions with the Service and our business.
      </p>

      <h2>How to contact us</h2>
      <LegalContactBlock contactEmail={contactEmail} purpose="Privacy questions or requests" />
      {contactEmail ? (
        <p>
          Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      ) : null}

      <h2>State privacy rights notice</h2>
      <p>
        Except as otherwise provided, this section applies to residents of U.S. states to the extent
        they have privacy laws applicable to us that grant their residents the rights described below
        (collectively the &quot;State Privacy Laws&quot;).
      </p>
      <p>
        For purposes of this section, &quot;Personal Information&quot; has the meaning given to
        &quot;personal data,&quot; &quot;personal information,&quot; or other similar terms in the
        State Privacy Laws. In some cases, we may decline your request as permitted by law. We may
        need to verify your identity before processing a request.
      </p>
      <p>
        <strong>Your privacy rights</strong>. The State Privacy Laws may provide residents with some
        or all of the following rights: information about how we collect and use Personal
        Information; access to Personal Information; correction of inaccurate Personal Information;
        deletion of Personal Information; opt-out of certain processing for targeted advertising;
        appeal of a denied request; and nondiscrimination for exercising these rights.
      </p>
      <p>
        <strong>Opt-out of sale or sharing</strong>. While we do not sell personal information for
        money, like many companies, we may use services that help deliver interest-based ads when you
        have consented to analytics cookies. State Privacy Laws may classify our use of some of
        these services as &quot;selling&quot; or &quot;sharing&quot; your Personal Information with
        advertising partners. You can opt out by declining analytics cookies on our cookie banner,
        using browser-based opt-out tools, or contacting us. We honor Global Privacy Control
        (&quot;GPC&quot;) signals as valid opt-out requests for the sale or sharing of Personal
        Information where required by applicable law.
      </p>
      <p>
        <strong>Exercising state privacy rights</strong>. You may submit requests by emailing us at
        the contact address above.
      </p>
      <p>
        <strong>Personal information we collect, use, and disclose</strong>. The following summarizes
        our practices currently and during the 12 months preceding the effective date of this
        Privacy Policy:
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-200 p-2 text-left">Personal information</th>
              <th className="border border-slate-200 p-2 text-left">Purposes</th>
              <th className="border border-slate-200 p-2 text-left">Categories of third parties</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 p-2">Email address</td>
              <td className="border border-slate-200 p-2">Service delivery, communications, marketing</td>
              <td className="border border-slate-200 p-2">
                Service providers (hosting, email, payment), advertising partners (when consented)
              </td>
            </tr>
            <tr>
              <td className="border border-slate-200 p-2">Questionnaire answers and diagnostic results</td>
              <td className="border border-slate-200 p-2">Service delivery, improvement, compliance</td>
              <td className="border border-slate-200 p-2">Service providers (hosting, database)</td>
            </tr>
            <tr>
              <td className="border border-slate-200 p-2">Payment and transaction references</td>
              <td className="border border-slate-200 p-2">Service delivery, compliance</td>
              <td className="border border-slate-200 p-2">Payment processors (Stripe)</td>
            </tr>
            <tr>
              <td className="border border-slate-200 p-2">Device and online activity data</td>
              <td className="border border-slate-200 p-2">Analytics, security, advertising (when consented)</td>
              <td className="border border-slate-200 p-2">
                Analytics providers (Google), advertising partners (Meta, when consented)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Additional information for California residents</strong>. California residents may have
        additional rights under the California Consumer Privacy Act (as amended by the California
        Privacy Rights Act). For details on how to exercise these rights, please see this section
        and our contact information above.
      </p>
      <p>
        <strong>Consumers under 16</strong>. We do not have actual knowledge that we collect, sell, or
        share the personal information of consumers under 16 years of age.
      </p>

      <h2>Notice to European users</h2>
      <p>
        <strong>General</strong>. The information in this section applies only to individuals in the
        United Kingdom and the European Economic Area (&quot;Europe&quot;). References to
        &quot;personal information&quot; in this Privacy Policy include &quot;personal data&quot; as
        defined in the GDPR.
      </p>
      <p>
        <strong>Controller</strong>. {LEGAL_COMPANY_NAME} is the controller in respect of the
        processing of your personal information covered by this Privacy Policy for purposes of
        European data protection legislation. We are a U.S.-based company without an establishment in
        the EEA or UK.
      </p>
      <p>
        <strong>Legal bases for processing</strong>. Our legal bases for processing your personal
        information include: performance of a contract with you (for example delivering the
        diagnostic and paid report); legitimate interests (for example improving the Service,
        security, and direct marketing where permitted); compliance with law; and consent (for
        example optional analytics and advertising cookies).
      </p>
      <p>
        <strong>Your rights</strong>. If you are located in Europe, you may have the right to access,
        correct, delete, restrict, object to, or request transfer of your personal information, and
        to withdraw consent where processing is based on consent. You may submit requests by
        contacting us using the details above. You also have the right to lodge a complaint with your
        local supervisory authority.
      </p>
      <p>
        <strong>Data processing outside Europe</strong>. Your personal information may be transferred
        to the United States and other countries that may not provide an equivalent level of data
        protection. Where required, we rely on appropriate safeguards such as standard contractual
        clauses approved by relevant authorities. You may contact us for more information about
        transfer mechanisms.
      </p>

      <p className="text-sm text-slate-600">
        This Privacy Policy is adapted from templates by{" "}
        <a
          href="https://github.com/General-Legal/legal-templates"
          target="_blank"
          rel="noopener noreferrer"
        >
          General Legal
        </a>{" "}
        (CC0). See also our <Link href="/terms">Terms of Service</Link> at {termsUrl}.
      </p>
    </>
  );
}
