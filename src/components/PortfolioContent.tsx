import { NewPortfolioExperience } from "@/components/NewPortfolioExperience";
import { getPortfolioData } from "@/lib/portfolio-data";

async function PortfolioContent() {
  const {
    profile,
    skills,
    sortedExperiences,
    sortedProjects,
    sortedServices,
    sortedCertifications,
  } = await getPortfolioData();

  return (
    <NewPortfolioExperience
      profile={profile}
      skills={skills}
      experiences={sortedExperiences}
      projects={sortedProjects}
      services={sortedServices}
      certifications={sortedCertifications}
    />
  );
}

export default PortfolioContent;
