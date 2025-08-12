import type { EmailReplyProps } from "../../types/EmailReplyModal";
import EmailForm from "./EmailForm";

export default function EmailReplyModalUI({
  open = true,
  title = "Send an Email",
  onClose,
  onSubmit,
  loading = false,
  error = null,
  success = false,
  defaultEmail = "",
  defaultSubject = "",
  defaultMessage = "",
}: EmailReplyProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white99 p-6 shadow-2xl ring-1 ring-gray08 dark:bg-gray-800">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-gray50 transition hover:bgwhite95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple70 dark:text-gray60 dark:hover:bg-gray15"
            aria-label="Close"
          >
            ✕
          </button>

          <h3 className="text-base font-semibold text--gray08 dark:text-white95">
            {title}
          </h3>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-purple90 bg-purple97 px-3 py-2 text-sm text-purple60">
            <span>Email queued successfully. You can close this window.</span>
          </div>
        )}

        {error && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-gray75 bg-white95 px-3 py-2 text-sm text-gray20 dark:bg-gray15 dark:text-white95">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <EmailForm
          submitLabel={loading ? "Sending..." : "Send"}
          cancelLabel="Cancel"
          onCancel={onClose}
          onSubmit={onSubmit}
          loading={loading}
          defaultEmail={defaultEmail}
          defaultSubject={defaultSubject}
          defaultMessage={defaultMessage}
        />
      </div>
    </div>
  );
}
