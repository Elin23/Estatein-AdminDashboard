export type EmailFieldKey = "to" | "subject" | "message";

export type EmailFieldDef = {
  name: EmailFieldKey;
  label: string;
  placeholder: string;
  required?: boolean;
  as?: "input" | "textarea";
  type?: "text" | "email";
  rows?: number;
};

export const emailFormData: EmailFieldDef[] = [
  {
    name: "to",
    label: "Email",
    placeholder: "client@example.com",
    required: true,
    as: "input",
    type: "email",
  },
  {
    name: "subject",
    label: "Subject",
    placeholder: "Your request update",
    required: true,
    as: "input",
    type: "text",
  },
  {
    name: "message",
    label: "Message",
    placeholder: "Write your message…",
    required: true,
    as: "textarea",
    rows: 6,
  },
];
