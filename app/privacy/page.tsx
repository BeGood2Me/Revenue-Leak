import { LegalPage } from "@/components/LegalPage";
import { PrivacyPolicyContent } from "@/lib/legal/privacy-policy-content";
import { getContactEmail, getSiteUrl, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects and uses your information.`,
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  const contactEmail = getContactEmail();
  const siteUrl = getSiteUrl();

  return (
    <LegalPage title="Privacy Policy">
      <PrivacyPolicyContent contactEmail={contactEmail} siteUrl={siteUrl} />
    </LegalPage>
  );
}
