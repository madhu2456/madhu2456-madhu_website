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
