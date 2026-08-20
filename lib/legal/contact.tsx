interface LegalContactProps {
  contactEmail: string | null;
  purpose?: string;
}

export function LegalContactBlock({ contactEmail, purpose }: LegalContactProps) {
  const label = purpose ?? "Questions or requests";

  if (contactEmail) {
    return (
      <p>
        {label}: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </p>
    );
  }

  return (
    <p>
      {label}: reply to any email you received from us about your diagnostic or report, or contact
      the site operator using the email configured for report delivery.
    </p>
  );
}
