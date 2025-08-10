import emailjs from "@emailjs/browser";

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

export type EmailParams = {
  to_email: string;
  subject: string;
  message: string;
  customer_name?: string;
  form_name?: string;
  category?: string;
};

export async function sendViaEmailJS(params: EmailParams) {
  console.log("[EmailJS] params:", params, { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
  try {
    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
    console.log("[EmailJS] success:", res);
    return res;
  } catch (err: any) {
    console.error("[EmailJS] error:", err);
    throw err;
  }
}
