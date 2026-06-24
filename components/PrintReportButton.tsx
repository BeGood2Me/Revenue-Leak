"use client";

import { Button } from "./Button";

export function PrintReportButton() {
  return (
    <Button variant="outline" onClick={() => window.print()}>
      Print report
    </Button>
  );
}
