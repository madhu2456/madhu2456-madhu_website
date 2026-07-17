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

export type ChatInteractionAction =
  | "open"
  | "close"
  | "send_message"
  | "click_suggestion"
  | "click_source";

/**
 * Chat analytics. Never pass raw user messages or model replies —
 * use lengths / ids / sections only.
 */
export const trackChatInteraction = (
  action: ChatInteractionAction,
  details?: Record<string, unknown>,
) => {
  pushToDataLayer({
    event: "chat_interaction",
    chat_action: action,
    ...details,
  });
};
