import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import StudioGate from "@/components/StudioGate";
import Configurator from "@/components/Configurator";

export const metadata: Metadata = {
  title: "The Studio · Grad Choice",
  description:
    "Dress a 3D mannequin in your Group of Eight graduation regalia: university, degree level, faculty colours, and saved looks.",
};

export default function StudioPage() {
  return (
    <div className="grain min-h-dvh bg-cream text-ink">
      <SiteNav />
      <StudioGate>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:pb-16">
          <Configurator />
        </div>
      </StudioGate>
    </div>
  );
}
