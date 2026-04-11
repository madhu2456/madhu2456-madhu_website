import dynamic from "next/dynamic";
import { Suspense } from "react";
import { HeroSection } from "@/components/sections";

// Above-the-fold: Keep HeroSection synchronous for LCP.
// Below-the-fold: Dynamic import to keep initial bundle lean.
const AboutSection = dynamic(() =>
  import("@/components/sections/AboutSection").then((m) => m.AboutSection),
);
const QuickAnswersSection = dynamic(() =>
  import("@/components/sections/QuickAnswersSection").then(
    (m) => m.QuickAnswersSection,
  ),
);
const ExperienceSection = dynamic(() =>
  import("@/components/sections/ExperienceSection").then(
    (m) => m.ExperienceSection,
  ),
);
const EducationSection = dynamic(() =>
  import("@/components/sections/EducationSection").then(
    (m) => m.EducationSection,
  ),
);
const ProjectsSection = dynamic(() =>
  import("@/components/sections/ProjectsSection").then(
    (m) => m.ProjectsSection,
  ),
);
const CertificationsSection = dynamic(() =>
  import("@/components/sections/CertificationsSection").then(
    (m) => m.CertificationsSection,
  ),
);
const ServicesSection = dynamic(() =>
  import("@/components/sections/ServicesSection").then(
    (m) => m.ServicesSection,
  ),
);
const ContactSection = dynamic(() =>
  import("@/components/sections/ContactSection").then((m) => m.ContactSection),
);

function SectionSkeleton() {
  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-lg" />
          <div className="h-6 w-48 bg-muted animate-pulse rounded-lg opacity-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="h-80 bg-muted/30 animate-pulse rounded-2xl" />
          <div className="h-80 bg-muted/30 animate-pulse rounded-2xl" />
          <div className="h-80 bg-muted/30 animate-pulse rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

async function PortfolioContent() {
  return (
    <>
      <HeroSection />

      <div className="[content-visibility:auto] [contain-intrinsic-size:1000px]">
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:900px]">
        <Suspense fallback={<SectionSkeleton />}>
          <QuickAnswersSection />
        </Suspense>
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:1200px]">
        <Suspense fallback={<SectionSkeleton />}>
          <ExperienceSection />
        </Suspense>
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:1000px]">
        <Suspense fallback={<SectionSkeleton />}>
          <EducationSection />
        </Suspense>
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:1200px]">
        <Suspense fallback={<SectionSkeleton />}>
          <ProjectsSection />
        </Suspense>
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:1200px]">
        <Suspense fallback={<SectionSkeleton />}>
          <CertificationsSection />
        </Suspense>
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:1100px]">
        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection />
        </Suspense>
      </div>

      <div
        id="contact"
        className="[content-visibility:auto] [contain-intrinsic-size:1100px]"
      >
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </div>
    </>
  );
}

export default PortfolioContent;
