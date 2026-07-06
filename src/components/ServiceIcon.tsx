import {
  IconBrain,
  IconChartBar,
  IconCode,
  IconCpu,
  IconDatabase,
  IconSettings,
  IconSparkles,
} from "@tabler/icons-react";

interface ServiceIconProps {
  slug: string;
  className?: string;
}

export function ServiceIcon({
  slug,
  className = "h-6 w-6 text-primary",
}: ServiceIconProps) {
  switch (slug) {
    case "ai-llm-application-development":
      return <IconBrain className={className} />;
    case "rag-consultant-india":
      return <IconDatabase className={className} />;
    case "ai-agent-development":
      return <IconCpu className={className} />;
    case "marketing-analytics-consultant":
      return <IconChartBar className={className} />;
    case "ga4-bigquery-campaign-analytics":
      return <IconSettings className={className} />;
    case "full-stack-ai-product-development":
      return <IconCode className={className} />;
    default:
      return <IconSparkles className={className} />;
  }
}
