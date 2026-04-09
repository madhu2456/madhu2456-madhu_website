import type { SchemaTypeDefinition } from "sanity";
import achievement from "./achievement";
import certification from "./certification";
import contact from "./contact";
import education from "./education";
import experience from "./experience";
import navigation from "./navigation";
import profile from "./profile";
import project from "./project";
import service from "./service";
import siteSettings from "./siteSettings";
import skill from "./skill";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,
    project,
    skill,
    experience,
    education,
    certification,
    achievement,
    service,
    contact,
    siteSettings,
    navigation,
  ],
};
