import { Suspense } from "react";
import {
  AboutSection,
  AchievementsSection,
  BlogSection,
  CertificationsSection,
  ContactSection,
  EducationSection,
  ExperienceSection,
  HeroSection,
  ProjectsSection,
  ServicesSection,
  TestimonialsSection,
} from "@/components/sections";

function SectionSkeleton() {
  return (
    <div className="py-20 px-6 animate-pulse">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="h-10 w-64 bg-muted rounded-lg" />
          <div className="h-6 w-48 bg-muted rounded-lg opacity-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="h-64 bg-muted/50 rounded-2xl" />
          <div className="h-64 bg-muted/50 rounded-2xl" />
          <div className="h-64 bg-muted/50 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

async function PortfolioContent() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ExperienceSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <EducationSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CertificationsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <AchievementsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <BlogSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection />
      </Suspense>
    </>
  );
}

export default PortfolioContent;
