import { NewPortfolioExperience } from "@/components/NewPortfolioExperience";
import {
  slimHomeCertifications,
  slimHomeEducation,
  slimHomeExperiences,
  slimHomePageContent,
  slimHomeProfile,
  slimHomeProjects,
  slimHomeServices,
} from "@/lib/home-page-data";
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

  // Strip case-study bodies / unused CMS fields before the client boundary
  // (audit v4: home HTML ~499KB; RSC payload was serializing full records).
  return (
    <NewPortfolioExperience
      pageContent={slimHomePageContent(pageContent)}
      navigationItems={sortedNavigationItems}
      profile={slimHomeProfile(profile)}
      skills={skills}
      experiences={slimHomeExperiences(sortedExperiences)}
      education={slimHomeEducation(sortedEducation)}
      projects={slimHomeProjects(sortedProjects)}
      services={slimHomeServices(sortedServices)}
      certifications={slimHomeCertifications(sortedCertifications)}
    />
  );
}

export default PortfolioContent;
