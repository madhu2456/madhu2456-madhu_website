"use server";

import { serverClient } from "@/sanity/lib/serverClient";

export async function submitContactForm(formData: FormData) {
  // Guard: catch missing token early with a clear message
  if (!process.env.SANITY_SERVER_API_TOKEN) {
    console.error("Contact form error: SANITY_SERVER_API_TOKEN is not set");
    return {
      success: false,
      error: "Server configuration error: missing API token",
    };
  }

  try {
    // Check honeypot field — if filled, silently fail to confuse bots
    if (formData.get("hp_field")) {
      console.warn("Honeypot field filled. Potential bot submission blocked.");
      return { success: true }; // Return success to bot to prevent retries
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Validate the required fields
    if (!name || !email || !message) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    // Create the document in Sanity
    const result = await serverClient.create({
      _type: "contact",
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Contact form submission failed:", message, error);
    return {
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? `Submission failed: ${message}`
          : "Failed to submit the form. Please try again later.",
    };
  }
}
