import type { FormSubmission } from "../../types";

const contactFooter = `
Best regards,
Estatein Real Estate Company

Main Headquarters:
123 Estatein Plaza, City Center
Email: info@estatein.com
Phone: 1234567890

Regional Offices:
456 Urban Avenue, Downtown District, Metropolis
Email: info@estatein.com
Phone: +1 (123) 628-7890
City: Metropolis

Offices:
456 Urban Avenue, Downtown District, Metropolis
Email: info@estatein.com
Phone: +1 (123) 628-7890
City: Metropolis
`.trim();

export function composeEmailMessage(submission: FormSubmission) {
  const data = submission.data || {};

  const firstName =
    (data.firstName as string) ||
    (data.name as string) ||
    (data.fullName as string) ||
    "";

  const lastName = (data.lastName as string) || "";

  const email = (data.email as string) || (data.Email as string) || "";
  const phone = (data.phone as string) || "";
  const location = (data.location as string) || "";
  const propertyType = (data.propertyType as string) || "";
  const bedrooms = (data.bedrooms as string) || "";
  const bathrooms = (data.bathrooms as string) || "";
  const budget = (data.budget as string) || "";
  const notes = (data.message as string) || "";

  const fallbackName =
    firstName || (data.fullName as string) || "there";

  const formType =
    (submission.category as string)?.toLowerCase?.() ||
    (submission.formName as string)?.toLowerCase?.() ||
    "";

  const subject = (() => {
    const parts: string[] = [];
    if (propertyType) parts.push(propertyType);
    if (location) parts.push(`in ${location}`);
    const tail = parts.length ? parts.join(" ") : (submission.formName || "your request");

    if (formType.includes("contact")) return `Thank you for contacting us`;
    if (formType.includes("inquiry") || formType.includes("property")) {
      return `Your Property Inquiry — ${tail}`;
    }
    return `We received your request — ${tail}`;
  })();

  const greeting = lastName
    ? `Dear Mr. ${lastName},`
    : `Dear ${fallbackName},`;

  const lineAbout =
    `We are reaching out regarding your recent inquiry for a property` +
    (location ? ` in ${location}` : ``) +
    `. Our records indicate the following preferences:`;

  const summaryLines = [
    propertyType ? `• Property Type: ${propertyType}` : "",
    bedrooms || bathrooms ? `• Bedrooms / Bathrooms: ${bedrooms || "—"} / ${bathrooms || "—"}` : "",
    location ? `• Location: ${location}` : "",
    budget ? `• Budget: ${budget}` : "",
    email ? `• Email: ${email}` : "",
    phone ? `• Phone: ${phone}` : "",
    notes ? `• Additional Notes: ${notes}` : "",
  ].filter(Boolean).join("\n");

  const closing = `Our team is currently reviewing availability and pricing options that best match your criteria.
If you have preferred dates/times for a viewing, please reply with two or three options and we will arrange the earliest possible slot.

${contactFooter}`;

  const message = [
    greeting,
    "",
    lineAbout,
    "",
    summaryLines,
    "",
    closing,
  ].join("\n");

  return { subject, message };
}
