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
 * Successful contact form submission (not button click).
 * Use for GA4 conversion + Google Ads import: map `generate_lead` / `contact_form_submit`.
 */
export const trackContactFormSuccess = (details: {
  formLocation: string;
  formId?: string;
  intent?: string | null;
}) => {
  pushToDataLayer({
    event: "contact_form_submit",
    form_location: details.formLocation,
    form_id: details.formId ?? "contact",
    form_intent: details.intent || "general",
  });
  // GA4 recommended event name for lead forms (configure as conversion in GA4/Ads).
  pushToDataLayer({
    event: "generate_lead",
    form_location: details.formLocation,
    form_id: details.formId ?? "contact",
    form_intent: details.intent || "general",
    currency: "USD",
    value: 0,
  });
};

export const trackContactFormError = (details: {
  formLocation: string;
  formId?: string;
  errorMessage?: string;
}) => {
  pushToDataLayer({
    event: "contact_form_error",
    form_location: details.formLocation,
    form_id: details.formId ?? "contact",
    error_message: details.errorMessage ?? "unknown",
  });
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
