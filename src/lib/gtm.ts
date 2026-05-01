import { sendGTMEvent } from "@next/third-parties/google";

/**
 * Pushes an event to the Google Tag Manager dataLayer using Next.js utilities.
 */
export const pushToDataLayer = (payload: Record<string, unknown>) => {
  try {
    sendGTMEvent({
      ...payload,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GTM Error:", error);
  }
};

/**
 * Common Tracking Functions
 */

export const trackChatInteraction = (
  action: "open" | "close" | "send_message" | "click_suggestion",
  details?: Record<string, unknown>,
) => {
  pushToDataLayer({
    event: "chat_interaction",
    chat_action: action,
    ...details,
  });
};

export const trackContactForm = (
  status: "submit_attempt" | "success" | "error",
  details?: Record<string, unknown>,
) => {
  pushToDataLayer({
    event: status === "success" ? "generate_lead" : "contact_form_interaction",
    form_status: status,
    ...details,
  });
};

export const trackProjectEngagement = (
  action: "view_case_study" | "click_live_demo" | "click_github",
  projectTitle: string,
  details?: Record<string, unknown>,
) => {
  pushToDataLayer({
    event: "project_engagement",
    engagement_type: action,
    project_title: projectTitle,
    ...details,
  });
};

export const trackExternalClick = (
  label: string,
  url: string,
  category: "social" | "link" | "other" = "link",
) => {
  pushToDataLayer({
    event: "external_click",
    link_label: label,
    link_url: url,
    link_category: category,
  });
};
