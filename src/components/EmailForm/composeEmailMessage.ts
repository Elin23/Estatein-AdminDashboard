import type { FormSubmission, ContactType } from "../../types"

export type ComposedEmail = { subject: string; message: string }

export const contactFooter = `
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
`.trim()

const S = (v: unknown) => String(v ?? "").trim()
const bullet = (label: string, value?: string) => {
  const v = S(value)
  return v ? `• ${label}: ${v}` : ""
}
const joinSpace = (parts: string[]) => parts.filter(Boolean).join(" ")

export function composeEmailMessage(submission: FormSubmission): ComposedEmail {
  const d = (submission.data ?? {}) as Record<string, unknown>

  const firstName = S(d.firstName ?? d.name ?? d.fullName)
  const lastName = S(d.lastName)
  const fallbackName = firstName || S(d.fullName) || "there"

  const email = S(d.email ?? d.Email)
  const phone = S(d.phone)
  const location = S(d.location)
  const property = S(d.propertyType)
  const bedrooms = S(d.bedrooms)
  const bathrooms = S(d.bathrooms)
  const budget = S(d.budget)
  const notes = S(d.message)

  const lowerForm = S(submission.category || submission.formName).toLowerCase()

  const tail = joinSpace([property, location ? `in ${location}` : ""])

  const subject = lowerForm.includes("contact")
    ? "Thank you for contacting us"
    : lowerForm.includes("inquiry") || lowerForm.includes("property")
    ? tail
      ? `Your Property Inquiry — ${tail}`
      : "Your Property Inquiry"
    : tail
    ? `We received your request — ${tail}`
    : "We received your request"

  const greeting = lastName
    ? `Dear ${firstName ? `${firstName} ${lastName}` : lastName},`
    : `Dear ${fallbackName},`

  const intro =
    `We are reaching out regarding your recent ${
      lowerForm.includes("inquiry") ? "inquiry" : "request"
    }` +
    (location ? ` in ${location}` : ``) +
    `. Our records indicate the following preferences:`

  const summary = [
    bullet("Property Type", property),
    bedrooms || bathrooms
      ? bullet(
          "Bedrooms / Bathrooms",
          `${bedrooms || "—"} / ${bathrooms || "—"}`
        )
      : "",
    bullet("Location", location),
    bullet("Budget", budget),
    bullet("Email", email),
    bullet("Phone", phone),
    bullet("Additional Notes", notes),
  ]
    .filter(Boolean)
    .join("\n")

  const closing = [
    "Our team is currently reviewing availability and pricing options that best match your criteria.",
    "If you have preferred dates/times for a viewing, please reply with two or three options and we will arrange the earliest possible slot.",
    "",
    contactFooter,
  ].join("\n")

  const message = [greeting, "", intro, "", summary, "", closing].join("\n")
  return { subject, message }
}

export { composeEmailMessage as composeSubmissionEmailMessage }

export function composeContactEmailMessage(
  contact: ContactType
): ComposedEmail {
  const firstName = S(contact.name).split(" ")[0] || "there"

  const subject = S(contact.subject)
    ? `Re: ${contact.subject}`
    : "Thank you for contacting us"

  const body = [
    `Hi ${firstName},`,
    "",
    "Thanks for reaching out! We received your message and will get back to you shortly.",
    "",
    contact.message ? `Your message:\n"${contact.message}"` : "",
    "",
    contactFooter,
  ]
    .filter(Boolean)
    .join("\n")

  return { subject, message: body }
}
