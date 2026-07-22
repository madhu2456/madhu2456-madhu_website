import { NewPortfolioExperience } from "@/components/NewPortfolioExperience";
import { getPortfolioData } from "@/lib/portfolio-data";

async function PortfolioContent() {
  const {
    profile,
    skills,
    sortedExperiences,
    sortedEducation,
    sortedProjects,
    sortedServices,
    sortedCertifications,
    sortedNavigationItems,

    pageContent,
  } = await getPortfolioData();

  return (
    <NewPortfolioExperience
      pageContent={pageContent}
      navigationItems={sortedNavigationItems}
      profile={profile}
      skills={skills}
      experiences={sortedExperiences}
      education={sortedEducation}
      projects={sortedProjects}
      services={sortedServices}
      certifications={sortedCertifications}
    />
  );
}

export default PortfolioContent;
