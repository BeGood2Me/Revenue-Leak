import { getContactEmail, getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export function OrganizationJsonLd() {
  const base = getSiteUrl();
  const contactEmail = getContactEmail();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: SITE_NAME,
        url: base,
        description: SITE_DESCRIPTION,
        logo: `${base}/icon.svg`,
        ...(contactEmail ? { email: contactEmail } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: SITE_NAME,
        url: base,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${base}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
