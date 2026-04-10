import {
  IconBrandGithub,
  IconBrandX,
  IconBriefcase,
  IconBulb,
  IconCertificate,
  IconCode,
  IconHome,
  IconMail,
  IconMessage2,
  IconNews,
  IconQuestionMark,
  IconSchool,
  IconTools,
  IconUser,
} from "@tabler/icons-react";
import { memo } from "react";

interface DynamicIconProps {
  iconName: string;
  className?: string;
}

// Static map of icons used in the navigation.
// This allows the bundler to tree-shake everything else.
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  IconHome,
  IconUser,
  IconBriefcase,
  IconCode,
  IconBulb,
  IconTools,
  IconSchool,
  IconCertificate,
  IconNews,
  IconMail,
  IconBrandGithub,
  IconBrandX,
  IconMessage2,
};

export const DynamicIcon = memo(function DynamicIcon({
  iconName,
  className = "h-full w-full text-neutral-500 dark:text-neutral-300",
}: DynamicIconProps) {
  const Icon = ICON_MAP[iconName] ?? IconQuestionMark;
  return <Icon className={className} />;
});
