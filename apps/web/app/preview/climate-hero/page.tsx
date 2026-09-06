import type { Metadata } from "next";
import { ClimateHero } from "@/components/ui/climate-hero";

export const metadata: Metadata = {
  title: "Climate Hero — preview",
  robots: { index: false, follow: false },
};

/**
 * Standalone preview route for the `ClimateHero` ui component — not linked
 * from site navigation. This is a demo of the component in isolation, not
 * the site's actual homepage hero (see `app/page.tsx` for that).
 */
export default function ClimateHeroPreviewPage() {
  return <ClimateHero />;
}
