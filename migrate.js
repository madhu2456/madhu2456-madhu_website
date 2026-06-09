import fs from "node:fs";
import path from "node:path";

const baseDir = "f:/Codes/Projects/madhu_portfolio";
const servicesDir = path.join(baseDir, "src/app/(portfolio)/services");
const caseStudiesDir = path.join(baseDir, "src/app/(portfolio)/case-studies");
const dataPath = path.join(baseDir, "Data/portfolio-content.json");

function extractArray(text, arrayName) {
  const regex = new RegExp(`const\\s+${arrayName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`);
  const match = text.match(regex);
  if (!match) return undefined;

  try {
    // Evaluate the array string to a JS object
    // using new Function to safely evaluate it
    return new Function(`return ${match[1]}`)();
  } catch (e) {
    console.error(`Failed to parse ${arrayName}:`, e.message);
    return undefined;
  }
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// 1. Process Services
if (data.services) {
  for (const service of data.services) {
    const pagePath = path.join(servicesDir, service.slug, "page.tsx");
    if (!fs.existsSync(pagePath)) continue;

    console.log(`Processing service: ${service.slug}`);
    const text = fs.readFileSync(pagePath, "utf-8");

    const whoThisIsFor = extractArray(text, "whoThisIsFor");
    if (whoThisIsFor) service.audience = whoThisIsFor;

    const problemsSolved = extractArray(text, "problemsSolved");
    if (problemsSolved) service.problemsSolved = problemsSolved;

    const whatIBuild = extractArray(text, "whatIBuild");
    if (whatIBuild) service.capabilityCards = whatIBuild;

    const typicalStack = extractArray(text, "typicalStack");
    if (typicalStack) service.techStackGroups = typicalStack;

    const deliverables = extractArray(text, "deliverables");
    if (deliverables) service.deliverables = deliverables;

    const faqs = extractArray(text, "faqs");
    if (faqs) {
      // rename q and a to question and answer
      service.faqs = faqs.map((f) => ({ question: f.q, answer: f.a }));
    }
  }
}

// 2. Process Case Studies
if (data.projects) {
  for (const project of data.projects) {
    const pagePath = path.join(caseStudiesDir, project.slug, "page.tsx");
    if (!fs.existsSync(pagePath)) continue;

    console.log(`Processing case study: ${project.slug}`);
    const text = fs.readFileSync(pagePath, "utf-8");

    const citableFacts = extractArray(text, "citableFacts");
    if (citableFacts) project.citableFacts = citableFacts;

    const technicalDecisions = extractArray(text, "technicalDecisions");
    if (technicalDecisions) project.technicalDecisions = technicalDecisions;

    const measuredOutcomes = extractArray(text, "measuredOutcomes");
    if (measuredOutcomes) project.measuredOutcomes = measuredOutcomes;

    const faqs = extractArray(text, "faqs");
    if (faqs) {
      project.faqs = faqs.map((f) => ({ question: f.q, answer: f.a }));
    }
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log("Migration complete.");
