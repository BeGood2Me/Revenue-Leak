import { LegalPage } from "@/components/LegalPage";
import { TermsOfUseContent } from "@/lib/legal/terms-of-use-content";
import { getContactEmail, getSiteUrl, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Terms of Service",
  description: `Terms for using ${SITE_NAME}.`,
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  const contactEmail = getContactEmail();
  const siteUrl = getSiteUrl();

  return (
    <LegalPage title="Terms of Service">
      <TermsOfUseContent contactEmail={contactEmail} siteUrl={siteUrl} />
    </LegalPage>
  );
}
