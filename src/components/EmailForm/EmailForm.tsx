import React from "react"
import type { EmailFormProps } from "../../types/EmailReplyModal"
import { emailFormData, type EmailFieldKey } from "../../data/emailFormData"

export default function EmailForm({
  submitLabel = "Send",
  cancelLabel = "Cancel",
  showCancel = true,
  onCancel,
  defaultEmail = "",
  defaultSubject = "",
  defaultMessage = "",
  onSubmit,
  loading = false,
}: EmailFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!onSubmit || loading) return

    const fd = new FormData(e.currentTarget)
    const to = String(fd.get("to") || "").trim()
    const subject = String(fd.get("subject") || "").trim()
    const message = String(fd.get("message") || "").trim()

    onSubmit({ to, subject, message })
  }

  const prefills: Record<EmailFieldKey, string> = {
    to: defaultEmail,
    subject: defaultSubject,
    message: defaultMessage,
  }

  const labelCls = "mb-2 block text-sm font-medium text-gray40 dark:text-gray65"

  const inputBaseCls =
    "w-full rounded-xl border border-gray75 bg-white99 px-4 py-2.5 text-gray08 outline-none transition " +
    "placeholder:text-gray50 focus:border-purple60 focus:ring-2 focus:ring-purple90 text-left " +
    "dark:border-gray15 dark:bg-gray-700 dark:text-white97 dark:focus:border-purple70 dark:focus:ring-purple90"

  const textareaBaseCls =
    "w-full resize-y rounded-xl border border-gray75 bg-white99 px-4 py-3 text-gray08 outline-none transition " +
    "placeholder:text-gray50 focus:border-purple60 focus:ring-2 focus:ring-purple90 text-left " +
    "dark:border-gray15 dark:bg-gray-700 dark:text-white97 dark:focus:border-purple70 dark:focus:ring-purple90"

  return (
    <form
      className="w-full space-y-4 text-left "
      aria-label="Email reply form"
      onSubmit={handleSubmit}
    >
      {emailFormData.map((field) => (
        <div key={field.name}>
          <label className={labelCls}>{field.label}</label>

          {field.as === "textarea" ? (
            <>
              <textarea
                name={field.name}
                rows={field.rows ?? 6}
                placeholder={field.placeholder}
                defaultValue={prefills[field.name]}
                className={textareaBaseCls}
                required={field.required}
                aria-required={field.required ? "true" : undefined}
                disabled={loading}
              />
              {field.required && (
                <div className="mt-2 text-xs text-gray50 dark:text-gray60">
                  * All fields are required
                </div>
              )}
            </>
          ) : (
            <input
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              defaultValue={prefills[field.name]}
              className={inputBaseCls}
              required={field.required}
              aria-required={field.required ? "true" : undefined}
              disabled={loading}
            />
          )}
        </div>
      ))}

      <div className="flex items-center justify-between gap-3">
        {showCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex w-1/3 items-center justify-center rounded-xl border border-gray75 bg-white99 px-4 py-2.5 text-sm font-medium text-gray40 transition
                       hover:bg-white97 active:scale-[0.98] disabled:opacity-50
                       dark:border-gray15 dark:bg-gray-700 dark:text-gray65 dark:hover:bg-gray10"
          >
            {cancelLabel}
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-purple60 px-4 py-2.5 text-sm font-semibold text-white99 shadow-sm transition
                     hover:bg-purple65 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Sending..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
